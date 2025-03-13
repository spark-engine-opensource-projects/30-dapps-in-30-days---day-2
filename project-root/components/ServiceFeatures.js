'use client';
import React from 'react';

export default function ServiceFeatures() {
  return (
    <section className="relative overflow-hidden bg-[#fafafa] py-20 px-8 md:py-12 md:px-6">
      {/* Background Gradient Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,193,7,0.05) 0%, rgba(103,58,183,0.05) 100%)",
        }}
      ></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="relative inline-block text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Secure Document Timestamping
            <span className="absolute bottom-[-12px] left-1/2 -translate-x-1/2 w-20 h-1 rounded bg-gradient-to-r from-amber-400 to-purple-700"></span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our advanced platform provides tamper-proof verification with cutting-edge blockchain technology
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature Card 1 */}
          <div className="relative bg-white rounded-xl p-8 flex flex-col items-center text-center shadow-md transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl overflow-hidden">
            {/* Vertical Accent Bar */}
            <div className="absolute top-0 left-0 h-[60%] w-1 bg-amber-400 rounded-tl-xl transform scale-y-0 origin-top transition-transform duration-300 hover:scale-y-100"></div>
            <div className="w-20 h-20 rounded-full bg-[#FFF8E1] flex items-center justify-center mb-6 transition-colors duration-300 hover:bg-[#FFF0C4]">
              <svg
                className="w-10 h-10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFC107"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Military-Grade Security</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              Your documents are protected with advanced encryption standards ensuring maximum security and privacy.
            </p>
            {/* <a
              href="#"
              className="inline-flex items-center text-purple-700 font-medium text-base transition-colors duration-200 hover:text-amber-400"
            >
              Learn more
              <svg
                className="ml-2 w-4 h-4 transition-transform duration-200 hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a> */}
          </div>

          {/* Feature Card 2 */}
          <div className="relative bg-white rounded-xl p-8 flex flex-col items-center text-center shadow-md transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl overflow-hidden">
            <div className="absolute top-0 left-0 h-[60%] w-1 bg-green-400 rounded-tl-xl transform scale-y-0 origin-top transition-transform duration-300 hover:scale-y-100"></div>
            <div className="w-20 h-20 rounded-full bg-[#F1F8E9] flex items-center justify-center mb-6 transition-colors duration-300 hover:bg-[#E8F5E9]">
              <svg
                className="w-10 h-10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8BC34A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Blockchain Verification</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              Immutable timestamps backed by decentralized blockchain technology provide tamper-proof verification.
            </p>
            {/* <a
              href="#"
              className="inline-flex items-center text-purple-700 font-medium text-base transition-colors duration-200 hover:text-green-400"
            >
              Learn more
              <svg
                className="ml-2 w-4 h-4 transition-transform duration-200 hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a> */}
          </div>

          {/* Feature Card 3 */}
          <div className="relative bg-white rounded-xl p-8 flex flex-col items-center text-center shadow-md transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl overflow-hidden">
            <div className="absolute top-0 left-0 h-[60%] w-1 bg-purple-700 rounded-tl-xl transform scale-y-0 origin-top transition-transform duration-300 hover:scale-y-100"></div>
            <div className="w-20 h-20 rounded-full bg-[#EDE7F6] flex items-center justify-center mb-6 transition-colors duration-300 hover:bg-[#E1D5F5]">
              <svg
                className="w-10 h-10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#673AB7"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                <polyline points="13 2 13 9 20 9" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Intuitive User Experience</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              Our user-friendly interface makes document timestamping accessible to everyone, no technical expertise required.
            </p>
            {/* <a
              href="#"
              className="inline-flex items-center text-purple-700 font-medium text-base transition-colors duration-200 hover:text-purple-700"
            >
              Learn more
              <svg
                className="ml-2 w-4 h-4 transition-transform duration-200 hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a> */}
          </div>
        </div>

        {/* Call-to-Action Button */}
        {/* <div className="mt-16 text-center">
          <button
            className="relative inline-block min-w-[200px] rounded-full px-10 py-4 text-lg font-semibold text-gray-800 transition-transform duration-300 shadow-md hover:-translate-y-1 hover:shadow-lg active:translate-y-0 overflow-hidden"
            style={{ background: "linear-gradient(45deg, #673AB7, #8BC34A)" }}
          >
            Get Started Now
            <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700 hover:left-full"></span>
          </button>
        </div> */}
      </div>
    </section>
  );
}
