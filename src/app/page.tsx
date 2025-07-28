'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <div className="bg-blue-100 h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-8">
          Album Zine
        </h1>
        
        <div className="space-y-6">
          <button
            onClick={() => setShowAbout(!showAbout)}
            className="text-lg text-gray-700 hover:text-blue-600 transition-colors font-semibold underline"
          >
            About
          </button>

          {showAbout && (
            <div className="p-8 mx-auto max-w-3xl text-center opacity-0 animate-fade-in">
              <p className="text-gray-800 mb-12 leading-relaxed">
                This tool is intended for friends to share albums with each other. 
                Submissions are due on the 15th of every month, and zines will be distributed 
                to each address during the first week of the next month.
              </p>

              <div className="mt-8 text-center">
                <Link
                  href="/submit"
                  className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                >
                  Submit Your Album
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
