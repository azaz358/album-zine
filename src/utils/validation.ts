import validator from 'validator';
import { FormData } from '@/types';

export const validateEmail = (email: string): boolean => {
  return validator.isEmail(email);
};

export const validateMailingAddress = (address: string): boolean => {
  const trimmed = address.trim();
  
  // Must not be empty
  if (!trimmed) return false;
  
  // Minimum length check
  if (trimmed.length < 15) return false;
  
  // Manual validation using regex patterns
  // Should contain numbers (street number)
  const hasNumbers = /\d/.test(trimmed);
  
  // Should contain letters (street name, city)
  const hasLetters = /[a-zA-Z]/.test(trimmed);
  
  // Should have multiple words (street, city, state/zip)
  const words = trimmed.split(/\s+/).filter(word => word.length > 0);
  const hasMultipleWords = words.length >= 3;
  
  // Look for common address patterns
  const hasCommonPatterns = 
    // Street types
    /\b(st|street|ave|avenue|rd|road|blvd|boulevard|dr|drive|ln|lane|ct|court|way|pl|place)\b/i.test(trimmed) ||
    // ZIP code pattern (5 digits or 5+4 format)
    /\b\d{5}(-\d{4})?\b/.test(trimmed) ||
    // State abbreviation pattern (2 capital letters)
    /\b[A-Z]{2}\b/.test(trimmed);
  
  return hasNumbers && hasLetters && hasMultipleWords && hasCommonPatterns;
};

export interface ValidationErrors {
  firstName?: string;
  lastInitial?: string;
  email?: string;
  mailingAddress?: string;
  albumName?: string;
  artist?: string;
  yearReleased?: string;
  albumDescription?: string;
}

export const validateForm = (formData: FormData): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  // Validate all required fields are non-empty
  if (!formData.firstName.trim()) {
    errors.firstName = 'First name is required';
  }
  
  if (!formData.lastInitial.trim()) {
    errors.lastInitial = 'Last initial is required';
  }
  
  if (!formData.email.trim()) {
    errors.email = 'Email address is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!formData.mailingAddress.trim()) {
    errors.mailingAddress = 'Mailing address is required';
  } else if (!validateMailingAddress(formData.mailingAddress)) {
    errors.mailingAddress = 'Please enter a complete address with street number, street name, city, and state/ZIP code';
  }
  
  if (!formData.albumName.trim()) {
    errors.albumName = 'Album name is required';
  }
  
  if (!formData.artist.trim()) {
    errors.artist = 'Artist name is required';
  }
  
  if (!formData.yearReleased.trim()) {
    errors.yearReleased = 'Year released is required';
  } else {
    const year = parseInt(formData.yearReleased);
    const currentYear = new Date().getFullYear();
    if (isNaN(year) || year < 1900 || year > currentYear) {
      errors.yearReleased = `Please enter a valid year between 1900 and ${currentYear}`;
    }
  }

  // Album description validation
  if (!formData.albumDescription.trim()) {
    errors.albumDescription = 'Please share something about this album';
  }
  
  return errors;
}; 