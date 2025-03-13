'use client';
import React, { useState } from 'react';
import { ethers } from 'ethers';

// Replace with your deployed Timestamp Registry contract address
const TIMESTAMP_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_TimestampRegistry;

// Minimal ABI containing only the verifyDocument function
const registryABI = [
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "documentHash",
        "type": "bytes32"
      }
    ],
    "name": "verifyDocument",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export default function ValidateDocument() {
  const [documentHash, setDocumentHash] = useState('');
  const [isValid, setIsValid] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [animateResult, setAnimateResult] = useState(false);

  const validateDocument = async () => {
    if (!documentHash.trim()) {
      setError('Please enter a document hash');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setIsValid(null);

    try {
      // Create a provider (using window.ethereum)
      if (!window.ethereum) {
        setError("Ethereum provider not found");
        setIsLoading(false);
        return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // Create a contract instance (view-only, so no signer required)
      const contract = new ethers.Contract(TIMESTAMP_REGISTRY_ADDRESS, registryABI, provider);
      
      // Call the contract's verifyDocument function
      const result = await contract.verifyDocument(documentHash);
      
      setIsValid(result);
      setAnimateResult(true);
      setIsLoading(false);
      // Reset animation flag after a short delay
      setTimeout(() => setAnimateResult(false), 500);
    } catch (err) {
      setError('Failed to validate document: ' + (err.message || err));
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#f7f9fc] to-[#eef1f5] font-sans">
      {/* Main Content */}
      <main className="flex-1 py-12 px-8 max-w-4xl mx-auto w-full md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-4">Verify Document Authenticity</h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Confirm if your document has been timestamped on the blockchain. Enter the Keccak‑256 hash of your document to verify its authenticity and view timestamp information.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 md:p-10 w-full">
          {/* Document Hash Input */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Enter Document Hash</h3>
            <p className="text-sm text-gray-600 mb-4">
              Paste the Keccak‑256 hash of your document to verify if it has been timestamped on our blockchain.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="e.g. 0x3a1f9a8b..."
                value={documentHash}
                onChange={(e) => setDocumentHash(e.target.value)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-md font-mono transition focus:outline-none focus:border-purple-700 focus:shadow focus:shadow-purple-200"
              />
              <button
                onClick={validateDocument}
                disabled={isLoading}
                className="flex items-center justify-center min-w-[150px] bg-amber-400 text-gray-800 font-semibold px-4 py-3 rounded-md transition duration-200 hover:bg-amber-500 hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Verifying..." : "Verify Document"}
              </button>
            </div>
            {error && (
              <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-600 rounded">
                {error}
              </div>
            )}
          </div>

          {/* Validation Result */}
          {isValid !== null && (
            <div
              className={`border-t border-gray-200 pt-8 transition duration-300 ${animateResult ? 'opacity-70 scale-95' : 'opacity-100 scale-100'}`}
            >
              <div className="flex items-center mb-6">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 text-xl ${
                    isValid ? 'bg-green-500' : 'bg-red-500'
                  } text-white`}
                >
                  {isValid ? '✓' : '✗'}
                </div>
                <div className="flex-1 text-left">
                  <h3 className={`text-xl font-bold mb-1 ${isValid ? 'text-green-700' : 'text-red-700'}`}>
                    {isValid ? 'Document Verified' : 'Document Not Found'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {isValid
                      ? 'This document has been timestamped on the blockchain.'
                      : 'This document has not been timestamped or the hash is incorrect.'}
                  </p>
                </div>
              </div>
              {isValid && (
                <div className="bg-gray-50 rounded-md p-6">
                  <h4 className="text-base font-semibold text-gray-800 mb-4">Timestamp Information</h4>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-1">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 mb-1">Timestamp Date</span>
                      <span className="text-sm text-gray-800 font-medium">
                        {new Date().toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 mb-1">Timestamp Time</span>
                      <span className="text-sm text-gray-800 font-medium">
                        {new Date().toLocaleTimeString('en-US')}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 mb-1">Block Number</span>
                      <span className="text-sm text-gray-800 font-medium">14,325,678</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 mb-1">Transaction Hash</span>
                      <span className="text-sm text-gray-800 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                        0x3a1f9a8b0c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f
                      </span>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-col sm:flex-row gap-4">
                    <button className="flex-1 bg-purple-700 text-white font-medium py-3 rounded-md transition hover:bg-purple-600">
                      View on Explorer
                    </button>
                    {/* <button className="flex-1 bg-gray-100 text-gray-800 font-medium py-3 rounded-md transition hover:bg-gray-200">
                      Download Certificate
                    </button> */}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
