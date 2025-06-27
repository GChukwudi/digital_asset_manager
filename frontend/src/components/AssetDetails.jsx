import { useState } from "react";
import { getContract } from "../utils/contract";
import "../styles/AssetDetails.css";

const AssetDetails = () => {
  const [tokenId, setTokenId] = useState("");
  const [details, setDetails] = useState(null);

  const fetchDetails = async () => {
    try {
      const contract = await getContract();
      const asset = await contract.getAssetInfo(parseInt(tokenId));
      setDetails(asset);
    } catch (err) {
      console.error("Failed to fetch details", err);
    }
  };

  return (
    <div className="asset-details">
      <input
        type="number"
        placeholder="Enter Token ID"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
      />
      <button onClick={fetchDetails}>Fetch Details</button>
      {details && (
        <div className="details">
          <p><strong>Title:</strong> {details[1]}</p>
          <p><strong>Metadata:</strong> {details[2]}</p>
          <p><strong>Storage ID:</strong> {details[3]}</p>
          <p><strong>Holder:</strong> {details[5]}</p>
        </div>
      )}
    </div>
  );
};

export default AssetDetails;
