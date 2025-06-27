import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Tabs from './components/Tabs';
import MintAsset from './components/MintAsset';
import AssetList from './components/AssetList';
import AssetDetails from './components/AssetDetails';
import { getContract, connectWallet, getCurrentAccount } from './utils/contract';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('mint');
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const currentAccount = await getCurrentAccount();
      if (currentAccount) {
        setAccount(currentAccount);
        const contractInstance = await getContract();
        setContract(contractInstance);
        await loadAssets(currentAccount, contractInstance);
      }
    } catch (error) {
      console.error('Failed to initialize app:', error);
    }
  };

  const handleConnect = async () => {
    try {
      const account = await connectWallet();
      setAccount(account);
      const contractInstance = await getContract();
      setContract(contractInstance);
      await loadAssets(account, contractInstance);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please make sure MetaMask is installed.');
    }
  };

  const loadAssets = async (account, contractInstance) => {
    if (!contractInstance || !account) return;
    
    try {
      setLoading(true);
      const tokenIds = await contractInstance.getHolderTokens(account);
      const assetPromises = tokenIds.map(async (tokenId) => {
        const assetInfo = await contractInstance.getAssetInfo(tokenId);
        return {
          tokenId: tokenId.toString(),
          title: assetInfo.title,
          metadata: assetInfo.metadata,
          storageId: assetInfo.storageId,
          contentHash: assetInfo.contentHash,
          holder: assetInfo.holder,
          mintedAt: new Date(assetInfo.mintedAt * 1000),
          updatedAt: new Date(assetInfo.updatedAt * 1000)
        };
      });
      
      const loadedAssets = await Promise.all(assetPromises);
      setAssets(loadedAssets);
    } catch (error) {
      console.error('Failed to load assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssetMinted = () => {
    if (account && contract) {
      loadAssets(account, contract);
    }
  };

  const handleAssetSelect = (asset) => {
    setSelectedAsset(asset);
    setActiveTab('details');
  };

  const handleAssetUpdated = () => {
    if (account && contract) {
      loadAssets(account, contract);
    }
  };

  return (
    <div className="app">
      <Header account={account} onConnect={handleConnect} />
      
      {account ? (
        <div className="main-content">
          <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
          
          <div className="tab-content">
            {activeTab === 'mint' && (
              <MintAsset 
                contract={contract} 
                account={account} 
                onAssetMinted={handleAssetMinted}
              />
            )}
            
            {activeTab === 'assets' && (
              <AssetList 
                assets={assets} 
                loading={loading}
                onAssetSelect={handleAssetSelect}
              />
            )}
            
            {activeTab === 'details' && (
              <AssetDetails 
                asset={selectedAsset}
                contract={contract}
                account={account}
                onAssetUpdated={handleAssetUpdated}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="connect-prompt">
          <h2>Welcome to Digital Asset Registry</h2>
          <p>Connect your wallet to start managing your digital assets</p>
          <button className="connect-button" onClick={handleConnect}>
            Connect Wallet
          </button>
        </div>
      )}
    </div>
  );
}

export default App;