import "../styles/Header.css";

const Header = ({ account }) => {
  return (
    <header className="app-header">
      <h1>🛡️ Digital Asset Registry</h1>
      <p>{account ? `Connected: ${account.slice(0, 6)}...` : "Not Connected"}</p>
    </header>
  );
};

export default Header;
