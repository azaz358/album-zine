'use client';

import { useState, useEffect } from 'react';
import { PageElement } from '@/types';

interface Submission {
  id: string;
  firstName: string;
  lastInitial: string;
  albumName: string;
  artist: string;
  yearReleased: number;
  createdAt: string;
  pageLayout?: {
    elements: PageElement[];
    images: string[];
  };
}

export default function Issues() {
  <div>
    Hello world!
  </div>
} 