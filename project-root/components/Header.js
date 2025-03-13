'use client';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { connectWalletAction, disconnectWalletAction } from '../redux/actions';
import { ethers } from 'ethers';

export default function Header() {
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Selectors from Redux
  const isWalletConnected = useSelector((state) => state.wallet.isConnected);
  const walletAddress = useSelector((state) => state.wallet.address);

  const handleConnectWallet = async () => {
    dispatch(connectWalletAction());
  };

  const handleDisconnectWallet = () => {
    dispatch(disconnectWalletAction());
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Outer container to center content */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left: Brand/logo */}
        <div className="flex items-center space-x-3">
          <svg
            className="w-10 h-10 text-amber-400"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
          </svg>
          <span className="text-2xl font-bold text-gray-800">
            TimestampDocs
          </span>
        </div>

        {/* Middle: Desktop navigation (hidden on mobile) */}
        {/* <nav className="hidden md:flex space-x-6">
          {['Features', 'How It Works', 'Validate'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="relative text-gray-600 font-medium hover:text-purple-700 transition-colors"
            >
              {item}
            </a>
          ))}
        </nav> */}

        {/* Right: Connect Wallet (hidden on mobile) */}
        <div className="hidden md:flex items-center space-x-4">
          {isWalletConnected ? (
            <button
              onClick={handleDisconnectWallet}
              className="bg-transparent text-purple-700 border border-purple-700 px-4 py-2 rounded font-medium transition duration-200 hover:bg-purple-100"
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={handleConnectWallet}
              className="bg-amber-400 text-gray-800 px-4 py-2 rounded font-medium shadow transition duration-200 hover:bg-amber-500"
            >
              Connect Wallet
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle (shown on mobile) */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden bg-transparent border-0 cursor-pointer p-2 text-gray-800"
        >
          {isMenuOpen ? (
            // Close icon
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 
                6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          ) : (
            // Hamburger icon
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation (visible when toggled) */}
      {isMenuOpen && (
        <div className="md:hidden bg-white px-4 pb-4 shadow">
          {/* <nav className="flex flex-col space-y-3 mb-4">
            {['Home', 'Features', 'How It Works', 'Validate'].map((item) => (
              <a
                key={item}
                href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-gray-600 font-medium hover:text-purple-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </nav> */}
          <div>
            {isWalletConnected ? (
              <button
                onClick={() => {
                  handleDisconnectWallet();
                  setIsMenuOpen(false);
                }}
                className="w-full bg-transparent text-purple-700 border border-purple-700 px-4 py-2 rounded font-medium transition duration-200 hover:bg-purple-100"
              >
                Disconnect
              </button>
            ) : (
              <button
                onClick={() => {
                  handleConnectWallet();
                  setIsMenuOpen(false);
                }}
                className="w-full bg-amber-400 text-gray-800 px-4 py-2 rounded font-medium shadow transition duration-200 hover:bg-amber-500"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
