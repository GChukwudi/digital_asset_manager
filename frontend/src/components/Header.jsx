import React from 'react';
import { formatAddress } from '../utils/contract';
import '../styles/Header.css';

const Header = ({ account, onConnect }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title">
            <span className="header-icon">🎨</span>
            Digital Asset Registry
          </h1>
          <p className="header-subtitle">Secure blockchain-based asset management</p>
        </div>
        
        <div className="header-right">
          {account ? (
            <div className="account-info">
              <div className="account-indicator"></div>
              <span className="account-address">{formatAddress(account)}</span>
            </div>
          ) : (
            <button className="connect-wallet-btn" onClick={onConnect}>
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;