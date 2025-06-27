import React from 'react';
import { formatDate, formatAddress } from '../utils/contract';
import '../styles/AssetList.css';

const AssetList = ({ assets, loading, onAssetSelect }) => {
  if (loading) {
    return (
      <div className="asset-list">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your assets...</p>
        </div>
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="asset-list">
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No Assets Found</h3>
          <p>You haven't minted any assets yet. Start by creating your first digital asset!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="asset-list">
      <div className="list-header">
        <h2>My Digital Assets</h2>
        <p>Manage and view your blockchain-verified assets</p>
        <div className="assets-count">
          Total Assets: <span>{assets.length}</span>
        </div>
      </div>
      
      <div className="assets-grid">
        {assets.map((asset) => (
          <div 
            key={asset.tokenId} 
            className="asset-card"
            onClick={() => onAssetSelect(asset)}
          >
            <div className="asset-card-header">
              <div className="asset-id">#{asset.tokenId}</div>
              <div className="asset-status">Active</div>
            </div>
            
            <div className="asset-card-body">
              <h3 className="asset-title">{asset.title}</h3>
              <p className="asset-metadata">
                {asset.metadata ? asset.metadata.substring(0, 100) + (asset.metadata.length > 100 ? '...' : '') : 'No description'}
              </p>
              
              <div className="asset-details">
                <div className="detail-item">
                  <span className="detail-label">Storage ID:</span>
                  <span className="detail-value storage-id">
                    {asset.storageId.length > 20 ? 
                      `${asset.storageId.substring(0, 20)}...` : 
                      asset.storageId
                    }
                  </span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Content Hash:</span>
                  <span className="detail-value content-hash">
                    {formatAddress(asset.contentHash)}
                  </span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Minted:</span>
                  <span className="detail-value">
                    {formatDate(asset.mintedAt)}
                  </span>
                </div>
                
                {asset.updatedAt.getTime() !== asset.mintedAt.getTime() && (
                  <div className="detail-item">
                    <span className="detail-label">Updated:</span>
                    <span className="detail-value">
                      {formatDate(asset.updatedAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="asset-card-footer">
              <button className="view-details-btn">
                View Details
                <span className="arrow">→</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetList;