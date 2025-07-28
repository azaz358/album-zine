'use client';


import { FormData } from '@/types';
import { ValidationErrors } from '@/utils/validation';

interface SubmissionFormProps {
  formData: FormData;
  onFormChange: (field: string, value: string) => void;
  validationErrors?: ValidationErrors;
}

// Helper component for field errors
function FieldError({ error }: { error?: string }) {
  if (!error) return null;
  return <p className="text-red-600 text-sm mt-1 font-helvetica">{error}</p>;
}

export default function SubmissionForm({
  formData,
  onFormChange,
  validationErrors = {}
}: SubmissionFormProps) {

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Album Information</h2>
      
      {/* Personal Information */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2 font-helvetica">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={(e) => onFormChange('firstName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:font-helvetica ${
              validationErrors.firstName ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Your first name"
          />
          <FieldError error={validationErrors.firstName} />
        </div>
        <div>
          <label htmlFor="lastInitial" className="block text-sm font-medium text-gray-700 mb-2 font-helvetica">
            Last Initial
          </label>
          <input
            type="text"
            id="lastInitial"
            value={formData.lastInitial}
            onChange={(e) => onFormChange('lastInitial', e.target.value.slice(0, 1).toUpperCase())}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:font-helvetica ${
              validationErrors.lastInitial ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="X"
            maxLength={1}
          />
          <FieldError error={validationErrors.lastInitial} />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 font-helvetica">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => onFormChange('email', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:font-helvetica ${
            validationErrors.email ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="your.email@example.com"
        />
        <FieldError error={validationErrors.email} />
      </div>

      <div>
        <label htmlFor="mailingAddress" className="block text-sm font-medium text-gray-700 mb-2 font-helvetica">
          Mailing Address
        </label>
        <textarea
          id="mailingAddress"
          value={formData.mailingAddress}
          onChange={(e) => onFormChange('mailingAddress', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:font-helvetica ${
            validationErrors.mailingAddress ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="123 Main Street, Anytown, CA 90210"
          rows={3}
        />
        <FieldError error={validationErrors.mailingAddress} />
      </div>

      {/* Album Information */}
      <div>
        <label htmlFor="albumName" className="block text-sm font-medium text-gray-700 mb-2 font-helvetica">
          Album Name
        </label>
        <input
          type="text"
          id="albumName"
          value={formData.albumName}
          onChange={(e) => onFormChange('albumName', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:font-helvetica ${
            validationErrors.albumName ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter album name"
        />
        <FieldError error={validationErrors.albumName} />
      </div>

      <div>
        <label htmlFor="artist" className="block text-sm font-medium text-gray-700 mb-2 font-helvetica">
          Artist
        </label>
        <input
          type="text"
          id="artist"
          value={formData.artist}
          onChange={(e) => onFormChange('artist', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:font-helvetica ${
            validationErrors.artist ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter artist name"
        />
        <FieldError error={validationErrors.artist} />
      </div>

      <div>
        <label htmlFor="yearReleased" className="block text-sm font-medium text-gray-700 mb-2 font-helvetica">
          Year Released
        </label>
        <input
          type="number"
          id="yearReleased"
          value={formData.yearReleased}
          onChange={(e) => onFormChange('yearReleased', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:font-helvetica ${
            validationErrors.yearReleased ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder={new Date().getFullYear().toString()}
          min="1900"
          max={new Date().getFullYear()}
        />
        <FieldError error={validationErrors.yearReleased} />
      </div>

      {/* Album Description */}
      <div>
        <label htmlFor="albumDescription" className="block text-sm font-medium text-gray-700 mb-2 font-helvetica">
          What do you want to share about this album?
        </label>
        <textarea
          id="albumDescription"
          value={formData.albumDescription}
          onChange={(e) => onFormChange('albumDescription', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:font-helvetica ${
            validationErrors.albumDescription ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Share what you love about this album, memories associated with it, why you&apos;re recommending it..."
          rows={5}
        />
        <FieldError error={validationErrors.albumDescription} />
      </div>

    </div>
  );
} 