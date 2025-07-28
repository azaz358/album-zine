'use client';

import { useRef, ChangeEvent } from 'react';
import { FormData } from '@/types';
import { ValidationErrors } from '@/utils/validation';

interface SubmissionFormProps {
  formData: FormData;
  onFormChange: (field: string, value: string) => void;
  onImageUpload: (imageUrl: string) => void;
  uploadedImages: string[];
  validationErrors?: ValidationErrors;
}

// Helper component for field errors
function FieldError({ error }: { error?: string }) {
  if (!error) return null;
  return <p className="text-red-600 text-sm mt-1">{error}</p>;
}

export default function SubmissionForm({
  formData,
  onFormChange,
  onImageUpload,
  uploadedImages,
  validationErrors = {}
}: SubmissionFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const removeImage = (imageUrl: string) => {
    // TODO: Implement image removal
    console.log('Remove image:', imageUrl);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Album Information</h2>
      
      {/* Personal Information */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={(e) => onFormChange('firstName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
              validationErrors.firstName ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Your first name"
          />
          <FieldError error={validationErrors.firstName} />
        </div>
        <div>
          <label htmlFor="lastInitial" className="block text-sm font-medium text-gray-700 mb-2">
            Last Initial
          </label>
          <input
            type="text"
            id="lastInitial"
            value={formData.lastInitial}
            onChange={(e) => onFormChange('lastInitial', e.target.value.slice(0, 1).toUpperCase())}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
              validationErrors.lastInitial ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="X"
            maxLength={1}
          />
          <FieldError error={validationErrors.lastInitial} />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => onFormChange('email', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
            validationErrors.email ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="your.email@example.com"
        />
        <FieldError error={validationErrors.email} />
      </div>

      <div>
        <label htmlFor="mailingAddress" className="block text-sm font-medium text-gray-700 mb-2">
          Mailing Address
        </label>
        <textarea
          id="mailingAddress"
          value={formData.mailingAddress}
          onChange={(e) => onFormChange('mailingAddress', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
            validationErrors.mailingAddress ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="123 Main Street, Anytown, CA 90210"
          rows={3}
        />
        <FieldError error={validationErrors.mailingAddress} />
      </div>

      {/* Album Information */}
      <div>
        <label htmlFor="albumName" className="block text-sm font-medium text-gray-700 mb-2">
          Album Name
        </label>
        <input
          type="text"
          id="albumName"
          value={formData.albumName}
          onChange={(e) => onFormChange('albumName', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
            validationErrors.albumName ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter album name"
        />
        <FieldError error={validationErrors.albumName} />
      </div>

      <div>
        <label htmlFor="artist" className="block text-sm font-medium text-gray-700 mb-2">
          Artist
        </label>
        <input
          type="text"
          id="artist"
          value={formData.artist}
          onChange={(e) => onFormChange('artist', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
            validationErrors.artist ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter artist name"
        />
        <FieldError error={validationErrors.artist} />
      </div>

      <div>
        <label htmlFor="yearReleased" className="block text-sm font-medium text-gray-700 mb-2">
          Year Released
        </label>
        <input
          type="number"
          id="yearReleased"
          value={formData.yearReleased}
          onChange={(e) => onFormChange('yearReleased', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
            validationErrors.yearReleased ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder={new Date().getFullYear().toString()}
          min="1900"
          max={new Date().getFullYear()}
        />
        <FieldError error={validationErrors.yearReleased} />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Images
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
            <p className="text-gray-600">
              <span className="font-medium text-blue-600 hover:text-blue-500">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
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
    </div>
  );
} 