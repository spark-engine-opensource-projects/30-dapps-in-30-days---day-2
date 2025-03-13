// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title Proof of Existence NFT Certificate
 * @author Blockchain Proof of Existence Team
 * @notice NFT-based certificate system for proving document existence at a specific time
 * @dev Interacts with a timestamp registry to verify documents before minting certificates
 */

interface ITimestampRegistry {
    function verifyDocument(bytes32 documentHash) external view returns (bool);
}

contract ProofOfExistenceNFT is ERC721URIStorage, Pausable, AccessControl, ReentrancyGuard {
    using Strings for uint256;

    // Role definitions
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant REGISTRY_MANAGER_ROLE = keccak256("REGISTRY_MANAGER_ROLE");
    bytes32 public constant CERTIFICATE_MANAGER_ROLE = keccak256("CERTIFICATE_MANAGER_ROLE");

    // Base URI for token metadata
    string private constant baseURI = "https://proof-of-existence.example/token/";
    
    // Interface to the timestamp registry contract
    ITimestampRegistry private timestampRegistry;
    
    // Simple counter for token IDs (starts at 1)
    uint256 private _nextTokenId = 1;
    
    // Mapping from token ID to document metadata
    mapping(uint256 => DocumentMetadata) private documentMetadata;
    
    // Mapping from document hash to token ID
    mapping(bytes32 => uint256) private _certificateByDocumentHash;
    
    // Mapping to track revoked certificates
    mapping(uint256 => bool) private _revokedCertificates;
    
    // Mapping of owner addresses to their token IDs
    mapping(address => uint256[]) private _ownerTokens;
    
    struct DocumentMetadata {
        bytes32 documentHash;
        uint256 timestamp;
        address submitter;
        string documentType;     // PDF, DOC, etc.
        string documentName;     // User-friendly name
    }
    
    // Events
    event CertificateMinted(address indexed recipient, uint256 indexed tokenId, bytes32 indexed documentHash);
    event CertificateTransferred(address indexed from, address indexed to, uint256 indexed tokenId);
    event CertificateBurned(address indexed owner, uint256 indexed tokenId);
    event CertificateRevoked(uint256 indexed tokenId, address indexed revoker, string reason);
    event RegistryUpdated(address indexed oldRegistry, address indexed newRegistry);
    
    /**
     * @notice Contract constructor
     * @param _timestampRegistryAddress Address of the timestamp registry contract
     */
    constructor(address _timestampRegistryAddress) ERC721("Document Proof Certificates", "DPC") {
        require(_timestampRegistryAddress != address(0), "Invalid registry address");
        timestampRegistry = ITimestampRegistry(_timestampRegistryAddress);
        
        // Setup roles
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(REGISTRY_MANAGER_ROLE, msg.sender);
        _grantRole(CERTIFICATE_MANAGER_ROLE, msg.sender);
    }
    
    /**
     * @notice Helper function to check if a token exists
     * @param tokenId ID of the token to check
     * @return True if the token exists
     */
    function _tokenExists(uint256 tokenId) internal view returns (bool) {
        try this.ownerOf(tokenId) returns (address) {
            return true;
        } catch {
            return false;
        }
    }
    
    /**
     * @notice Mint a new certificate for a timestamped document
     * @param documentHash Hash of the document to certify
     * @param documentType Type of document (e.g., "PDF", "DOC")
     * @param documentName User-friendly name for the document
     * @return Unique identifier for the certificate
     */
    function mintCertificate(
        bytes32 documentHash, 
        string calldata documentType, 
        string calldata documentName
    ) external nonReentrant whenNotPaused returns (uint256) {
        require(documentHash != bytes32(0), "Document hash cannot be empty");
        require(timestampRegistry.verifyDocument(documentHash), "Document must be timestamped in registry");
        require(_certificateByDocumentHash[documentHash] == 0, "Certificate already exists for this document");
        
        // Get token ID and increment counter
        uint256 tokenId = _nextTokenId;
        _nextTokenId++;
        
        // Create metadata
        DocumentMetadata memory metadata = DocumentMetadata(
            documentHash, 
            block.timestamp, 
            msg.sender,
            documentType,
            documentName
        );
        
        // Mint token and store metadata
        _safeMint(msg.sender, tokenId);
        documentMetadata[tokenId] = metadata;
        _certificateByDocumentHash[documentHash] = tokenId;
        _ownerTokens[msg.sender].push(tokenId);
        
        emit CertificateMinted(msg.sender, tokenId, documentHash);
        
        return tokenId;
    }
    
    /**
     * @notice Transfer certificate ownership to another address
     * @param tokenId ID of the certificate to transfer
     * @param to Address to receive the certificate
     * @return True if transfer was successful
     */
    function transferCertificate(uint256 tokenId, address to) external nonReentrant whenNotPaused returns (bool) {
        require(tokenId > 0, "Token ID must be valid");
        require(ownerOf(tokenId) == msg.sender, "Must be certificate owner");
        require(to != address(0), "Invalid recipient address");
        require(!_revokedCertificates[tokenId], "Cannot transfer revoked certificate");
        
        // Remove from sender's tokens
        uint256[] storage senderTokens = _ownerTokens[msg.sender];
        for (uint256 i = 0; i < senderTokens.length; i++) {
            if (senderTokens[i] == tokenId) {
                senderTokens[i] = senderTokens[senderTokens.length - 1];
                senderTokens.pop();
                break;
            }
        }
        
        // Add to recipient's tokens
        _ownerTokens[to].push(tokenId);
        
        _safeTransfer(msg.sender, to, tokenId, "");
        
        emit CertificateTransferred(msg.sender, to, tokenId);
        
        return true;
    }
    
    /**
     * @notice Burn a certificate
     * @param tokenId ID of the certificate to burn
     * @return True if burn was successful
     */
    function burnCertificate(uint256 tokenId) external nonReentrant whenNotPaused returns (bool) {
        require(tokenId > 0, "Token ID must be valid");
        require(_tokenExists(tokenId), "Certificate does not exist");
        require(ownerOf(tokenId) == msg.sender || isApprovedForAll(ownerOf(tokenId), msg.sender), 
                "Must be certificate owner or approved");
        
        address owner = ownerOf(tokenId);
        bytes32 documentHash = documentMetadata[tokenId].documentHash;
        
        // Remove from owner's tokens
        uint256[] storage ownerTokens = _ownerTokens[owner];
        for (uint256 i = 0; i < ownerTokens.length; i++) {
            if (ownerTokens[i] == tokenId) {
                ownerTokens[i] = ownerTokens[ownerTokens.length - 1];
                ownerTokens.pop();
                break;
            }
        }
        
        // Clear hash mapping
        _certificateByDocumentHash[documentHash] = 0;
        
        // Burn the token
        _burn(tokenId);
        delete documentMetadata[tokenId];
        delete _revokedCertificates[tokenId];
        
        emit CertificateBurned(owner, tokenId);
        
        return true;
    }
    
    /**
     * @notice Revoke a certificate
     * @param tokenId ID of the certificate to revoke
     * @param reason Reason for revocation
     */
    function revokeCertificate(uint256 tokenId, string calldata reason) 
        external 
        onlyRole(CERTIFICATE_MANAGER_ROLE) 
        whenNotPaused {
        require(_tokenExists(tokenId), "Certificate does not exist");
        require(!_revokedCertificates[tokenId], "Certificate already revoked");
        
        _revokedCertificates[tokenId] = true;
        emit CertificateRevoked(tokenId, msg.sender, reason);
    }
    
    /**
     * @notice Check if a certificate is revoked
     * @param tokenId ID of the certificate
     * @return Whether the certificate is revoked
     */
    function isCertificateRevoked(uint256 tokenId) external view returns (bool) {
        require(_tokenExists(tokenId), "Certificate does not exist");
        return _revokedCertificates[tokenId];
    }
    
    /**
     * @notice Get details about a certificate
     * @param tokenId ID of the certificate
     * @return Metadata about the document certificate
     */
    function getCertificateDetails(uint256 tokenId) external view returns (DocumentMetadata memory) {
        require(tokenId > 0, "Token ID must be valid");
        require(_tokenExists(tokenId), "Certificate must exist");
        
        return documentMetadata[tokenId];
    }
    
    /**
     * @notice Get certificate ID by document hash
     * @param documentHash Hash of the document
     * @return ID of the certificate for this document
     */
    function getCertificateByDocumentHash(bytes32 documentHash) external view returns (uint256) {
        uint256 tokenId = _certificateByDocumentHash[documentHash];
        require(tokenId != 0, "No certificate exists for this document");
        return tokenId;
    }
    
    /**
     * @notice Get all certificates owned by an address
     * @param owner Address to check
     * @return Array of token IDs owned by the address
     */
    function getTokensByOwner(address owner) external view returns (uint256[] memory) {
        return _ownerTokens[owner];
    }
    
    /**
     * @notice Verify if a document matches a certificate
     * @param documentHash Hash of the document to verify
     * @param tokenId ID of the certificate to check against
     * @return True if document hash matches certificate and not revoked
     */
    function verifyDocumentCertificate(bytes32 documentHash, uint256 tokenId) external view returns (bool) {
        require(documentHash != bytes32(0), "Document hash cannot be empty");
        require(tokenId > 0, "Token ID must be valid");
        
        if (!_tokenExists(tokenId) || _revokedCertificates[tokenId]) {
            return false;
        }
        
        DocumentMetadata memory metadata = documentMetadata[tokenId];
        return metadata.documentHash == documentHash;
    }
    
    /**
     * @notice Verify multiple documents at once
     * @param documentHashes Array of document hashes to verify
     * @return Array of booleans indicating if each document is verified
     */
    function verifyMultipleDocuments(bytes32[] calldata documentHashes) external view returns (bool[] memory) {
        bool[] memory results = new bool[](documentHashes.length);
        
        for (uint256 i = 0; i < documentHashes.length; i++) {
            results[i] = timestampRegistry.verifyDocument(documentHashes[i]);
        }
        
        return results;
    }
    
    /**
     * @notice Pause the contract
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }
    
    /**
     * @notice Unpause the contract
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }
    
    /**
     * @notice Update the timestamp registry address
     * @param _newRegistryAddress Address of the new registry contract
     */
    function setTimestampRegistry(address _newRegistryAddress) external onlyRole(REGISTRY_MANAGER_ROLE) whenNotPaused {
        require(_newRegistryAddress != address(0), "Registry address cannot be zero");
        
        address oldRegistry = address(timestampRegistry);
        timestampRegistry = ITimestampRegistry(_newRegistryAddress);
        
        emit RegistryUpdated(oldRegistry, _newRegistryAddress);
    }
    
    /**
     * @notice Get the current token ID counter value
     * @return Current token ID counter value
     */
    function getCurrentTokenId() external view returns (uint256) {
        return _nextTokenId - 1;
    }
    
    /**
     * @notice Check if contract supports an interface
     * @param interfaceId Interface identifier
     * @return True if interface is supported
     */
    function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
    
    /**
     * @notice Get the URI for a token
     * @param tokenId ID of the token
     * @return URI for token metadata
     */
    function tokenURI(uint256 tokenId) public view override(ERC721URIStorage) returns (string memory) {
        require(_tokenExists(tokenId), "ERC721URIStorage: URI query for nonexistent token");
        return string(abi.encodePacked(baseURI, tokenId.toString()));
    }
}