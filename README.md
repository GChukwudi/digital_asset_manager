# 🔐 Blockchain Asset Manager

A decentralized platform to register, manage, and verify ownership of digital assets using the Ethereum blockchain. Built with React, Vite, and Solidity.

**🌐 Live App**: [https://your-render-link.com](https://assetregistry.onrender.com)

---

## 🚀 Features

- 🧾 Mint and register new digital assets
- 📜 View assets linked to your wallet
- 🔍 Inspect asset metadata and content hash
- 🛠️ Update asset information
- 🔗 Smart contract interactions via MetaMask

---

## 🛠 Tech Stack

- **Frontend**: React + Vite
- **Blockchain**: Solidity
- **Web3 Library**: `ethers.js`
- **Wallet Integration**: MetaMask
- **Storage**: [Pinata](https://app.pinata.cloud/ipfs) for IPFS hosting

---

## 📂 Project Structure

```bash
blockchain-asset-manager/
├── abi/
│   └── AssetRegistry.json      # ABI from deployed contract
├── src/
│   ├── components/
│   ├── utils/
│   │   └── contract.js
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
└── AssetRegistry.sol
```

## Setup Instructions
1. Clone the repository
``` bash
git clone https://github.com/GChukwudi/digital_asset_manager.git
cd blockchain-asset-manager
```
2. Install dependencies
```bash
npm install
```
3. Start development server
``` bash
npm run dev
```
App will run at: http://localhost:5173

## How to Use the App
### Step 1: Upload Asset to Pinata
- Visit https://app.pinata.cloud/ipfs
- Create an account and log in
- Go to the Upload page and upload your asset (image, document, etc.)
- Copy the generated CID (Content Identifier)
### Step 2: Mint the Asset
- Open the Live App
- Connect your MetaMask wallet
- Go to the "Mint Asset" tab
- Fill in:
    - Title – the name of your asset
    - Metadata – optional description
    - Storage ID – CID from Pinata
    - Content Hash – generate hash for integrity
- Click "Register Asset"
Your asset is now stored on-chain and referenced via IPFS.

## Smart Contract Overview
- File: AssetRegistry.sol
- Functions:
    - mintAsset(title, metadata, storageId, contentHash)
    - getHolderTokens(address)
    - getAssetInfo(tokenId)
    - updateAsset(...)
Deploy it using Remix or Hardhat and paste the ABI into public/AssetRegistry.json.

## Contributions
Pull requests are welcome. Please open issues for suggestions or bugs.

