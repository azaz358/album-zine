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
    albumDescription: '',
  });
  
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [pageElements, setPageElements] = useState<PageElement[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
        // Reset form
        setFormData({
          firstName: '',
          lastInitial: '',
          email: '',
          mailingAddress: '',
          albumName: '',
          artist: '',
          yearReleased: '',
          albumDescription: '',
        });
        setUploadedImages([]);
        setPageElements([]);
        setIsSubmitted(true);
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
    <div className="min-h-screen bg-blue-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Your Album</h1>
          <p className="text-gray-600 mt-4">
            This zine is designed for sharing music in a genuine, emotional 
            way. To combat the discovery-driven, contextless way in which streaming services
            often present music, each recommendation should be at least 3 months old. We encourage 
            sharing what you love about the album, memories associated with it, mini history lessons about the artist,
            whatever floats your boat!
          </p>
          <p className="text-gray-600 mt-4">
            If you submit more than once before the month&apos;s deadline, only your most recent submission will be included.
          </p>
        </div>

        <div className="space-y-8">
          {/* Form or Success Message */}
          {isSubmitted ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-green-800 mb-2">Submission Successful!</h2>
              <p className="text-green-700 font-helvetica">
                Thank you for your recommendation! Stay tuned for the next zine.
              </p>
            </div>
          ) : (
            <SubmissionForm
              formData={formData}
              onFormChange={handleFormChange}
              validationErrors={validationErrors}
            />
          )}
          
          {/* Page Editor */}
          {/* <PageEditor
            pageElements={pageElements}
            setPageElements={setPageElements}
            uploadedImages={uploadedImages}
            onImageUpload={handleImageUpload}
          /> */}
          
          {/* Submit Button */}
          {!isSubmitted && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Recommendation'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 