// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {ERC2981} from "@openzeppelin/contracts/token/common/ERC2981.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @notice Per-creator ERC-721 collection with optional paid public mint, admin mint, and EIP-2981 royalties.
/// @dev `collectionKind`: 0 = Access Pass, 1 = Moments, 2 = Premium Perks (semantic only for frontends/indexers).
contract CreatorNFTCollection is ERC721URIStorage, ERC2981, Ownable, ReentrancyGuard {
    uint8 public immutable collectionKind;
    uint256 public maxSupply;
    uint256 public mintPriceWei;
    uint256 private _nextTokenId = 1;

    string private _baseTokenURI;

    event Minted(address indexed to, uint256 indexed tokenId, bool indexed paidMint);

    constructor(
        string memory name_,
        string memory symbol_,
        address owner_,
        uint8 collectionKind_,
        uint256 maxSupply_,
        uint256 mintPriceWei_,
        address royaltyReceiver,
        uint96 royaltyBps
    ) ERC721(name_, symbol_) Ownable(owner_) {
        require(collectionKind_ < 3, "CreatorNFT: kind");
        require(maxSupply_ > 0, "CreatorNFT: supply");
        require(royaltyBps <= 2500, "CreatorNFT: royalty"); // cap 25% signal
        collectionKind = collectionKind_;
        maxSupply = maxSupply_;
        mintPriceWei = mintPriceWei_;
        _setDefaultRoyalty(royaltyReceiver, royaltyBps);
    }

    function setBaseURI(string calldata baseUri) external onlyOwner {
        _baseTokenURI = baseUri;
    }

    function setMintPrice(uint256 newPriceWei) external onlyOwner {
        mintPriceWei = newPriceWei;
    }

    function setMaxSupply(uint256 newMax) external onlyOwner {
        require(newMax >= _nextTokenId - 1, "CreatorNFT: max below minted");
        maxSupply = newMax;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    /// @notice Public mint; pay `mintPriceWei` in ETH (or free if price is 0).
    function mint(string calldata uri) external payable nonReentrant returns (uint256 tokenId) {
        require(_nextTokenId <= maxSupply, "CreatorNFT: sold out");
        if (mintPriceWei > 0) {
            require(msg.value >= mintPriceWei, "CreatorNFT: price");
        }
        tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        if (bytes(uri).length > 0) {
            _setTokenURI(tokenId, uri);
        }
        emit Minted(msg.sender, tokenId, mintPriceWei > 0);
    }

    /// @notice Creator-only mint for drops, comps, or airdrops.
    function mintTo(address to, string calldata uri) external onlyOwner nonReentrant returns (uint256 tokenId) {
        require(_nextTokenId <= maxSupply, "CreatorNFT: sold out");
        tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        if (bytes(uri).length > 0) {
            _setTokenURI(tokenId, uri);
        }
        emit Minted(to, tokenId, false);
    }

    function withdrawETH() external onlyOwner nonReentrant {
        uint256 b = address(this).balance;
        require(b > 0, "CreatorNFT: empty");
        (bool ok,) = payable(owner()).call{value: b}("");
        require(ok, "CreatorNFT: withdraw");
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
