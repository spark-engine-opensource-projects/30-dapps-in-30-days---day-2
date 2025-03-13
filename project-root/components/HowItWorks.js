'use client';
import React from 'react';

export default function HowItWorks() {
  return (
    <section className="py-16 px-8 md:py-12 md:px-6 bg-gradient-to-br from-white to-gray-100 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="relative inline-block text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            How It Works
            <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-20 h-1 bg-amber-400 rounded"></div>
          </h1>
          <p className="text-lg text-gray-600 max-w-lg mx-auto leading-relaxed">
            Our document timestamping service provides a secure, blockchain-based method to prove the existence of your documents at a specific point in time.
          </p>
        </header>

        {/* Steps */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-10 mt-12 md:gap-8">
          {/* Step 1 */}
          <div className="relative bg-white rounded-xl p-8 shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
            {/* Left accent bar */}
            <div className="absolute top-0 left-0 h-full w-1 bg-amber-400"></div>
            <div className="relative flex items-center mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-400 shadow-md mr-4 flex-shrink-0">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 m-0">
                Upload Your Document
              </h3>
            </div>
            <p className="text-gray-500 leading-relaxed mb-6">
              Select and upload the document you want to timestamp. We accept various file formats including PDF, DOC, JPG, and more.
            </p>
            <div className="bg-gray-50 rounded-md p-4 border-l-4 border-green-400">
              <p className="text-sm text-gray-500 m-0">
                Your document remains private. We only calculate and store a unique fingerprint (hash) of your file.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative bg-white rounded-xl p-8 shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="absolute top-0 left-0 h-full w-1 bg-green-400"></div>
            <div className="relative flex items-center mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-400 shadow-md mr-4 flex-shrink-0">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 m-0">
                Generate Document Hash
              </h3>
            </div>
            <p className="text-gray-500 leading-relaxed mb-6">
              Our system creates a unique cryptographic hash of your document using the SHA-256 algorithm. This hash serves as a digital fingerprint for your document.
            </p>
            <div className="bg-gray-50 rounded-md p-4 border-l-4 border-purple-700">
              <p className="text-sm text-gray-500 font-mono m-0 break-words">
                Example hash: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative bg-white rounded-xl p-8 shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="absolute top-0 left-0 h-full w-1 bg-purple-700"></div>
            <div className="relative flex items-center mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-700 shadow-md mr-4 flex-shrink-0">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 m-0">
                Record on Blockchain
              </h3>
            </div>
            <p className="text-gray-500 leading-relaxed mb-6">
              The document hash is permanently recorded on the blockchain with a timestamp. This creates an immutable record proving the document existed at that specific time.
            </p>
            <div className="bg-gray-50 rounded-md p-4 border-l-4 border-amber-400">
              <p className="text-sm text-gray-500 m-0">
                Once recorded, the timestamp cannot be altered or tampered with, providing irrefutable proof of your document's existence.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Explanation Section */}
        <div className="mt-20 bg-white rounded-xl p-10 shadow-xl md:p-6">
          <h2 className="flex items-center text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            <span className="inline-block w-4 h-4 bg-purple-700 mr-3 rounded"></span>
            Technical Process Explained
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Cryptographic Hashing
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                We use the SHA-256 cryptographic hash function to generate a unique, fixed-length string of characters that represents your document. Even the smallest change to your document will produce a completely different hash, ensuring the integrity of your timestamped document.
              </p>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Blockchain Anchoring
              </h3>
              <p className="text-gray-600 leading-relaxed">
                The document hash is anchored to the blockchain through a transaction that includes the hash and a timestamp. This creates a permanent, immutable record that can be independently verified by anyone, without requiring access to the original document.
              </p>
            </div>
            <div className="relative bg-gray-50 rounded-md p-6 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-green-400 to-purple-700"></div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Verification Process
              </h3>
              <ol className="text-gray-600 pl-6 space-y-4">
                <li>Upload the document you want to verify</li>
                <li>Our system calculates the document's hash</li>
                <li>The system searches the blockchain for matching hash records</li>
                <li>If found, we display the timestamp and blockchain transaction details</li>
                <li>You can independently verify this information on any blockchain explorer</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Interactive Call-to-Action */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            Ready to Timestamp Your Document?
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-8 leading-relaxed">
            Start securing your important documents with our blockchain timestamping service today.
          </p>
          {/* <button
            className="relative overflow-hidden bg-amber-400 text-gray-800 font-semibold text-lg py-3 px-8 rounded-lg shadow transition-all duration-200 hover:bg-amber-500 hover:-translate-y-1 hover:shadow-lg active:translate-y-0 active:shadow-sm"
          >
            Get Started Now
            <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700 hover:left-full"></div>
          </button> */}
        </div>
      </div>
    </section>
  );
}
