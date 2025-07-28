'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-8">
          Album Zine
        </h1>
        
        <div className="space-y-6">
          <button
            onClick={() => setShowAbout(!showAbout)}
            className="text-lg text-gray-700 hover:text-blue-600 transition-colors underline"
          >
            About
          </button>

          {showAbout && (
            <div className="bg-white bg-opacity-90 rounded-lg p-8 mx-auto max-w-3xl text-left">
              <p className="text-gray-800 mb-6 leading-relaxed">
                This tool is intended for friends to share albums and mixes with each other. 
                Submissions are due on the 15th of every month, and zines will be distributed 
                to each address during the first week of the next month.
              </p>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Guidelines:</h3>
                <ol className="list-decimal list-inside space-y-3 text-gray-800 leading-relaxed">
                  <li>
                    Only submit once per month. If you submit more than once, only your 
                    most recent submission will be included.
                  </li>
                  <li>
                    This zine is designed for people to share music in a genuine and emotional 
                    way that encourages deep listening. To this end, each recommendation should 
                    have been released more than 3 months ago (including mixes). We encourage 
                    sharing what you love about the album, memories associated with it, etc.
                  </li>
                </ol>
              </div>

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
