// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @notice Pull-based fee splitter for a single ERC-20. Deposits are split by `platformBps` to platform vs creator.
contract FeeVault is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable asset;
    address public platform;
    address public creator;
    /// @dev Basis points out of 10_000 sent to `platform`; remainder to `creator`.
    uint256 public platformBps;

    uint256 public platformAccrued;
    uint256 public creatorAccrued;

    event PlatformUpdated(address indexed previousPlatform, address indexed newPlatform);
    event CreatorUpdated(address indexed previousCreator, address indexed newCreator);
    event PlatformBpsUpdated(uint256 previousBps, uint256 newBps);
    event Deposited(address indexed from, uint256 amount);
    event PlatformClaimed(address indexed to, uint256 amount);
    event CreatorClaimed(address indexed to, uint256 amount);

    constructor(IERC20 asset_, address initialOwner, address platform_, address creator_, uint256 platformBps_)
        Ownable(initialOwner)
    {
        require(platformBps_ <= 10_000, "FeeVault: bps");
        asset = asset_;
        platform = platform_;
        creator = creator_;
        platformBps = platformBps_;
    }

    function setPlatform(address newPlatform) external onlyOwner {
        emit PlatformUpdated(platform, newPlatform);
        platform = newPlatform;
    }

    function setCreator(address newCreator) external onlyOwner {
        emit CreatorUpdated(creator, newCreator);
        creator = newCreator;
    }

    function setPlatformBps(uint256 newBps) external onlyOwner {
        require(newBps <= 10_000, "FeeVault: bps");
        emit PlatformBpsUpdated(platformBps, newBps);
        platformBps = newBps;
    }

    /// @notice Pull `amount` from caller and credit platform / creator balances.
    function deposit(uint256 amount) external {
        require(amount > 0, "FeeVault: zero");
        asset.safeTransferFrom(msg.sender, address(this), amount);
        uint256 toPlatform = (amount * platformBps) / 10_000;
        uint256 toCreator = amount - toPlatform;
        platformAccrued += toPlatform;
        creatorAccrued += toCreator;
        emit Deposited(msg.sender, amount);
    }

    function claimPlatform() external {
        uint256 a = platformAccrued;
        require(a > 0, "FeeVault: nothing");
        platformAccrued = 0;
        asset.safeTransfer(platform, a);
        emit PlatformClaimed(platform, a);
    }

    function claimCreator() external {
        uint256 a = creatorAccrued;
        require(a > 0, "FeeVault: nothing");
        creatorAccrued = 0;
        asset.safeTransfer(creator, a);
        emit CreatorClaimed(creator, a);
    }
}
