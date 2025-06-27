import React, { useState } from 'react';
import '../styles/MintAsset.css';

const MintAsset = ({ contract, account, onAssetMinted }) => {
  const [formData, setFormData] = useState({
    title: '',
    metadata: '',
    storageId: '',
    contentHash: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.storageId.trim()) {
      newErrors.storageId = 'Storage ID is required';
    }
    
    if (!formData.contentHash.trim()) {
      newErrors.contentHash = 'Content hash is required';
    } else if (formData.contentHash.length < 32) {
      newErrors.contentHash = 'Content hash must be at least 32 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (!contract) {
      alert('Contract not initialized');
      return;
    }

    setIsLoading(true);
    
    try {
      // Check if hash or storage ID already exists
      const hashExists = await contract.hashExists(formData.contentHash);
      const storageExists = await contract.storageExists(formData.storageId);
      
      if (hashExists) {
        setErrors({ contentHash: 'This content hash is already registered' });
        return;
      }
      
      if (storageExists) {
        setErrors({ storageId: 'This storage ID is already registered' });
        return;
      }

      const tx = await contract.mintAsset(
        formData.title,
        formData.metadata,
        formData.storageId,
        formData.contentHash
      );
      
      await tx.wait();
      
      // Reset form
      setFormData({
        title: '',
        metadata: '',
        storageId: '',
        contentHash: ''
      });
      
      alert('Asset minted successfully!');
      onAssetMinted();
      
    } catch (error) {
      console.error('Error minting asset:', error);
      let errorMessage = 'Failed to mint asset';
      
      if (error.message.includes('user rejected')) {
        errorMessage = 'Transaction was rejected';
      } else if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for transaction';
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSampleHash = () => {
    const chars = 'abcdef0123456789';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    setFormData(prev => ({ ...prev, contentHash: hash }));
  };

  return (
    <div className="mint-asset">
      <div className="mint-header">
        <h2>Mint New Digital Asset</h2>
        <p>Create a new blockchain-verified digital asset</p>
      </div>
      
      <form onSubmit={handleSubmit} className="mint-form">
        <div className="form-group">
          <label htmlFor="title">Asset Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter asset title"
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="metadata">Description / Metadata</label>
          <textarea
            id="metadata"
            name="metadata"
            value={formData.metadata}
            onChange={handleInputChange}
            placeholder="Enter asset description or metadata"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="storageId">Storage ID (IPFS CID) *</label>
          <input
            type="text"
            id="storageId"
            name="storageId"
            value={formData.storageId}
            onChange={handleInputChange}
            placeholder="QmYourIPFSHashHere..."
            className={errors.storageId ? 'error' : ''}
          />
          {errors.storageId && <span className="error-message">{errors.storageId}</span>}
          <small className="form-hint">
            IPFS Content Identifier or other decentralized storage reference
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="contentHash">Content Hash *</label>
          <div className="hash-input-group">
            <input
              type="text"
              id="contentHash"
              name="contentHash"
              value={formData.contentHash}
              onChange={handleInputChange}
              placeholder="0x1234567890abcdef..."
              className={errors.contentHash ? 'error' : ''}
            />
            <button 
              type="button" 
              className="generate-btn"
              onClick={generateSampleHash}
            >
              Generate Hash
            </button>
          </div>
          {errors.contentHash && <span className="error-message">{errors.contentHash}</span>}
          <small className="form-hint">
            SHA-256 or other cryptographic hash of your content
          </small>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="mint-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Minting Asset...
              </>
            ) : (
              'Mint Asset'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MintAsset;