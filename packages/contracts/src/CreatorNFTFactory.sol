// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {CreatorNFTCollection} from "./CreatorNFTCollection.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @notice Each wallet may deploy up to three {CreatorNFTCollection} contracts (Access / Moments / Perks slots).
contract CreatorNFTFactory is Ownable {
    uint8 public constant MAX_COLLECTIONS_PER_CREATOR = 3;

    mapping(address => uint8) public collectionCount;
    mapping(address => address[]) private _collections;

    event CreatorCollectionDeployed(
        address indexed creator, address indexed collection, uint8 indexed collectionKind, string name, string symbol
    );

    constructor(address initialOwner) Ownable(initialOwner) {}

    function collectionsOf(address creator) external view returns (address[] memory) {
        return _collections[creator];
    }

    /// @param collectionKind_ 0 Access Pass, 1 Moments, 2 Premium Perks
    function deployCollection(
        uint8 collectionKind_,
        string calldata name_,
        string calldata symbol_,
        uint256 maxSupply_,
        uint256 mintPriceWei_,
        uint96 royaltyBps
    ) external returns (address collection) {
        require(collectionCount[msg.sender] < MAX_COLLECTIONS_PER_CREATOR, "NFTFactory: max collections");
        require(collectionKind_ < 3, "NFTFactory: kind");
        CreatorNFTCollection col = new CreatorNFTCollection(
            name_, symbol_, msg.sender, collectionKind_, maxSupply_, mintPriceWei_, msg.sender, royaltyBps
        );
        collection = address(col);
        collectionCount[msg.sender]++;
        _collections[msg.sender].push(collection);
        emit CreatorCollectionDeployed(msg.sender, collection, collectionKind_, name_, symbol_);
    }
}
