#!/usr/bin/env python3
"""
Working input handler - properly handles multiple inputs
"""

import os
import time
import threading
import subprocess
import select
from queue import Queue, Empty

class WorkingInputThread(threading.Thread):
    """Properly working input handler using select for non-blocking I/O"""
    
    def __init__(self, cmd, cmd_id, client, event_loop):
        super().__init__()
        self.cmd = cmd
        self.cmd_id = cmd_id
        self.client = client
        self.alive = True
        self.daemon = True
        self.process = None
        self.input_queue = Queue()
        # Store main loop reference
        from tornado.ioloop import IOLoop
        self.main_loop = IOLoop.current()
        
    def stop(self):
        """Stop the program"""
        self.alive = False
        if self.process:
            try:
                self.process.terminate()
                self.process.kill()
            except:
                pass
    
    def send_input(self, user_input):
        """Queue input to send"""
        # Queue the input
        self.input_queue.put(user_input)
        return True
    
    def send_to_client(self, code, data):
        """Send to client via main loop"""
        from .response import response
        self.main_loop.add_callback(response, self.client, self.cmd_id, code, data)
    
    def run(self):
        """Run with proper non-blocking I/O"""
        print(f'[{self.client.id}-Program {self.cmd_id} starting with interactive I/O]')
        
        try:
            # Start process with pipes
            self.process = subprocess.Popen(
                self.cmd,
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                universal_newlines=True,
                bufsize=0  # Unbuffered
            )
            
            # Make stdout non-blocking using select
            import fcntl
            fd = self.process.stdout.fileno()
            flags = fcntl.fcntl(fd, fcntl.F_GETFL)
            fcntl.fcntl(fd, fcntl.F_SETFL, flags | os.O_NONBLOCK)
            
            buffer = ""
            last_char_time = time.time()
            
            while self.alive and self.process.poll() is None:
                # Use select to check if data is available
                readable, _, _ = select.select([self.process.stdout], [], [], 0.01)
                
                if readable:
                    try:
                        # Read available data
                        chunk = os.read(fd, 4096).decode('utf-8', errors='replace')
                        if chunk:
                            buffer += chunk
                            last_char_time = time.time()
                            # Successfully read chunk
                            
                            # Process complete lines
                            while '\n' in buffer:
                                line, buffer = buffer.split('\n', 1)
                                self.send_to_client(0, {'stdout': line})
                                # Line sent to client
                    except:
                        pass
                
                # Check if we're waiting for input (buffer has content and no new data for a bit)
                if buffer and (time.time() - last_char_time) > 0.1:
                    # Check if it looks like an input prompt
                    if (buffer.endswith(': ') or buffer.endswith('? ') or 
                        buffer.endswith('> ') or buffer.endswith('>>> ') or
                        ': ' in buffer[-30:]):  # Check last 30 chars for prompt pattern
                        
                        # Detected input prompt
                        
                        # Send prompt to client
                        self.send_to_client(0, {'stdout': buffer})
                        
                        # Request input from user
                        self.send_to_client(2000, {
                            'type': 'input_request',
                            'prompt': buffer
                        })
                        
                        buffer = ""
                        
                        # Wait for user input
                        # Wait for user input
                        try:
                            user_input = self.input_queue.get(timeout=60)
                            # Got user input
                            
                            # Send to process
                            if not user_input.endswith('\n'):
                                user_input += '\n'
                            self.process.stdin.write(user_input)
                            self.process.stdin.flush()
                            
                            # Echo to console
                            self.send_to_client(0, {'stdout': user_input.strip()})
                            
                        except Empty:
                            # Input timeout
                            self.send_to_client(0, {'stdout': '[Input timeout]'})
                            self.process.stdin.write('\n')
                            self.process.stdin.flush()
                    
                    elif len(buffer) > 200:  # Flush large buffers
                        self.send_to_client(0, {'stdout': buffer})
                        buffer = ""
                
                # Check for queued input (for programs that read without prompting)
                try:
                    user_input = self.input_queue.get_nowait()
                    if not user_input.endswith('\n'):
                        user_input += '\n'
                    self.process.stdin.write(user_input)
                    self.process.stdin.flush()
                    # Sent queued input
                except Empty:
                    pass
            
            # Send any remaining output
            if buffer:
                self.send_to_client(0, {'stdout': buffer})
            
            # Send completion
            exit_code = self.process.returncode if self.process else -1
            self.send_to_client(1111, {'stdout': f'\n[Program finished with exit code {exit_code}]'})
            # Program finished
            
        except Exception as e:
            print(f'[Program {self.cmd_id} exception]: {e}')
            self.send_to_client(1111, {'stdout': f'[Error: {e}]'})
        finally:
            self.stop()
            # Program terminated