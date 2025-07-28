import validator from 'validator';
import { FormData } from '@/types';
// @ts-expect-error - parse-address doesn't have TypeScript types
import parseAddress from 'parse-address';

export const validateEmail = (email: string): boolean => {
  return validator.isEmail(email);
};

export const validateMailingAddress = (address: string): boolean => {
  const trimmed = address.trim();
  
  // Must not be empty
  if (!trimmed) return false;
  
  // Minimum length check
  if (trimmed.length < 10) return false;
  
  // Use parse-address library to parse the address
  const parsed = parseAddress(trimmed);
  
  // Check if the address was successfully parsed with required components
  if (!parsed) return false;
  
  // Validate that we have essential address components
  const hasStreetNumber = parsed.number || parsed.prefix;
  const hasStreetName = parsed.street;
  const hasCity = parsed.city;
  const hasStateOrPostal = parsed.state || parsed.zip;
  
  // Address must have street info, city, and either state or postal code
  return !!(hasStreetNumber && hasStreetName && hasCity && hasStateOrPostal);
};

export interface ValidationErrors {
  firstName?: string;
  lastInitial?: string;
  email?: string;
  mailingAddress?: string;
  albumName?: string;
  artist?: string;
  yearReleased?: string;
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
  
  return errors;
}; 