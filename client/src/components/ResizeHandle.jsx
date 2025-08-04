import React, { useState, useRef, useEffect } from 'react';
import { GripVertical } from 'lucide-react';

export default function ResizeHandle({ onResize, getCurrentWidth, className = "" }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - dragStartX.current;
      const newWidth = dragStartWidth.current + deltaX;
      
      onResize(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onResize]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartWidth.current = getCurrentWidth();
  };

  return (
    <div
      className={`group relative flex items-center justify-center w-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-col-resize transition-all duration-200 ${isDragging ? 'bg-blue-500 dark:bg-blue-400' : ''} ${isHovered ? 'w-2' : ''} ${className}`}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Visual handle */}
      <div className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${isHovered || isDragging ? 'opacity-100' : 'opacity-0'}`}>
        <div className="h-12 w-1 bg-gray-400 dark:bg-gray-500 rounded-full flex items-center justify-center">
          <GripVertical className="w-3 h-3 text-gray-600 dark:text-gray-300" />
        </div>
      </div>
      
      {/* Hover area */}
      <div className="absolute inset-y-0 -left-2 -right-2" />
    </div>
  );
}