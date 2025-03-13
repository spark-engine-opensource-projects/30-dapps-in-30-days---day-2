'use client';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setSignerConnection,
  setSignerInstance,
  setSignerChainId,
  connectSignerAction,
  disconnectSignerAction,
  updateSignerChainIdAction
} from '../redux/actions';
import { ethers } from 'ethers';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-300 py-12 px-8 text-gray-800 font-sans md:py-8 md:px-4">
      {/* Main Footer Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* About Section */}
        <div className="flex flex-col">
          <h3 className="text-purple-700 text-xl font-semibold mb-5 relative after:absolute after:bottom-[-0.5rem] after:left-0 after:w-10 after:h-[3px] after:bg-amber-400">
            About TimestampDocs
          </h3>
          <p className="text-sm leading-6 text-gray-500 mb-6">
            Secure document timestamping service providing blockchain-backed proof of existence for your important files.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              aria-label="Twitter"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-purple-700 transition-all duration-300 hover:bg-purple-700 hover:text-white hover:-translate-y-1 hover:shadow-lg"
            >
              X
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-purple-700 transition-all duration-300 hover:bg-purple-700 hover:text-white hover:-translate-y-1 hover:shadow-lg"
            >
              in
            </a>
            <a
              href="#"
              aria-label="GitHub"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-purple-700 transition-all duration-300 hover:bg-purple-700 hover:text-white hover:-translate-y-1 hover:shadow-lg"
            >
              G
            </a>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="flex flex-col">
          <h3 className="text-purple-700 text-xl font-semibold mb-5 relative after:absolute after:bottom-[-0.5rem] after:left-0 after:w-10 after:h-[3px] after:bg-amber-400">
            Quick Links
          </h3>
          <ul className="list-none p-0 m-0">
            {["How It Works", "Pricing", "FAQ", "Support"].map((link, index) => (
              <li key={index} className="mb-3">
                <a
                  href="#"
                  className="text-gray-500 text-sm inline-flex items-center transition-colors duration-200 hover:text-purple-700 transform hover:translate-x-1"
                >
                  <span className="mr-2 text-amber-400 transition-transform duration-200">→</span>
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal Section */}
        <div className="flex flex-col">
          <h3 className="text-purple-700 text-xl font-semibold mb-5 relative after:absolute after:bottom-[-0.5rem] after:left-0 after:w-10 after:h-[3px] after:bg-amber-400">
            Legal
          </h3>
          <ul className="list-none p-0 m-0">
            {["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR Compliance"].map((link, index) => (
              <li key={index} className="mb-3">
                <a
                  href="#"
                  className="text-gray-500 text-sm inline-flex items-center transition-colors duration-200 hover:text-purple-700 transform hover:translate-x-1"
                >
                  <span className="mr-2 text-amber-400 transition-transform duration-200">→</span>
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Section */}
        <div className="flex flex-col">
          <h3 className="text-purple-700 text-xl font-semibold mb-5 relative after:absolute after:bottom-[-0.5rem] after:left-0 after:w-10 after:h-[3px] after:bg-amber-400">
            Contact Us
          </h3>
          <div className="flex items-center mb-3">
            <div className="min-w-[2rem] h-8 rounded-full bg-gray-100 flex items-center justify-center text-purple-700 mr-4">
              ✉
            </div>
            <a
              href="mailto:info@timestampdocs.com"
              className="text-gray-500 text-sm transition-colors duration-200 hover:text-purple-700"
            >
              info@timestampdocs.com
            </a>
          </div>
          <div className="flex items-center mb-3">
            <div className="min-w-[2rem] h-8 rounded-full bg-gray-100 flex items-center justify-center text-purple-700 mr-4">
              ☎
            </div>
            <a
              href="tel:+11234567890"
              className="text-gray-500 text-sm transition-colors duration-200 hover:text-purple-700"
            >
              +1 (123) 456-7890
            </a>
          </div>
          <div className="mt-6">
            <h4 className="text-base font-semibold text-gray-600 mb-4">
              Subscribe to Our Newsletter
            </h4>
            <div className="flex flex-col sm:flex-row">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-l sm:rounded-l sm:rounded-none focus:outline-none focus:border-purple-700 focus:shadow-outline mb-3 sm:mb-0"
              />
              <button className="bg-amber-400 text-gray-800 font-semibold px-4 py-3 rounded-r sm:rounded-r sm:rounded-none transition duration-200 hover:bg-amber-500 w-full sm:w-auto">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-300 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
        <p className="text-gray-500 text-sm">
          © 2023 TimestampDocs. All rights reserved.
        </p>
        <div className="flex gap-6">
          {["Sitemap", "Accessibility", "Security"].map((link, index) => (
            <a
              key={index}
              href="#"
              className="text-gray-500 text-sm transition-colors duration-200 hover:text-purple-700"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
