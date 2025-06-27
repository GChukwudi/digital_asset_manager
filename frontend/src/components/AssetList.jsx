import { useEffect, useState } from "react";
import { getContract } from "../utils/contract";
import "../styles/AssetList.css";

const AssetList = () => {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const contract = await getContract();
        const total = await contract.totalSupply();
        const tempAssets = [];
        for (let i = 1; i <= total; i++) {
          const info = await contract.getAssetInfo(i);
          tempAssets.push(info);
        }
        setAssets(tempAssets);
      } catch (err) {
        console.error("Error loading assets", err);
      }
    };

    loadAssets();
  }, []);

  return (
    <div className="asset-list">
      <h3>All Assets</h3>
      <ul>
        {assets.map((asset, index) => (
          <li key={index}>
            #{asset[0]} - {asset[1]} ({asset[5].slice(0, 6)}...)
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssetList;
