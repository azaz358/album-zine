'use client';

import { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { PageElement } from '@/types';
import ImageElement from './ImageElement';
import TextElement from './TextElement';

interface DropZoneProps {
  pageElements: PageElement[];
  setPageElements: React.Dispatch<React.SetStateAction<PageElement[]>>;
  selectedElement: string | null;
  setSelectedElement: React.Dispatch<React.SetStateAction<string | null>>;
  moveElement: (id: string, x: number, y: number) => void;
  resizeElement: (id: string, width: number, height: number) => void;
  deleteElement: (id: string) => void;
  updateTextContent: (id: string, content: string) => void;
  cleanupEmptyTextElements: (exceptElementId?: string) => void;
  handleEditorClick: (e: React.MouseEvent) => void;
}

interface DragItem {
  id: string;
  type: string;
  elementWidth?: number;
  elementHeight?: number;
}

const ItemTypes = {
  IMAGE: 'image',
  TEXT: 'text',
};

export default function DropZone({ 
  pageElements, 
  setPageElements, 
  selectedElement, 
  setSelectedElement,
  moveElement,
  resizeElement,
  deleteElement,
  updateTextContent,
  cleanupEmptyTextElements,
  handleEditorClick
}: DropZoneProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const aspectRatio = 5.5 / 6.5;

  const [{ isOver }, drop] = useDrop({
    accept: [ItemTypes.IMAGE, ItemTypes.TEXT],
    drop: (item: DragItem, monitor) => {
      if (!editorRef.current) return;
      
      const clientOffset = monitor.getClientOffset();
      const initialClientOffset = monitor.getInitialClientOffset();
      
      if (!clientOffset || !initialClientOffset) return;
      
      // Get editor position
      const editorRect = editorRef.current.getBoundingClientRect();
      
      // Find the actual element to get its current position
      const draggedElement = document.querySelector(`[data-element-id="${item.id}"]`) as HTMLElement;
      
      if (draggedElement) {
        const elementRect = draggedElement.getBoundingClientRect();
        
        // Calculate where the user initially clicked within the element
        const clickOffsetX = initialClientOffset.x - elementRect.left;
        const clickOffsetY = initialClientOffset.y - elementRect.top;
        
        // Calculate new position: current mouse position minus click offset
        const newX = clientOffset.x - editorRect.left - clickOffsetX;
        const newY = clientOffset.y - editorRect.top - clickOffsetY;
        
        // Ensure the image stays within editor bounds
        const maxX = editorRect.width - elementRect.width;
        const maxY = editorRect.height - elementRect.height;
        
        const boundedX = Math.max(0, Math.min(newX, maxX));
        const boundedY = Math.max(0, Math.min(newY, maxY));
        
        moveElement(item.id, boundedX, boundedY);
      } else {
        // Fallback: center the image under the cursor
        const elementWidth = item.elementWidth || 150;
        const elementHeight = item.elementHeight || 150;
        
        const x = clientOffset.x - editorRect.left - (elementWidth / 2);
        const y = clientOffset.y - editorRect.top - (elementHeight / 2);
        
        const boundedX = Math.max(0, Math.min(x, editorRect.width - elementWidth));
        const boundedY = Math.max(0, Math.min(y, editorRect.height - elementHeight));
        
        moveElement(item.id, boundedX, boundedY);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div 
      id="page-editor-canvas" 
      className="border border-gray-300 bg-white rounded-lg overflow-hidden"
      style={{ maxWidth: '600px' }}
    >
      <div
        ref={(node) => {
          editorRef.current = node;
          drop(node);
        }}
        className="relative bg-white cursor-crosshair"
        style={{
          width: '100%',
          paddingTop: `${(1 / aspectRatio) * 100}%`,
        }}
        onClick={handleEditorClick}
      >
        <div className="absolute inset-0">
          {pageElements.map((element) => {
            if (element.type === 'image') {
              return (
                <ImageElement
                  key={element.id}
                  element={element}
                  isSelected={selectedElement === element.id}
                  onMove={moveElement}
                  onResize={resizeElement}
                  onDelete={deleteElement}
                  onSelect={setSelectedElement}
                  onCleanupEmpty={cleanupEmptyTextElements}
                />
              );
            }
            if (element.type === 'text') {
              return (
                <TextElement
                  key={element.id}
                  element={element}
                  isSelected={selectedElement === element.id}
                  onMove={moveElement}
                  onResize={resizeElement}
                  onDelete={deleteElement}
                  onSelect={setSelectedElement}
                  onContentChange={updateTextContent}
                  onCleanupEmpty={cleanupEmptyTextElements}
                />
              );
            }
            return null;
          })}
          
          {/* Drop overlay */}
          {isOver && (
            <div className="absolute inset-0 bg-blue-100 bg-opacity-50 border-2 border-dashed border-blue-400" />
          )}
        </div>
      </div>
    </div>
  );
} 