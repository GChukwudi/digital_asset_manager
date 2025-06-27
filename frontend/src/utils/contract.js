import { ethers } from "ethers";
import AssetRegistryABI from "../abi/AssetRegistry.json";

const CONTRACT_ADDRESS = "0x5B806d6ed1922C27654f4ad68cE336A844dde8f8";

export const getContract = async () => {
  if (!window.ethereum) throw new Error("Install MetaMask");

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, AssetRegistryABI, signer);
};
