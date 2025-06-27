import ConnectWallet from "./components/ConnectWallet";
import MintAsset from "./components/MintAsset";
import AssetList from "./components/AssetList";
import AssetDetails from "./components/AssetDetails";

function App() {
  return (
    <div>
      <h1>Digital Asset Registry</h1>
      <ConnectWallet onConnect={() => {}} />
      <MintAsset />
      <AssetList />
      <AssetDetails />
    </div>
  );
}

export default App;
