// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title AssetRegistry
 * @dev Smart contract for managing digital asset ownership and provenance
 */
contract AssetRegistry {
    
    // Contract Owner
    address public owner;
    uint256 private nextTokenId;
    
    // Digital asset structure
    struct Asset {
        uint256 tokenId;
        string title;
        string metadata;
        string contentHash;     // Hash for content verification
        string storageId;       // IPFS or other storage identifier
        address holder;
        uint256 mintedAt;
        uint256 updatedAt;
        bool active;
    }
    
    // Storage mappings
    mapping(uint256 => Asset) private tokenRegistry;
    mapping(address => uint256[]) private holderTokens;
    mapping(string => bool) private usedHashes;
    mapping(string => bool) private usedStorageIds;
    
    // Contract events
    event TokenMinted(uint256 indexed tokenId, address indexed holder, string storageId, string contentHash, uint256 timestamp);
    event OwnershipChanged(uint256 indexed tokenId, address indexed previousHolder, address indexed newHolder, uint256 timestamp);
    event MetadataChanged(uint256 indexed tokenId, address indexed holder, uint256 timestamp);
    event SecurityAlert(uint256 indexed tokenId, string alertType, uint256 timestamp);
    
    // Access control modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can call this function");
        _;
    }
    
    modifier onlyTokenHolder(uint256 _tokenId) {
        require(tokenRegistry[_tokenId].active, "Token not found");
        require(tokenRegistry[_tokenId].holder == msg.sender, "Token holder access required");
        _;
    }
    
    modifier validToken(uint256 _tokenId) {
        require(tokenRegistry[_tokenId].active, "Token not found");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        nextTokenId = 1;
    }
    
    /**
     * @dev Check if content hash is already used
     * @param _contentHash Hash to verify
     * @return bool indicating if hash exists
     */
    function hashExists(string memory _contentHash) public view returns (bool) {
        return usedHashes[_contentHash];
    }
    
    /**
     * @dev Check if storage ID is already used
     * @param _storageId Storage identifier to verify
     * @return bool indicating if storage ID exists
     */
    function storageExists(string memory _storageId) public view returns (bool) {
        return usedStorageIds[_storageId];
    }
    
    /**
     * @dev Get total number of minted tokens
     * @return uint256 total token count
     */
    function totalSupply() public view returns (uint256) {
        return nextTokenId - 1;
    }
    
    /**
     * @dev Mint new digital asset token
     * @param _title Asset title
     * @param _metadata Asset description/metadata
     * @param _storageId Storage identifier (IPFS CID, etc.)
     * @param _contentHash Content verification hash
     * @return uint256 newly minted token ID
     */
    function mintAsset(
        string memory _title,
        string memory _metadata,
        string memory _storageId,
        string memory _contentHash
    ) public returns (uint256) {
        require(bytes(_title).length > 0, "Title required");
        require(bytes(_storageId).length > 0, "Storage ID required");
        require(bytes(_contentHash).length > 0, "Content hash required");
        require(!usedHashes[_contentHash], "Content hash already registered");
        require(!usedStorageIds[_storageId], "Storage ID already registered");
        
        uint256 tokenId = nextTokenId++;
        
        Asset memory newAsset = Asset({
            tokenId: tokenId,
            title: _title,
            metadata: _metadata,
            contentHash: _contentHash,
            storageId: _storageId,
            holder: msg.sender,
            mintedAt: block.timestamp,
            updatedAt: block.timestamp,
            active: true
        });
        
        tokenRegistry[tokenId] = newAsset;
        holderTokens[msg.sender].push(tokenId);
        usedHashes[_contentHash] = true;
        usedStorageIds[_storageId] = true;
        
        emit TokenMinted(tokenId, msg.sender, _storageId, _contentHash, block.timestamp);
        
        return tokenId;
    }
    
    /**
     * @dev Get complete asset information
     * @param _tokenId Token identifier
     * @return tokenId Token ID
     * @return title Asset title
     * @return metadata Asset metadata
     * @return storageId Storage identifier
     * @return contentHash Content hash
     * @return holder Current holder address
     * @return mintedAt Creation timestamp
     * @return updatedAt Last update timestamp
     */
    function getAssetInfo(uint256 _tokenId) public view validToken(_tokenId) returns (
        uint256 tokenId,
        string memory title,
        string memory metadata,
        string memory storageId,
        string memory contentHash,
        address holder,
        uint256 mintedAt,
        uint256 updatedAt
    ) {
        Asset storage asset = tokenRegistry[_tokenId];
        return (
            asset.tokenId,
            asset.title,
            asset.metadata,
            asset.storageId,
            asset.contentHash,
            asset.holder,
            asset.mintedAt,
            asset.updatedAt
        );
    }
    
    /**
     * @dev Verify asset content integrity
     * @param _tokenId Token to verify
     * @param _contentHash Hash to compare against
     * @return bool indicating if hashes match
     */
    function verifyContent(uint256 _tokenId, string memory _contentHash) public view validToken(_tokenId) returns (bool) {
        return keccak256(abi.encodePacked(tokenRegistry[_tokenId].contentHash)) == keccak256(abi.encodePacked(_contentHash));
    }
    
    /**
     * @dev Change asset ownership
     * @param _tokenId Token to transfer
     * @param _newHolder Address of new holder
     * @return bool indicating success
     */
    function changeOwnership(uint256 _tokenId, address _newHolder) public onlyTokenHolder(_tokenId) returns (bool) {
        require(_newHolder != address(0), "Invalid holder address");
        require(_newHolder != msg.sender, "Cannot transfer to self");
        
        address currentHolder = tokenRegistry[_tokenId].holder;
        tokenRegistry[_tokenId].holder = _newHolder;
        tokenRegistry[_tokenId].updatedAt = block.timestamp;
        
        _removeTokenFromHolder(currentHolder, _tokenId);
        holderTokens[_newHolder].push(_tokenId);
        
        emit OwnershipChanged(_tokenId, currentHolder, _newHolder, block.timestamp);
        
        return true;
    }
    
    /**
     * @dev Update asset metadata
     * @param _tokenId Token to update
     * @param _title New title
     * @param _metadata New metadata
     * @return bool indicating success
     */
    function updateMetadata(
        uint256 _tokenId,
        string memory _title,
        string memory _metadata
    ) public onlyTokenHolder(_tokenId) returns (bool) {
        require(bytes(_title).length > 0, "Title required");
        
        tokenRegistry[_tokenId].title = _title;
        tokenRegistry[_tokenId].metadata = _metadata;
        
        emit MetadataChanged(_tokenId, msg.sender, block.timestamp);
        
        return true;
    }
    
    /**
     * @dev Get all tokens held by an address
     * @param _holder Address to query
     * @return uint256[] array of token IDs
     */
    function getHolderTokens(address _holder) public view returns (uint256[] memory) {
        return holderTokens[_holder];
    }
    
    /**
     * @dev Report security concerns for a token
     * @param _tokenId Token ID
     * @param _alertType Type of security alert
     */
    function reportSecurityIssue(uint256 _tokenId, string memory _alertType) public validToken(_tokenId) {
        emit SecurityAlert(_tokenId, _alertType, block.timestamp);
    }
    
    /**
     * @dev Internal function to remove token from holder's list
     * @param _holder Address of holder
     * @param _tokenId Token ID to remove
     */
    function _removeTokenFromHolder(address _holder, uint256 _tokenId) private {
        uint256[] storage tokens = holderTokens[_holder];
        uint256 tokenCount = tokens.length;
        uint256 targetIndex = tokenCount;
        
        for (uint256 i = 0; i < tokenCount; i++) {
            if (tokens[i] == _tokenId) {
                targetIndex = i;
                break;
            }
        }
        
        if (targetIndex < tokenCount) {
            tokens[targetIndex] = tokens[tokenCount - 1];
            tokens.pop();
        }
    }
}
