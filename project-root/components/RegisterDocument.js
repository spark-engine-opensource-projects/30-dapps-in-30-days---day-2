'use client';
import React, { useState } from 'react';
import { ethers } from 'ethers';

// Replace with your deployed contract address
const TIMESTAMP_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_TimestampRegistry;

// Minimal ABI containing only the registerDocument function
const registryABI = [
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "documentHash",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "documentType",
        "type": "string"
      }
    ],
    "name": "registerDocument",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export default function RegisterDocument() {
  const [file, setFile] = useState(null);
  const [documentName, setDocumentName] = useState('');
  const [documentDescription, setDocumentDescription] = useState('');
  const [documentHash, setDocumentHash] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      calculateHash(selectedFile);
    }
  };

  // Calculate document hash using Keccak-256 (ethers.js)
  const calculateHash = (file) => {
    setUploadProgress(0);
    const reader = new FileReader();

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 50);
        setUploadProgress(progress);
      }
    };

    reader.onload = (event) => {
      try {
        // Update progress to halfway when file is loaded
        setUploadProgress(50);
        const buffer = event.target.result; // ArrayBuffer
        const uint8Array = new Uint8Array(buffer);
        // Compute keccak256 hash using ethers.js
        const hashHex = ethers.utils.keccak256(uint8Array);
        setDocumentHash(hashHex);
        setUploadProgress(100);
      } catch (err) {
        setError('Error calculating document hash');
        setUploadProgress(0);
      }
    };

    reader.onerror = () => {
      setError('Error reading file');
      setUploadProgress(0);
    };

    reader.readAsArrayBuffer(file);
  };

  // Handle submission with blockchain interaction
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!documentHash || !documentName) {
      setError('Please upload a document and provide a name');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Initialize ethers provider and signer from window.ethereum
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Create a contract instance using the signer
      const contract = new ethers.Contract(TIMESTAMP_REGISTRY_ADDRESS, registryABI, signer);

      // Derive a document type from the file extension (default to "unknown")
      const documentType = file ? file.name.split('.').pop() : "unknown";

      // Call the smart contract function to register the document
      const tx = await contract.registerDocument(documentHash, documentType);
      // Wait for the transaction to be mined
      await tx.wait();

      // On success, update UI state
      setIsSuccess(true);
      setDocumentName('');
      setDocumentDescription('');
      setFile(null);
      setDocumentHash('');
    } catch (err) {
      console.error(err);
      setError('Failed to register document on blockchain: ' + (err.message || err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] font-sans">
      {/* Main Content */}
      <main className="flex-1 p-8 max-w-6xl mx-auto w-full md:p-12">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-amber-400 px-8 py-6 border-b border-gray-200">
            <h2 className="text-gray-800 text-xl font-semibold">Register New Document</h2>
            <p className="text-gray-600 mt-1 text-base leading-relaxed">
              Securely timestamp your document on the blockchain for immutable proof of existence.
            </p>
          </div>
          <form className="p-8 md:p-10" onSubmit={handleSubmit}>
            {/* File Upload */}
            <div className="mb-8">
              <label className="block font-semibold text-gray-800 mb-3 text-base">
                Upload Document
              </label>
              <div
                onClick={() => document.getElementById('file-upload').click()}
                className={`cursor-pointer rounded border-2 border-dashed transition-colors p-8 text-center ${
                  file ? "border-green-500 bg-[#f1f8e9]" : "border-gray-300 bg-[#fafafa]"
                } hover:border-amber-400 hover:bg-amber-50`}
              >
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                />
                {file ? (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-3 text-white font-bold">
                      ✓
                    </div>
                    <span className="font-medium text-base text-gray-800 break-words">
                      {file.name}
                    </span>
                    <span className="mt-2 text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-3 text-gray-500 text-2xl">
                      +
                    </div>
                    <span className="font-medium text-base text-gray-800">
                      Click to upload or drag and drop
                    </span>
                    <span className="mt-2 text-sm text-gray-500">
                      PDF, DOC, TXT, JPG, PNG (Max 10MB)
                    </span>
                  </div>
                )}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-4 w-full">
                    <div className="w-full h-1 bg-gray-300 rounded overflow-hidden">
                      <div
                        style={{ width: `${uploadProgress}%` }}
                        className="h-full bg-amber-400 rounded transition-all duration-300"
                      ></div>
                    </div>
                    <span className="block mt-2 text-xs text-gray-500">
                      Processing document...
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Document Name & Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label htmlFor="document-name" className="block font-semibold mb-3 text-gray-800 text-base">
                  Document Name
                </label>
                <input
                  id="document-name"
                  type="text"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  placeholder="Enter document name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-amber-400 focus:shadow-outline transition"
                />
              </div>
              <div>
                <label htmlFor="document-description" className="block font-semibold mb-3 text-gray-800 text-base">
                  Description (Optional)
                </label>
                <input
                  id="document-description"
                  type="text"
                  value={documentDescription}
                  onChange={(e) => setDocumentDescription(e.target.value)}
                  placeholder="Brief description of the document"
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-amber-400 focus:shadow-outline transition"
                />
              </div>
            </div>

            {/* Document Hash Display */}
            {documentHash && (
              <div className="mb-8 p-4 bg-gray-100 rounded">
                <label className="block font-semibold mb-2 text-gray-800 text-sm">
                  Document Hash (Keccak-256)
                </label>
                <div className="font-mono text-sm text-gray-600 p-2 break-words">
                  {documentHash}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-600 rounded">
                {error}
              </div>
            )}

            {/* Success Message */}
            {isSuccess && (
              <div className="mb-8 p-4 bg-green-50 border-l-4 border-green-500 text-green-600 rounded">
                Document successfully registered on the blockchain!
              </div>
            )}

            {/* Form Buttons */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setDocumentName('');
                  setDocumentDescription('');
                  setDocumentHash('');
                  setError('');
                  setIsSuccess(false);
                }}
                className="bg-gray-100 text-gray-800 rounded px-6 py-3 font-medium transition duration-200 hover:bg-gray-200"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !documentHash || !documentName}
                className={`flex items-center justify-center min-w-[160px] rounded px-6 py-3 font-medium transition duration-200 ${
                  isSubmitting || !documentHash || !documentName
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-amber-400 text-gray-800 hover:bg-amber-500 hover:shadow-md"
                }`}
              >
                {isSubmitting && (
                  <div className="inline-block w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                )}
                {isSubmitting ? "Processing..." : "Register Document"}
              </button>
            </div>
          </form>
        </div>

        {/* How Document Timestamping Works */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="flex items-center text-xl font-semibold text-gray-800 mb-4">
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            How Document Timestamping Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded bg-gray-50 border-l-4 border-amber-400">
              <h4 className="mb-3 text-base font-semibold text-gray-800">1. Upload Document</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                We calculate a unique fingerprint (hash) of your document without storing the actual file.
              </p>
            </div>
            <div className="p-5 rounded bg-gray-50 border-l-4 border-purple-700">
              <h4 className="mb-3 text-base font-semibold text-gray-800">2. Register on Blockchain</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                The document hash is permanently recorded on the blockchain with a timestamp.
              </p>
            </div>
            <div className="p-5 rounded bg-gray-50 border-l-4 border-green-500">
              <h4 className="mb-3 text-base font-semibold text-gray-800">3. Verify Anytime</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                You can prove document existence and integrity at any future date using our verification tool.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
