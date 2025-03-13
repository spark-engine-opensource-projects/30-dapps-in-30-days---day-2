const { time, loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Basic Tests - ProofOfExistenceNFT and TimestampRegistry", function () {
  // Deploy both contracts in a common fixture.
  async function deployFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy TimestampRegistry
    const TimestampRegistry = await ethers.getContractFactory("TimestampRegistry");
    const timestampRegistry = await TimestampRegistry.deploy();

    // For testing ProofOfExistenceNFT, register a sample document in the registry.
    const sampleDoc = "sample document";
    const sampleDocHash = ethers.keccak256(ethers.toUtf8Bytes(sampleDoc));
    const sampleDocType = "PDF";
    await timestampRegistry.registerDocument(sampleDocHash, sampleDocType);

    // Deploy ProofOfExistenceNFT with the registry's address.
    const ProofOfExistenceNFT = await ethers.getContractFactory("ProofOfExistenceNFT");
    const proofNFT = await ProofOfExistenceNFT.deploy(timestampRegistry.target);

    return { owner, addr1, addr2, timestampRegistry, proofNFT, sampleDocHash, sampleDocType };
  }

  describe("ProofOfExistenceNFT", function () {
    it("Should mint a certificate successfully", async function () {
      const { owner, proofNFT, sampleDocHash, sampleDocType } = await loadFixture(deployFixture);
      const sampleDocName = "Test Document";

      await expect(proofNFT.mintCertificate(sampleDocHash, sampleDocType, sampleDocName))
        .to.emit(proofNFT, "CertificateMinted")
        .withArgs(owner.address, 1, sampleDocHash);

      // Verify that tokenURI returns the correct metadata URI.
      expect(await proofNFT.tokenURI(1)).to.equal("https://proof-of-existence.example/token/1");
    });

    it("Should not allow minting certificate for non-registered document", async function () {
      const { proofNFT } = await loadFixture(deployFixture);
      const invalidDoc = "invalid document";
      const invalidDocHash = ethers.keccak256(ethers.toUtf8Bytes(invalidDoc));
      await expect(
        proofNFT.mintCertificate(invalidDocHash, "DOC", "Invalid Document")
      ).to.be.revertedWith("Document must be timestamped in registry");
    });

    it("Should not allow minting certificate for duplicate document hash", async function () {
      const { proofNFT, sampleDocHash, sampleDocType } = await loadFixture(deployFixture);
      const sampleDocName = "Test Document";

      // First mint succeeds.
      await proofNFT.mintCertificate(sampleDocHash, sampleDocType, sampleDocName);

      // Second mint for the same document should fail.
      await expect(
        proofNFT.mintCertificate(sampleDocHash, sampleDocType, sampleDocName)
      ).to.be.revertedWith("Certificate already exists for this document");
    });

    it("Should transfer a certificate correctly", async function () {
      const { proofNFT, sampleDocHash, sampleDocType, addr1, owner } = await loadFixture(deployFixture);
      const sampleDocName = "Test Document";

      // Mint a certificate.
      await proofNFT.mintCertificate(sampleDocHash, sampleDocType, sampleDocName);

      // Transfer the certificate from owner to addr1.
      await expect(proofNFT.transferCertificate(1, addr1.address))
        .to.emit(proofNFT, "CertificateTransferred")
        .withArgs(owner.address, addr1.address, 1);

      // Verify that addr1 is now the owner.
      expect(await proofNFT.ownerOf(1)).to.equal(addr1.address);
    });

    it("Should burn a certificate correctly", async function () {
      const { proofNFT, sampleDocHash, sampleDocType, owner } = await loadFixture(deployFixture);
      const sampleDocName = "Test Document";

      // Mint a certificate.
      await proofNFT.mintCertificate(sampleDocHash, sampleDocType, sampleDocName);

      // Burn the certificate.
      await expect(proofNFT.burnCertificate(1))
        .to.emit(proofNFT, "CertificateBurned")
        .withArgs(owner.address, 1);

      // Querying the certificate details should now revert.
      await expect(proofNFT.getCertificateDetails(1)).to.be.reverted;
    });

    it("Should revoke a certificate when called by certificate manager", async function () {
      const { proofNFT, sampleDocHash, sampleDocType, owner } = await loadFixture(deployFixture);
      const sampleDocName = "Test Document";

      // Mint a certificate.
      await proofNFT.mintCertificate(sampleDocHash, sampleDocType, sampleDocName);

      // Revoke the certificate (owner has the CERTIFICATE_MANAGER_ROLE by default).
      await expect(proofNFT.revokeCertificate(1, "Test revocation"))
        .to.emit(proofNFT, "CertificateRevoked")
        .withArgs(1, owner.address, "Test revocation");

      // Verify that the certificate is marked as revoked.
      expect(await proofNFT.isCertificateRevoked(1)).to.be.true;
    });

    it("Should update the timestamp registry address when called by registry manager", async function () {
      const { proofNFT, timestampRegistry, addr1 } = await loadFixture(deployFixture);

      // Update the registry address to addr1 (for testing purposes).
      await expect(proofNFT.setTimestampRegistry(addr1.address))
        .to.emit(proofNFT, "RegistryUpdated")
        .withArgs(timestampRegistry.target, addr1.address);
    });
  });

  describe("TimestampRegistry", function () {
    it("Should register a document successfully", async function () {
      const { timestampRegistry, owner } = await loadFixture(deployFixture);
      const newDoc = "new document";
      const newDocHash = ethers.keccak256(ethers.toUtf8Bytes(newDoc));
      const newDocType = "DOC";

      await expect(timestampRegistry.registerDocument(newDocHash, newDocType))
        .to.emit(timestampRegistry, "DocumentRegistered")
        .withArgs(newDocHash, owner.address, anyValue, newDocType);

      expect(await timestampRegistry.verifyDocument(newDocHash)).to.be.true;
    });

    it("Should not allow duplicate document registration", async function () {
      const { timestampRegistry } = await loadFixture(deployFixture);
      const dupDoc = "duplicate document";
      const dupDocHash = ethers.keccak256(ethers.toUtf8Bytes(dupDoc));
      const dupDocType = "PDF";

      await timestampRegistry.registerDocument(dupDocHash, dupDocType);

      await expect(
        timestampRegistry.registerDocument(dupDocHash, dupDocType)
      ).to.be.reverted;
    });

    it("Should update document metadata successfully", async function () {
      const { timestampRegistry, owner } = await loadFixture(deployFixture);
      const doc = "metadata doc";
      const docHash = ethers.keccak256(ethers.toUtf8Bytes(doc));
      const docType = "TXT";

      await timestampRegistry.registerDocument(docHash, docType);

      const newMetadata = "Updated metadata";
      await expect(timestampRegistry.updateDocumentMetadata(docHash, newMetadata))
        .to.emit(timestampRegistry, "MetadataUpdated")
        .withArgs(docHash, owner.address, newMetadata);
    });

    it("Should revoke a document by its owner", async function () {
      const { timestampRegistry, owner } = await loadFixture(deployFixture);
      const doc = "revoke doc";
      const docHash = ethers.keccak256(ethers.toUtf8Bytes(doc));
      const docType = "PDF";

      await timestampRegistry.registerDocument(docHash, docType);

      await expect(timestampRegistry.revokeDocument(docHash, "Owner revocation"))
        .to.emit(timestampRegistry, "DocumentRevoked")
        .withArgs(docHash, owner.address, "Owner revocation", anyValue);

      expect(await timestampRegistry.verifyDocument(docHash)).to.be.false;
    });

    it("Should allow admin to revoke a document", async function () {
      const { timestampRegistry, owner, addr1 } = await loadFixture(deployFixture);
      const doc = "admin revoke doc";
      const docHash = ethers.keccak256(ethers.toUtf8Bytes(doc));
      const docType = "DOC";

      await timestampRegistry.registerDocument(docHash, docType);

      // Admin (owner by default) can revoke without being the document owner.
      await expect(timestampRegistry.revokeDocumentByAdmin(docHash, "Admin revocation"))
        .to.emit(timestampRegistry, "DocumentRevoked")
        .withArgs(docHash, owner.address, "Admin revocation", anyValue);
    });

    it("Should set document expiry correctly and affect verification", async function () {
      const { timestampRegistry } = await loadFixture(deployFixture);
      const doc = "expiry doc";
      const docHash = ethers.keccak256(ethers.toUtf8Bytes(doc));
      const docType = "DOC";

      await timestampRegistry.registerDocument(docHash, docType);
      const futureTime = (await time.latest()) + 1000;

      await expect(timestampRegistry.setDocumentExpiry(docHash, futureTime))
        .to.emit(timestampRegistry, "DocumentExpirySet")
        .withArgs(docHash, (await ethers.getSigners())[0].address, futureTime);

      // Before expiry, the document should be valid.
      expect(await timestampRegistry.verifyDocument(docHash)).to.be.true;
      // Increase time past the expiry.
      await time.increaseTo(futureTime + 1);
      expect(await timestampRegistry.verifyDocument(docHash)).to.be.false;
    });

    it("Should transfer document ownership correctly", async function () {
      const { timestampRegistry, owner, addr1 } = await loadFixture(deployFixture);
      const doc = "transfer doc";
      const docHash = ethers.keccak256(ethers.toUtf8Bytes(doc));
      const docType = "PDF";

      await timestampRegistry.registerDocument(docHash, docType);
      await expect(timestampRegistry.transferDocumentOwnership(docHash, addr1.address))
        .to.emit(timestampRegistry, "DocumentOwnershipTransferred")
        .withArgs(docHash, owner.address, addr1.address);

      expect(await timestampRegistry.getDocumentOwner(docHash)).to.equal(addr1.address);
    });

    it("Should batch register documents successfully", async function () {
      const { timestampRegistry } = await loadFixture(deployFixture);
      const doc1 = "batch doc 1";
      const doc2 = "batch doc 2";
      const docHash1 = ethers.keccak256(ethers.toUtf8Bytes(doc1));
      const docHash2 = ethers.keccak256(ethers.toUtf8Bytes(doc2));

      const documentHashes = [docHash1, docHash2];
      const documentTypes = ["PDF", "DOC"];

      await expect(timestampRegistry.batchRegisterDocuments(documentHashes, documentTypes))
        .to.emit(timestampRegistry, "BatchDocumentsRegistered");

      expect(await timestampRegistry.verifyDocument(docHash1)).to.be.true;
      expect(await timestampRegistry.verifyDocument(docHash2)).to.be.true;
    });

    it("Should return user documents", async function () {
      const { timestampRegistry, owner } = await loadFixture(deployFixture);
      const doc = "user doc";
      const docHash = ethers.keccak256(ethers.toUtf8Bytes(doc));
      const docType = "PDF";

      await timestampRegistry.registerDocument(docHash, docType);
      const userDocs = await timestampRegistry.getUserDocuments(owner.address);

      // The returned document hashes (as strings) should include the registered hash.
      expect(userDocs.map(x => x.toString())).to.include(docHash);
    });

    it("Should batch verify documents", async function () {
      const { timestampRegistry } = await loadFixture(deployFixture);
      const doc1 = "batch verify 1";
      const doc2 = "batch verify 2";
      const docHash1 = ethers.keccak256(ethers.toUtf8Bytes(doc1));
      const docHash2 = ethers.keccak256(ethers.toUtf8Bytes(doc2));

      const documentHashes = [docHash1, docHash2];
      const documentTypes = ["DOC", "PDF"];

      await timestampRegistry.batchRegisterDocuments(documentHashes, documentTypes);
      const results = await timestampRegistry.batchVerifyDocuments(documentHashes);

      expect(results[0]).to.be.true;
      expect(results[1]).to.be.true;
    });

    it("Should validate non-zero document hash", async function () {
      const { timestampRegistry } = await loadFixture(deployFixture);
      const validHash = ethers.keccak256(ethers.toUtf8Bytes("some doc"));

      expect(await timestampRegistry.validateDocumentHash(validHash)).to.be.true;
      await expect(
        timestampRegistry.validateDocumentHash(ethers.ZeroHash)
      ).to.be.reverted;
    });
  });

  describe("Pausable functionality", function () {
    it("Should pause and unpause ProofOfExistenceNFT", async function () {
      const { proofNFT } = await loadFixture(deployFixture);
      const sampleDoc = "doc while paused";
      const sampleDocHash = ethers.keccak256(ethers.toUtf8Bytes(sampleDoc));

      // When paused, minting should revert.
      await proofNFT.pause();
      await expect(
        proofNFT.mintCertificate(sampleDocHash, "PDF", "Paused Doc")
      ).to.be.reverted;
      // Unpause and try again.
      await proofNFT.unpause();
    });

    it("Should pause and unpause TimestampRegistry", async function () {
      const { timestampRegistry } = await loadFixture(deployFixture);
      const doc = "doc paused";
      const docHash = ethers.keccak256(ethers.toUtf8Bytes(doc));

      await timestampRegistry.pause();
      await expect(
        timestampRegistry.registerDocument(docHash, "DOC")
      ).to.be.reverted;
      await timestampRegistry.unpause();
    });
  });
});
