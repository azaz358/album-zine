'use client';

import { useState } from 'react';
import SubmissionForm from '@/components/SubmissionForm';
import PageEditor from '@/components/PageEditor';
import { FormData, PageElement } from '@/types';
import { validateForm, ValidationErrors } from '@/utils/validation';
// @ts-expect-error - dom-to-image-more doesn't have types
import domtoimage from 'dom-to-image-more';

export default function Submit() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastInitial: '',
    email: '',
    mailingAddress: '',
    albumName: '',
    artist: '',
    yearReleased: '',
  });
  
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [pageElements, setPageElements] = useState<PageElement[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImages(prev => [...prev, imageUrl]);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setValidationErrors({});
      
      // Validate form fields
      const errors = validateForm(formData);
      
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        setIsSubmitting(false);
        return;
      }
      
      // Capture canvas screenshot
      let pageScreenshot = '';
      const canvasElement = document.getElementById('page-editor-canvas');
      if (canvasElement) {
        try {
          // Use dom-to-image-more for better reliability
          pageScreenshot = await domtoimage.toPng(canvasElement, {
            quality: 1.0,
            bgcolor: '#ffffff',
            width: canvasElement.scrollWidth,
            height: canvasElement.scrollHeight,
            style: {
              transform: 'scale(1)',
              transformOrigin: 'top left'
            }
          });
        } catch (error) {
          console.error('Failed to capture page screenshot:', error);
          alert('Failed to capture page design. Please try again.');
          setIsSubmitting(false);
          return;
        }
      }

      const submission = {
        ...formData,
        yearReleased: parseInt(formData.yearReleased),
        pageScreenshot
      };

      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
      });

      if (response.ok) {
        alert('Submission successful!');
        // Reset form
        setFormData({
          firstName: '',
          lastInitial: '',
          email: '',
          mailingAddress: '',
          albumName: '',
          artist: '',
          yearReleased: '',
        });
        setUploadedImages([]);
        setPageElements([]);
      } else {
        const errorData = await response.json();
        alert(`Error submitting form: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting form');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Your Album</h1>
          <p className="text-gray-600">
            Share your favorite album and create a beautiful page layout for it.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <SubmissionForm
              formData={formData}
              onFormChange={handleFormChange}
              onImageUpload={handleImageUpload}
              uploadedImages={uploadedImages}
              validationErrors={validationErrors}
            />
            
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Recommendation'}
            </button>
          </div>

          {/* Right Column - Page Editor */}
          <div className="lg:sticky lg:top-8">
            <PageEditor
              pageElements={pageElements}
              setPageElements={setPageElements}
              uploadedImages={uploadedImages}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 