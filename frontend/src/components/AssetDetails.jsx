import React, { useState } from 'react';
import { formatDate, copyToClipboard } from '../utils/contract';
import '../styles/AssetDetails.css';

const AssetDetails = ({ asset, contract, account, onAssetUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', metadata: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [transferAddress, setTransferAddress] = useState('');
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [verifyHash, setVerifyHash] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);

  if (!asset) {
    return (
      <div className="asset-details">
        <div className="no-asset">
          <div className="no-asset-icon">🔍</div>
          <h3>No Asset Selected</h3>
          <p>Select an asset from the list to view its details</p>
        </div>
      </div>
    );
  }

  const handleCopy = async (text, type) => {
    const success = await copyToClipboard(text);
    if (success) {
      alert(`${type} copied to clipboard!`);
    }
  };

  const handleEditStart = () => {
    setEditForm({ title: asset.title, metadata: asset.metadata });
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditForm({ title: '', metadata: '' });
  };

  const handleEditSave = async () => {
    if (!contract || !editForm.title.trim()) {
      alert('Title is required');
      return;
    }

    setIsLoading(true);
    try {
      const tx = await contract.updateMetadata(
        asset.tokenId,
        editForm.title,
        editForm.metadata
      );
      await tx.wait();
      
      setIsEditing(false);
      alert('Asset updated successfully!');
      onAssetUpdated();
    } catch (error) {
      console.error('Error updating asset:', error);
      alert('Failed to update asset');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!contract || !transferAddress.trim()) {
      alert('Transfer address is required');
      return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(transferAddress)) {
      alert('Invalid Ethereum address');
      return;
    }

    setIsLoading(true);
    try {
      const tx = await contract.changeOwnership(asset.tokenId, transferAddress);
      await tx.wait();
      
      setShowTransferForm(false);
      setTransferAddress('');
      alert('Asset transferred successfully!');
      onAssetUpdated();
    } catch (error) {
      console.error('Error transferring asset:', error);
      alert('Failed to transfer asset');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyContent = async () => {
    if (!contract || !verifyHash.trim()) {
      alert('Hash is required for verification');
      return;
    }

    try {
      const isValid = await contract.verifyContent(asset.tokenId, verifyHash);
      setVerificationResult(isValid);
    } catch (error) {
      console.error('Error verifying content:', error);
      alert('Failed to verify content');
    }
  };

  const handleReportSecurity = async () => {
    const alertType = prompt('Enter security alert type:');
    if (!alertType) return;

    try {
      const tx = await contract.reportSecurityIssue(asset.tokenId, alertType);
      await tx.wait();
      alert('Security issue reported successfully!');
    } catch (error) {
      console.error('Error reporting security issue:', error);
      alert('Failed to report security issue');
    }
  };

  const isOwner = asset.holder.toLowerCase() === account?.toLowerCase();

  return (
    <div className="asset-details">
      <div className="details-header">
        <div className="asset-title-section">
          {isEditing ? (
            <div className="edit-title">
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="title-input"
              />
            </div>
          ) : (
            <>
              <h2>{asset.title}</h2>
              <div className="asset-badge">Token #{asset.tokenId}</div>
            </>
          )}
        </div>
        
        {isOwner && (
          <div className="action-buttons">
            {isEditing ? (
              <>
                <button 
                  className="save-btn" 
                  onClick={handleEditSave}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
                <button className="cancel-btn" onClick={handleEditCancel}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="edit-btn" onClick={handleEditStart}>
                Edit
              </button>
            )}
          </div>
        )}
      </div>

      <div className="details-content">
        <div className="info-section">
          <h3>Asset Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Description:</label>
              {isEditing ? (
                <textarea
                  value={editForm.metadata}
                  onChange={(e) => setEditForm({ ...editForm, metadata: e.target.value })}
                  className="metadata-input"
                  rows="4"
                />
              ) : (
                <div className="info-value">
                  {asset.metadata || 'No description provided'}
                </div>
              )}
            </div>

            <div className="info-item">
              <label>Storage ID:</label>
              <div className="info-value copyable" onClick={() => handleCopy(asset.storageId, 'Storage ID')}>
                {asset.storageId}
                <span className="copy-icon">📋</span>
              </div>
            </div>

            <div className="info-item">
              <label>Content Hash:</label>
              <div className="info-value copyable" onClick={() => handleCopy(asset.contentHash, 'Content Hash')}>
                {asset.contentHash}
                <span className="copy-icon">📋</span>
              </div>
            </div>

            <div className="info-item">
              <label>Owner:</label>
              <div className="info-value copyable" onClick={() => handleCopy(asset.holder, 'Owner Address')}>
                {asset.holder}
                <span className="copy-icon">📋</span>
              </div>
            </div>

            <div className="info-item">
              <label>Minted:</label>
              <div className="info-value">{formatDate(asset.mintedAt)}</div>
            </div>

            <div className="info-item">
              <label>Last Updated:</label>
              <div className="info-value">{formatDate(asset.updatedAt)}</div>
            </div>
          </div>
        </div>

        <div className="actions-section">
          <h3>Actions</h3>
          
          <div className="action-card">
            <h4>Verify Content</h4>
            <p>Verify the integrity of your asset content</p>
            <div className="verify-form">
              <input
                type="text"
                placeholder="Enter content hash to verify"
                value={verifyHash}
                onChange={(e) => setVerifyHash(e.target.value)}
                className="verify-input"
              />
              <button className="verify-btn" onClick={handleVerifyContent}>
                Verify
              </button>
            </div>
            {verificationResult !== null && (
              <div className={`verification-result ${verificationResult ? 'valid' : 'invalid'}`}>
                {verificationResult ? '✅ Content hash matches!' : '❌ Content hash does not match'}
              </div>
            )}
          </div>

          {isOwner && (
            <>
              <div className="action-card">
                <h4>Transfer Ownership</h4>
                <p>Transfer this asset to another address</p>
                {showTransferForm ? (
                  <div className="transfer-form">
                    <input
                      type="text"
                      placeholder="Enter recipient address (0x...)"
                      value={transferAddress}
                      onChange={(e) => setTransferAddress(e.target.value)}
                      className="transfer-input"
                    />
                    <div className="transfer-buttons">
                      <button 
                        className="transfer-btn" 
                        onClick={handleTransfer}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Transferring...' : 'Transfer'}
                      </button>
                      <button 
                        className="cancel-btn" 
                        onClick={() => setShowTransferForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    className="show-transfer-btn" 
                    onClick={() => setShowTransferForm(true)}
                  >
                    Transfer Asset
                  </button>
                )}
              </div>

              <div className="action-card">
                <h4>Report Security Issue</h4>
                <p>Report any security concerns with this asset</p>
                <button className="report-btn" onClick={handleReportSecurity}>
                  Report Issue
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetDetails;