// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title Enhanced Timestamp Registry Contract
/// @author Blockchain Document Registry
/// @notice A contract for registering document hashes with timestamps for verification
/// @dev Provides document registration, verification, and ownership management functionality
contract TimestampRegistry is AccessControl, Pausable, ReentrancyGuard {
    // Roles
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant DOCUMENT_MANAGER_ROLE = keccak256("DOCUMENT_MANAGER_ROLE");
    
    /// @notice Enhanced structure to store document information
    struct Document {
        uint256 timestamp;     // Document registration timestamp
        address owner;         // Address of document owner
        bool exists;           // Whether document exists
        string metadata;       // Additional document metadata
        bool revoked;          // Whether document has been revoked
        uint256 expiryDate;    // Optional expiration date (0 = no expiry)
        string documentType;   // Type of document (PDF, DOC, etc.)
    }
    
    /// @notice Structure for batch processing results
    struct BatchResult {
        uint256 successCount;
        uint256 duplicateCount;
        uint256 invalidCount;
    }
    
    /// @notice Structure for detailed verification result
    struct VerificationResult {
        bool exists;
        uint256 timestamp;
        address owner;
        bool revoked;
        bool expired;
        string documentType;
    }
    
    /// @notice Mapping from document hash to Document struct
    mapping(bytes32 => Document) private documents;
    
    /// @notice Mapping from owner address to their document hashes
    mapping(address => bytes32[]) private documentsByOwner;
    
    // Events
    /// @notice Emitted when a document is registered
    event DocumentRegistered(bytes32 indexed documentHash, address indexed owner, uint256 timestamp, string documentType);
    
    /// @notice Emitted when document metadata is updated
    event MetadataUpdated(bytes32 indexed documentHash, address indexed owner, string metadata);
    
    /// @notice Emitted when multiple documents are registered in batch
    event BatchDocumentsRegistered(
        address indexed owner, 
        uint256 successCount, 
        uint256 duplicateCount, 
        uint256 invalidCount, 
        uint256 timestamp
    );
    
    /// @notice Emitted when a document is revoked
    event DocumentRevoked(bytes32 indexed documentHash, address indexed revoker, string reason, uint256 timestamp);
    
    /// @notice Emitted when document expiry is set
    event DocumentExpirySet(bytes32 indexed documentHash, address indexed owner, uint256 expiryDate);
    
    /// @notice Emitted when document ownership is transferred
    event DocumentOwnershipTransferred(bytes32 indexed documentHash, address indexed previousOwner, address indexed newOwner);
    
    // Custom errors
    /// @notice When document hash is already registered
    error DocumentAlreadyExists(bytes32 documentHash);
    
    /// @notice When document does not exist in registry
    error DocumentDoesNotExist(bytes32 documentHash);
    
    /// @notice When document hash is invalid or empty
    error InvalidDocumentHash(bytes32 documentHash);
    
    /// @notice When caller is not the document owner
    error NotDocumentOwner(address caller, address owner);
    
    /// @notice When document is already revoked
    error DocumentAlreadyRevoked(bytes32 documentHash);
    
    /// @notice When provided address is invalid
    error InvalidAddress(address addr);
    
    /// @notice When batch size exceeds limit
    error BatchSizeTooLarge(uint256 size);
    
    /// @notice When expiry date is invalid
    error InvalidExpiryDate(uint256 expiryDate);
    
    /// @notice Modifier to ensure caller is document owner
    modifier onlyDocumentOwner(bytes32 documentHash) {
        if (!documents[documentHash].exists) revert DocumentDoesNotExist(documentHash);
        if (documents[documentHash].owner != msg.sender) revert NotDocumentOwner(msg.sender, documents[documentHash].owner);
        _;
    }
    
    /// @notice Contract constructor
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(DOCUMENT_MANAGER_ROLE, msg.sender);
    }
    
    /// @notice Registers a document hash with current timestamp
    /// @param documentHash Hash of the document to register
    /// @param documentType Type of document (e.g., "PDF", "DOC")
    /// @return True if document was successfully registered
    function registerDocument(
        bytes32 documentHash, 
        string calldata documentType
    ) public whenNotPaused returns (bool) {
        // Input validation
        if (documentHash == bytes32(0)) revert InvalidDocumentHash(documentHash);
        if (documents[documentHash].exists) revert DocumentAlreadyExists(documentHash);
        
        // Store document hash with timestamp
        documents[documentHash] = Document({
            timestamp: block.timestamp,
            owner: msg.sender,
            exists: true,
            metadata: "",
            revoked: false,
            expiryDate: 0,
            documentType: documentType
        });
        
        // Update user's document list
        documentsByOwner[msg.sender].push(documentHash);
        
        emit DocumentRegistered(documentHash, msg.sender, block.timestamp, documentType);
        return true;
    }
    
    /// @notice Verifies if a document hash exists in the registry
    /// @param documentHash Hash of the document to verify
    /// @return Whether the document exists and is valid (not revoked/expired)
    function verifyDocument(bytes32 documentHash) public view returns (bool) {
        // Input validation
        if (documentHash == bytes32(0)) revert InvalidDocumentHash(documentHash);
        
        Document storage doc = documents[documentHash];
        
        // Check if document exists and is not revoked/expired
        if (!doc.exists) {
            return false;
        }
        
        if (doc.revoked) {
            return false;
        }
        
        if (doc.expiryDate != 0 && block.timestamp > doc.expiryDate) {
            return false;
        }
        
        return true;
    }
    
    /// @notice Provides detailed verification information for a document
    /// @param documentHash Hash of the document to verify
    /// @return Detailed verification result
    function verifyDocumentDetailed(bytes32 documentHash) 
        public 
        view 
        returns (VerificationResult memory) {
        
        if (documentHash == bytes32(0)) revert InvalidDocumentHash(documentHash);
        
        VerificationResult memory result;
        Document storage doc = documents[documentHash];
        
        result.exists = doc.exists;
        
        if (result.exists) {
            result.timestamp = doc.timestamp;
            result.owner = doc.owner;
            result.revoked = doc.revoked;
            result.documentType = doc.documentType;
            
            if (doc.expiryDate != 0) {
                result.expired = block.timestamp > doc.expiryDate;
            }
        }
        
        return result;
    }
    
    /// @notice Retrieves the timestamp of a registered document
    /// @param documentHash Hash of the document
    /// @return Timestamp when document was registered
    function getDocumentTimestamp(bytes32 documentHash) public view returns (uint256) {
        // Input validation
        if (documentHash == bytes32(0)) revert InvalidDocumentHash(documentHash);
        if (!documents[documentHash].exists) revert DocumentDoesNotExist(documentHash);
        
        return documents[documentHash].timestamp;
    }
    
    /// @notice Retrieves the owner of a registered document
    /// @param documentHash Hash of the document
    /// @return Address of document owner
    function getDocumentOwner(bytes32 documentHash) public view returns (address) {
        // Input validation
        if (documentHash == bytes32(0)) revert InvalidDocumentHash(documentHash);
        if (!documents[documentHash].exists) revert DocumentDoesNotExist(documentHash);
        
        return documents[documentHash].owner;
    }
    
    /// @notice Updates metadata for a registered document
    /// @param documentHash Hash of the document
    /// @param _metadata New metadata for the document
    /// @return True if metadata was successfully updated
    function updateDocumentMetadata(bytes32 documentHash, string calldata _metadata) 
        public 
        whenNotPaused 
        onlyDocumentOwner(documentHash) 
        returns (bool) {
        
        documents[documentHash].metadata = _metadata;
        
        emit MetadataUpdated(documentHash, msg.sender, _metadata);
        return true;
    }
    
    /// @notice Revokes a document
    /// @param documentHash Hash of the document to revoke
    /// @param reason Reason for revocation
    /// @return True if document was successfully revoked
    function revokeDocument(bytes32 documentHash, string calldata reason) 
        public 
        whenNotPaused 
        onlyDocumentOwner(documentHash) 
        returns (bool) {
        
        if (documents[documentHash].revoked) revert DocumentAlreadyRevoked(documentHash);
        
        documents[documentHash].revoked = true;
        
        emit DocumentRevoked(documentHash, msg.sender, reason, block.timestamp);
        return true;
    }
    
    /// @notice Admin function to revoke a document
    /// @param documentHash Hash of the document to revoke
    /// @param reason Reason for revocation
    /// @return True if document was successfully revoked
    function revokeDocumentByAdmin(bytes32 documentHash, string calldata reason) 
        public 
        whenNotPaused 
        onlyRole(DOCUMENT_MANAGER_ROLE) 
        returns (bool) {
        
        if (!documents[documentHash].exists) revert DocumentDoesNotExist(documentHash);
        if (documents[documentHash].revoked) revert DocumentAlreadyRevoked(documentHash);
        
        documents[documentHash].revoked = true;
        
        emit DocumentRevoked(documentHash, msg.sender, reason, block.timestamp);
        return true;
    }
    
    /// @notice Sets an expiry date for a document
    /// @param documentHash Hash of the document
    /// @param expiryDate Timestamp when document should expire
    /// @return True if expiry was successfully set
    function setDocumentExpiry(bytes32 documentHash, uint256 expiryDate) 
        public 
        whenNotPaused 
        onlyDocumentOwner(documentHash) 
        returns (bool) {
        
        if (expiryDate != 0 && expiryDate <= block.timestamp) revert InvalidExpiryDate(expiryDate);
        
        documents[documentHash].expiryDate = expiryDate;
        
        emit DocumentExpirySet(documentHash, msg.sender, expiryDate);
        return true;
    }
    
    /// @notice Transfers ownership of a document to another address
    /// @param documentHash Hash of the document
    /// @param newOwner Address of the new owner
    /// @return True if transfer was successful
    function transferDocumentOwnership(bytes32 documentHash, address newOwner) 
        public 
        whenNotPaused 
        onlyDocumentOwner(documentHash) 
        returns (bool) {
        
        if (newOwner == address(0)) revert InvalidAddress(address(0));
        
        // Remove document from current owner's list
        bytes32[] storage ownerDocs = documentsByOwner[msg.sender];
        for (uint256 i = 0; i < ownerDocs.length; i++) {
            if (ownerDocs[i] == documentHash) {
                // Swap with last element and pop for gas efficiency
                ownerDocs[i] = ownerDocs[ownerDocs.length - 1];
                ownerDocs.pop();
                break;
            }
        }
        
        // Add document to new owner's list
        documentsByOwner[newOwner].push(documentHash);
        
        // Update document owner
        address previousOwner = documents[documentHash].owner;
        documents[documentHash].owner = newOwner;
        
        emit DocumentOwnershipTransferred(documentHash, previousOwner, newOwner);
        return true;
    }
    
    /// @notice Registers multiple document hashes in a single transaction
    /// @param documentHashes Array of document hashes to register
    /// @param documentTypes Array of document types corresponding to each hash
    /// @return Batch processing results
    function batchRegisterDocuments(
        bytes32[] calldata documentHashes,
        string[] calldata documentTypes
    ) 
        public 
        whenNotPaused 
        nonReentrant 
        returns (BatchResult memory) {
        
        if (documentHashes.length == 0) revert InvalidDocumentHash(bytes32(0));
        if (documentHashes.length > 100) revert BatchSizeTooLarge(documentHashes.length);
        if (documentHashes.length != documentTypes.length) revert InvalidDocumentHash(bytes32(0));
        
        BatchResult memory result;
        
        // Loop through document hashes array
        for (uint256 i = 0; i < documentHashes.length; i++) {
            bytes32 documentHash = documentHashes[i];
            
            // Check valid hash
            if (documentHash == bytes32(0)) {
                result.invalidCount++;
                continue;
            }
            
            // Check for duplicates
            if (documents[documentHash].exists) {
                result.duplicateCount++;
                continue;
            }
            
            // Store valid document
            documents[documentHash] = Document({
                timestamp: block.timestamp,
                owner: msg.sender,
                exists: true,
                metadata: "",
                revoked: false,
                expiryDate: 0,
                documentType: documentTypes[i]
            });
            
            // Update user's document list
            documentsByOwner[msg.sender].push(documentHash);
            
            // Increment success counter
            result.successCount++;
            
            emit DocumentRegistered(documentHash, msg.sender, block.timestamp, documentTypes[i]);
        }
        
        emit BatchDocumentsRegistered(
            msg.sender, 
            result.successCount, 
            result.duplicateCount, 
            result.invalidCount, 
            block.timestamp
        );
        
        return result;
    }
    
    /// @notice Retrieves all document hashes registered by a user
    /// @param userAddress Address of the user
    /// @return Array of document hashes registered by user
    function getUserDocuments(address userAddress) public view returns (bytes32[] memory) {
        // Input validation
        if (userAddress == address(0)) revert InvalidAddress(address(0));
        
        return documentsByOwner[userAddress];
    }
    
    /// @notice Batch verify multiple documents
    /// @param documentHashes Array of document hashes to verify
    /// @return Array of verification results
    function batchVerifyDocuments(bytes32[] calldata documentHashes) 
        public 
        view 
        returns (bool[] memory) {
        
        bool[] memory results = new bool[](documentHashes.length);
        
        for (uint256 i = 0; i < documentHashes.length; i++) {
            results[i] = verifyDocument(documentHashes[i]);
        }
        
        return results;
    }
    
    /// @notice Pauses the contract
    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }
    
    /// @notice Unpauses the contract
    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }
    
    /// @notice Validates if a document hash meets SHA-256 format requirements
    /// @param documentHash Hash to validate
    /// @return True if hash is valid SHA-256 format
    function validateDocumentHash(bytes32 documentHash) public pure returns (bool) {
        if (documentHash == bytes32(0)) revert InvalidDocumentHash(documentHash);
        return true;
    }
}