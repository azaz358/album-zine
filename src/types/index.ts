export interface FormData {
  firstName: string;
  lastInitial: string;
  email: string;
  mailingAddress: string;
  albumName: string;
  artist: string;
  yearReleased: string;
  albumDescription: string;
}

export interface PageElement {
  id: string;
  type: 'image' | 'text';
  x: number;
  y: number;
  width: number;
  height: number;
  // Image-specific properties
  imageUrl?: string;
  // Text-specific properties
  content?: string;
  fontSize?: number;
  fontFamily?: string;
}

export interface Submission extends Omit<FormData, 'yearReleased'> {
  id: string;
  yearReleased: number;
  createdAt: string;
  updatedAt: string;
  pageScreenshot?: string;
} 