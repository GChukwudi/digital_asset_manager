import React, { useState } from 'react';
import { connectWallet } from '../utils/contract';
import '../styles/ConnectWallet.css';

const ConnectWallet = ({ onConnect }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async () => {
    setIsConnecting(true);
    setError('');

    try {
      const { account, contract } = await connectWallet();
      onConnect(account, contract);
    } catch (err) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="connect-wallet">
      <div className="connect-wallet-card">
        <div className="connect-wallet-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M21 8V6C21 4.9 20.1 4 19 4H5C3.9 4 3 4.9 3 6V18C3 19.1 3.9 20 5 20H19C20.1 20 21 19.1 21 18V16M21 12H13V8H21V12Z" 
              fill="currentColor"
            />
          </svg>
        </div>
        
        <h2>Connect Your Wallet</h2>
        <p>Connect your MetaMask wallet to interact with the Digital Asset Registry</p>

        {error && (
          <div className="error-message">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" 
                fill="currentColor"
              />
            </svg>
            {error}
          </div>
        )}

        <button 
          className="connect-button" 
          onClick={handleConnect} 
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <div className="loading-spinner"></div>
              Connecting...
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" 
                  fill="currentColor"
                />
              </svg>
              Connect MetaMask
            </>
          )}
        </button>

        <div className="connect-info">
          <p>Make sure you have MetaMask installed and are connected to the correct network.</p>
        </div>
      </div>
    </div>
  );
};

export default ConnectWallet;
