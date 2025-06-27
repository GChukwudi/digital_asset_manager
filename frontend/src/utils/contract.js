import { ethers } from 'ethers';
import AssetRegistryABI from '../abi/AssetRegistry.json';

// Replace with your deployed contract address
const CONTRACT_ADDRESS = '0x5B806d6ed1922C27654f4ad68cE336A844dde8f8'; // Add your contract address here

let provider;
let signer;
let contract;

export const connectWallet = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
      return await signer.getAddress();
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      throw error;
    }
  } else {
    throw new Error('MetaMask is not installed');
  }
};

export const getCurrentAccount = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        return accounts[0];
      }
    } catch (error) {
      console.error('Error getting current account:', error);
    }
  }
  return null;
};

export const getContract = async () => {
  if (!signer) {
    throw new Error('Wallet not connected');
  }
  
  if (!contract) {
    contract = new ethers.Contract(CONTRACT_ADDRESS, AssetRegistryABI, signer);
  }
  
  return contract;
};

export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};