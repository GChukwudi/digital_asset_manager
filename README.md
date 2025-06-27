# 🔐 Blockchain Asset Manager

A decentralized platform to register, manage, and verify ownership of digital assets using the Ethereum blockchain. Built with React, Vite, and Solidity.

**🌐 Live App**: [https://your-render-link.com](https://your-render-link.com)

---

## 🚀 Features

- 🧾 Mint and register new digital assets
- 📜 View assets linked to your wallet
- 🔍 Inspect asset metadata and content hash
- 🛠️ Update asset information
- 🌐 IPFS-compatible via **Pinata CIDs**
- 🔗 Smart contract interactions via MetaMask

---

## 🛠 Tech Stack

- **Frontend**: React + Vite
- **Blockchain**: Solidity
- **Web3 Library**: `ethers.js`
- **Wallet Integration**: MetaMask
- **Storage**: [Pinata](https://www.pinata.cloud/) for IPFS hosting

---

## 📂 Project Structure

```bash
blockchain-asset-manager/
├── public/
│   └── AssetRegistry.json      # ABI from deployed contract
├── src/
│   ├── components/
│   ├── utils/
│   │   └── contract.js
│   ├── App.jsx
│   └── main.jsx
├── smart-contract/
│   └── AssetRegistry.sol
├── package.json
└── vite.config.js
