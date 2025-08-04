import React from 'react';
import { Chrome } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function AuthModal({ isOpen, onClose }) {
  const { signInWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (!error) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Sign in to save your resume</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <p className="text-muted-foreground">
            Sign in to save your resume sections, manage multiple resumes, and access your work from anywhere.
          </p>

          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full gap-3"
          >
            <Chrome className="w-5 h-5" />
            Continue with Google
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}