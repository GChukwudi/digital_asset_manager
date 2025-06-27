import { useState } from "react";
import { getContract } from "../utils/contract";
import "../styles/MintAsset.css";

const MintAsset = () => {
  const [formData, setFormData] = useState({
    title: "",
    metadata: "",
    storageId: "",
    contentHash: ""
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const mint = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.mintAsset(
        formData.title,
        formData.metadata,
        formData.storageId,
        formData.contentHash
      );
      await tx.wait();
      setStatus("Asset Minted Successfully!");
    } catch (err) {
      console.error(err);
      setStatus("Error Minting Asset");
    }
  };

  return (
    <div className="mint-asset">
      <input name="title" placeholder="Title" onChange={handleChange} />
      <input name="metadata" placeholder="Metadata" onChange={handleChange} />
      <input name="storageId" placeholder="Storage ID (e.g. IPFS CID)" onChange={handleChange} />
      <input name="contentHash" placeholder="Content Hash" onChange={handleChange} />
      <button onClick={mint}>Mint Asset</button>
      <p>{status}</p>
    </div>
  );
};

export default MintAsset;
