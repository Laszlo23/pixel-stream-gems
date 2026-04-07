// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC2981} from "@openzeppelin/contracts/interfaces/IERC2981.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @notice Fixed-price ETH listings for ERC-721. Pays EIP-2981 royalty (if supported) then platform fee; remainder to seller.
contract GemsMarketplace is Ownable, ReentrancyGuard {
    struct Listing {
        address seller;
        uint256 priceWei;
    }

    mapping(address nft => mapping(uint256 tokenId => Listing)) public listings;

    address public feeRecipient;
    /// @dev Basis points of gross sale price (before royalty) taken as platform fee — applied after royalty in payout math below.
    uint256 public platformFeeBps;

    event FeeRecipientUpdated(address indexed previousRecipient, address indexed newRecipient);
    event PlatformFeeBpsUpdated(uint256 previousBps, uint256 newBps);
    event Listed(address indexed nft, uint256 indexed tokenId, address indexed seller, uint256 priceWei);
    event Cancelled(address indexed nft, uint256 indexed tokenId, address indexed seller);
    event Sold(address indexed nft, uint256 indexed tokenId, address seller, address buyer, uint256 priceWei);

    constructor(address initialOwner, address feeRecipient_, uint256 platformFeeBps_) Ownable(initialOwner) {
        require(platformFeeBps_ <= 2000, "Market: fee");
        feeRecipient = feeRecipient_;
        platformFeeBps = platformFeeBps_;
    }

    function setFeeRecipient(address r) external onlyOwner {
        emit FeeRecipientUpdated(feeRecipient, r);
        feeRecipient = r;
    }

    function setPlatformFeeBps(uint256 bps) external onlyOwner {
        require(bps <= 2000, "Market: fee");
        emit PlatformFeeBpsUpdated(platformFeeBps, bps);
        platformFeeBps = bps;
    }

    function list(address nft, uint256 tokenId, uint256 priceWei) external nonReentrant {
        require(priceWei > 0, "Market: price");
        IERC721 erc721 = IERC721(nft);
        erc721.transferFrom(msg.sender, address(this), tokenId);
        listings[nft][tokenId] = Listing({seller: msg.sender, priceWei: priceWei});
        emit Listed(nft, tokenId, msg.sender, priceWei);
    }

    function cancel(address nft, uint256 tokenId) external nonReentrant {
        Listing memory l = listings[nft][tokenId];
        require(l.seller == msg.sender, "Market: not seller");
        delete listings[nft][tokenId];
        IERC721(nft).transferFrom(address(this), msg.sender, tokenId);
        emit Cancelled(nft, tokenId, msg.sender);
    }

    function buy(address nft, uint256 tokenId) external payable nonReentrant {
        Listing memory l = listings[nft][tokenId];
        require(l.seller != address(0), "Market: not listed");
        require(msg.value == l.priceWei, "Market: wrong value");
        delete listings[nft][tokenId];

        uint256 royalty = 0;
        address royaltyReceiver = address(0);
        if (IERC165(nft).supportsInterface(type(IERC2981).interfaceId)) {
            (royaltyReceiver, royalty) = IERC2981(nft).royaltyInfo(tokenId, l.priceWei);
            if (royalty > l.priceWei) royalty = l.priceWei;
        }

        uint256 platformFee = (l.priceWei * platformFeeBps) / 10_000;
        uint256 toSeller = l.priceWei - royalty - platformFee;
        require(toSeller + royalty + platformFee == l.priceWei, "Market: payout");

        if (royalty > 0 && royaltyReceiver != address(0)) {
            (bool rOk,) = payable(royaltyReceiver).call{value: royalty}("");
            require(rOk, "Market: royalty");
        }
        if (platformFee > 0 && feeRecipient != address(0)) {
            (bool pOk,) = payable(feeRecipient).call{value: platformFee}("");
            require(pOk, "Market: platform");
        }
        (bool sOk,) = payable(l.seller).call{value: toSeller}("");
        require(sOk, "Market: seller");

        IERC721(nft).transferFrom(address(this), msg.sender, tokenId);
        emit Sold(nft, tokenId, l.seller, msg.sender, l.priceWei);
    }
}
