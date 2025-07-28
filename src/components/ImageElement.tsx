'use client';

import { useState, useRef, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { PageElement } from '@/types';

interface ImageElementProps {
  element: PageElement;
  isSelected: boolean;
  onMove: (id: string, x: number, y: number) => void;
  onResize: (id: string, width: number, height: number) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
  onCleanupEmpty: (exceptElementId?: string) => void;
}

const ItemTypes = {
  IMAGE: 'image',
};

export default function ImageElement({
  element,
  isSelected,
  onMove,
  onResize,
  onDelete,
  onSelect,
  onCleanupEmpty
}: ImageElementProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ 
    x: 0, 
    y: 0, 
    width: 0, 
    height: 0,
    aspectRatio: 1
  });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, dragRef] = useDrag({
    type: ItemTypes.IMAGE,
    item: () => ({
      id: element.id,
      type: element.type,
      elementWidth: element.width,
      elementHeight: element.height
    }),
    canDrag: !isResizing,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Clean up any empty text elements first
    onCleanupEmpty();
    
    onSelect(element.id);
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    const aspectRatio = element.width / element.height;
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: element.width,
      height: element.height,
      aspectRatio
    });
  };

  // Handle resize mouse events
  useEffect(() => {
    const handleResizeMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      e.preventDefault();
      
      // Calculate the distance moved
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      // Use the larger delta to maintain aspect ratio
      const delta = Math.max(deltaX, deltaY);
      
      // Calculate new dimensions maintaining aspect ratio
      const newWidth = Math.max(50, resizeStart.width + delta);
      const newHeight = newWidth / resizeStart.aspectRatio;
      
      onResize(element.id, newWidth, newHeight);
    };

    const handleResizeMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMouseMove);
      document.addEventListener('mouseup', handleResizeMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleResizeMouseMove);
        document.removeEventListener('mouseup', handleResizeMouseUp);
      };
    }
  }, [isResizing, resizeStart, onResize, element.id]);

  return (
    <div
      ref={(node) => {
        containerRef.current = node;
        dragRef(node);
      }}
      data-element="image"
      data-element-id={element.id}
      className={`absolute select-none ${
        !isResizing ? 'cursor-move' : ''
      } ${isDragging ? 'opacity-50' : ''} ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
      }}
      onClick={handleClick}
    >
      {/* Image content */}
      <img
        src={element.imageUrl}
        alt="Page element"
        className="w-full h-full object-cover rounded shadow-sm"
        draggable={false}
        style={{ pointerEvents: 'none' }} // Prevent image from interfering with drag
      />
      
      {/* Controls - only show when selected */}
      {isSelected && (
        <>
          {/* Delete button */}
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(element.id);
            }}
            className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 z-20 cursor-pointer shadow-md"
          >
            ×
          </button>
          
          {/* Resize handle */}
          <div
            onMouseDown={handleResizeMouseDown}
            className={`absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 cursor-se-resize z-20 border-2 border-white shadow-md ${
              isResizing ? 'bg-blue-600' : 'hover:bg-blue-600'
            }`}
            style={{ borderRadius: '0 0 4px 0' }}
          />
          
          {/* Selection border */}
          <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none rounded" />
        </>
      )}
    </div>
  );
} 