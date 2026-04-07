// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Optional on-chain index: creator wallet → deployed token + up to three NFT collection addresses (for UIs / subgraph hints).
contract CreatorEconomyRegistry {
    mapping(address creator => address token) public creatorToken;
    mapping(address creator => address[3] collections) public nftCollections;
    mapping(address creator => address lpPool) public creatorBtcLiquidityPool;

    event CreatorTokenSet(address indexed creator, address indexed token);
    event NFTCollectionSet(address indexed creator, uint8 indexed slot, address collection);
    event LiquidityPoolSet(address indexed creator, address indexed pool);

    function setCreatorToken(address token) external {
        creatorToken[msg.sender] = token;
        emit CreatorTokenSet(msg.sender, token);
    }

    function setNFTCollection(uint8 slot, address collection) external {
        require(slot < 3, "Registry: slot");
        nftCollections[msg.sender][slot] = collection;
        emit NFTCollectionSet(msg.sender, slot, collection);
    }

    function setLiquidityPool(address pool) external {
        creatorBtcLiquidityPool[msg.sender] = pool;
        emit LiquidityPoolSet(msg.sender, pool);
    }
}
