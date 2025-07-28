'use client';

import { useState, useRef, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { PageElement } from '@/types';

interface TextElementProps {
  element: PageElement;
  isSelected: boolean;
  onMove: (id: string, x: number, y: number) => void;
  onResize: (id: string, width: number, height: number) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
  onContentChange: (id: string, content: string) => void;
  onCleanupEmpty: (exceptElementId?: string) => void;
}

const ItemTypes = {
  TEXT: 'text',
};

export default function TextElement({
  element,
  isSelected,
  onMove,
  onResize,
  onDelete,
  onSelect,
  onContentChange,
  onCleanupEmpty
}: TextElementProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ 
    x: 0, 
    y: 0, 
    width: 0, 
    height: 0
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const [{ isDragging }, dragRef] = useDrag({
    type: ItemTypes.TEXT,
    item: () => ({
      id: element.id,
      type: element.type,
      elementWidth: element.width,
      elementHeight: element.height
    }),
    canDrag: !isResizing && !isEditing,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  // Focus text area when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Clean up any empty text elements first (except this one)
    onCleanupEmpty(element.id);
    
    onSelect(element.id);
    
    // Don't start editing if clicking on resize handle or delete button
    const target = e.target as HTMLElement;
    if (!target.closest('.resize-handle') && !target.closest('.delete-button')) {
      setIsEditing(true);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onContentChange(element.id, e.target.value);
  };

  const handleTextBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
    // Allow Enter to create new lines in text
    e.stopPropagation();
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: element.width,
      height: element.height
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
      
      // Calculate new dimensions (minimum size constraints)
      const newWidth = Math.max(100, resizeStart.width + deltaX);
      const newHeight = Math.max(50, resizeStart.height + deltaY);
      
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
      data-element="text"
      data-element-id={element.id}
      className={`absolute select-none ${
        !isResizing && !isEditing ? 'cursor-move' : ''
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
      {/* Text content */}
      <div className="w-full h-full relative">
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={element.content || ''}
            onChange={handleTextChange}
            onBlur={handleTextBlur}
            onKeyDown={handleKeyDown}
            className="w-full h-full p-2 border-0 bg-transparent resize-none outline-none text-black"
            style={{
              fontSize: element.fontSize || 14,
              fontFamily: element.fontFamily || 'Helvetica, Arial, sans-serif',
              lineHeight: '1.4'
            }}
            placeholder="Enter text..."
          />
        ) : (
          <div
            className="w-full h-full p-2 text-black overflow-hidden"
            style={{
              fontSize: element.fontSize || 14,
              fontFamily: element.fontFamily || 'Helvetica, Arial, sans-serif',
              lineHeight: '1.4',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word'
            }}
          >
            {element.content || 'Enter text...'}
          </div>
        )}
      </div>
      
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
            className="delete-button absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 z-20 cursor-pointer shadow-md"
          >
            ×
          </button>
          
          {/* Resize handle */}
          <div
            onMouseDown={handleResizeMouseDown}
            className={`resize-handle absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 cursor-se-resize z-20 border-2 border-white shadow-md ${
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