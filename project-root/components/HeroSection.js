'use client';
import React from 'react';

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center px-6 py-12 md:px-8 md:py-16 md:min-h-[80vh]"
    >
      {/* Background Gradients */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle at top right, rgba(103,58,183,0.05), transparent 60%), radial-gradient(circle at bottom left, rgba(255,193,7,0.05), transparent 60%)",
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 max-w-6xl w-full flex flex-col items-center text-center">
        {/* Main Heading */}
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
          Secure Document Timestamps with{' '}
          <span className="relative text-purple-700 
            after:content-[''] after:absolute after:bottom-[0.1em] after:left-0 after:w-full after:h-[0.2em] after:bg-amber-400 after:-z-10 after:opacity-30"
          >
            Blockchain
          </span>
        </h1>

        {/* Subheading */}
        <h2 className="text-xl md:text-2xl text-gray-600 mb-8 md:mb-10 max-w-lg leading-relaxed">
          Permanently prove when your documents existed with tamper-proof timestamps. 
          Protect your intellectual property with military-grade cryptography.
        </h2>

        {/* Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-16 w-full justify-center">
          <button
            onClick={() => (window.location.href = '/register')}
            className="bg-amber-400 text-gray-800 font-semibold text-lg py-4 px-10 rounded-lg shadow transition duration-300 hover:bg-amber-500 hover:-translate-y-1 hover:shadow-lg active:translate-y-0 active:shadow-sm w-full sm:w-auto"
          >
            Get Started Free
          </button>
          <button
            onClick={() => (window.location.href = '/learn-more')}
            className="bg-transparent text-purple-700 font-semibold text-lg py-4 px-10 rounded-lg border-2 border-purple-700 transition duration-300 hover:bg-purple-50 w-full sm:w-auto"
          >
            Learn More
          </button>
        </div>

        {/* Trusted Logos Section */}
        <div className="flex flex-col items-center mt-8">
          <p className="text-base text-gray-500 mb-6 font-medium">
            TRUSTED BY THOUSANDS OF ORGANIZATIONS
          </p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-10 max-w-3xl">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-10 w-[120px] bg-gray-300 rounded transition duration-300 opacity-70 grayscale hover:opacity-90 hover:grayscale-0"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="mt-14 flex flex-wrap justify-center gap-8 md:gap-6 max-w-4xl z-10">
        {[
          { icon: '🔒', title: 'Secure', description: 'Military-grade encryption' },
          { icon: '⚡', title: 'Fast', description: 'Timestamps in seconds' },
          { icon: '📄', title: 'Verifiable', description: 'Court-admissible proof' },
          { icon: '🔗', title: 'Blockchain', description: 'Immutable records' },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg w-full sm:w-1/2 lg:w-[200px]"
          >
            <div className="text-4xl mb-4">{item.icon}</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {item.title}
            </h3>
            <p className="text-sm text-gray-500 text-center">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
