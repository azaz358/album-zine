'use client';

import { useState, useCallback, useEffect, useRef, ChangeEvent } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { v4 as uuidv4 } from 'uuid';
import { PageElement } from '@/types';
import DropZone from './DropZone';

interface PageEditorProps {
  pageElements: PageElement[];
  setPageElements: React.Dispatch<React.SetStateAction<PageElement[]>>;
  uploadedImages: string[];
  onImageUpload: (imageUrl: string) => void;
}

function PageEditor({ pageElements, setPageElements, uploadedImages, onImageUpload }: PageEditorProps) {
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Global click handler to deselect elements when clicking outside DropZone
  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const dropZone = document.getElementById('page-editor-canvas');
      
      // If there's a selected element and the click is outside the DropZone
      if (selectedElement && dropZone && !dropZone.contains(target)) {
        setSelectedElement(null);
      }
    };

    document.addEventListener('click', handleGlobalClick);
    
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [selectedElement]);

  const moveElement = useCallback((id: string, x: number, y: number) => {
    setPageElements((prev: PageElement[]) => prev.map((el: PageElement) => 
      el.id === id ? { ...el, x, y } : el
    ));
  }, [setPageElements]);

  const resizeElement = useCallback((id: string, width: number, height: number) => {
    setPageElements((prev: PageElement[]) => prev.map((el: PageElement) => 
      el.id === id ? { ...el, width, height } : el
    ));
  }, [setPageElements]);

  const deleteElement = useCallback((id: string) => {
    setPageElements((prev: PageElement[]) => prev.filter((el: PageElement) => el.id !== id));
    setSelectedElement(null);
  }, [setPageElements]);

  const updateTextContent = useCallback((id: string, content: string) => {
    setPageElements((prev: PageElement[]) => prev.map((el: PageElement) => 
      el.id === id ? { ...el, content } : el
    ));
  }, [setPageElements]);

  const cleanupEmptyTextElements = useCallback((exceptElementId?: string) => {
    const emptyTextElement = pageElements.find(el => 
      el.type === 'text' && 
      (!el.content || el.content.trim() === '') &&
      el.id !== exceptElementId // Don't delete the element being clicked
    );
    
    if (emptyTextElement) {
      deleteElement(emptyTextElement.id);
    }
  }, [pageElements, deleteElement]);

  const handleEditorClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    
    // Always check if there's an empty text element to remove first
    cleanupEmptyTextElements();
    
    // Don't interfere with new element creation if clicking on existing elements
    if (target.closest('[data-element]')) {
      return;
    }

    // Create new text element at click position
    if (target.closest('.absolute.inset-0')) {
      const editorElement = target.closest('.relative.bg-white.cursor-crosshair') as HTMLElement;
      if (editorElement) {
        const rect = editorElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const newTextElement: PageElement = {
          id: uuidv4(),
          type: 'text',
          x: Math.max(0, x - 75), // Center the text box
          y: Math.max(0, y - 25),
          width: 150,
          height: 50,
          content: '',
          fontSize: 14,
          fontFamily: 'Helvetica, Arial, sans-serif',
        };
        
        setPageElements((prev: PageElement[]) => [...prev, newTextElement]);
        setSelectedElement(newTextElement.id);
      }
    } else {
      // Deselect when clicking on empty space
      setSelectedElement(null);
    }
  };

  // Helper function to get image dimensions
  const getImageDimensions = (imageUrl: string): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Scale image to fit nicely in editor while preserving aspect ratio
        const maxSize = 200;
        const aspectRatio = img.width / img.height;
        
        let width, height;
        if (img.width > img.height) {
          width = Math.min(maxSize, img.width);
          height = width / aspectRatio;
        } else {
          height = Math.min(maxSize, img.height);
          width = height * aspectRatio;
        }
        
        resolve({ width, height });
      };
      img.onerror = () => {
        // Fallback dimensions if image fails to load
        resolve({ width: 150, height: 150 });
      };
      img.src = imageUrl;
    });
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Create a local URL for preview
    const imageUrl = URL.createObjectURL(file);
    onImageUpload(imageUrl);

    // TODO: In a real app, you'd upload to a server here
    // For now, we're just using local object URLs
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageAdd = async (imageUrl: string, index: number) => {
    setSelectedElement(null);
    
    // Get proper dimensions for the image
    const { width, height } = await getImageDimensions(imageUrl);
    
    const newImageElement: PageElement = {
      id: uuidv4(),
      type: 'image',
      x: 0,
      y: 0,
      width,
      height,
      imageUrl,
    };
    
    setPageElements((prev: PageElement[]) => [...prev, newImageElement]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Page Editor</h2>
        </div>

        {/* Instructions */}
        <ul className="list-disc list-inside space-y-1 mt-1 text-gray-600 text-sm mb-6">
        <li>Upload images below</li>
        <li>Click on available images to add them to your page</li>
        <li>Click on empty space to create a text box</li>
        <li>Click on images or text to select them</li>
        <li>Drag and drop elements to move them around</li>
        </ul>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 font-helvetica">
            Upload Images
          </label>
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleUploadClick}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors"
            >
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-gray-600 font-helvetica">
                <span className="font-medium text-blue-600 hover:text-blue-500">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 font-helvetica">PNG, JPG, GIF up to 10MB</p>
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
        </div>
        
        {/* Available Images */}
        {uploadedImages.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Available Images</h3>
            <div className="flex gap-2 flex-wrap">
              {uploadedImages.map((imageUrl, index) => (
                <button
                  key={index}
                  onClick={() => handleImageAdd(imageUrl, index)}
                  className="w-32 h-32 border border-gray-200 rounded hover:border-blue-400 transition-colors"
                >
                  <img
                    src={imageUrl}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Page Editor Canvas */}
        <div className="block text-sm font-medium text-gray-700 mb-2 font-helvetica">
            Layout
        </div>
        <DropZone
          pageElements={pageElements}
          setPageElements={setPageElements}
          selectedElement={selectedElement}
          setSelectedElement={setSelectedElement}
          moveElement={moveElement}
          resizeElement={resizeElement}
          deleteElement={deleteElement}
          updateTextContent={updateTextContent}
          cleanupEmptyTextElements={cleanupEmptyTextElements}
          handleEditorClick={handleEditorClick}
        />
      </div>
    </DndProvider>
  );
}

export default PageEditor; 