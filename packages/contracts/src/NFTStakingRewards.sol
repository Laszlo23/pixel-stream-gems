// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

/// @notice Stake NFTs from a single collection; each staked token counts as one share for reward accounting.
contract NFTStakingRewards is IERC721Receiver, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC721 public immutable stakingNFT;
    IERC20 public immutable rewardsToken;

    uint256 public rewardRate;
    uint256 public periodFinish;
    uint256 public rewardsDuration = 7 days;
    uint256 public lastUpdateTime;
    uint256 public rewardPerShareStored;

    mapping(address => uint256) public userRewardPerSharePaid;
    mapping(address => uint256) public rewards;

    mapping(uint256 => address) public stakedOwner;
    mapping(address => uint256) public stakedBalance;

    uint256 private _totalStaked;

    event RewardAdded(uint256 reward, uint256 duration);
    event Staked(address indexed user, uint256 indexed tokenId);
    event Unstaked(address indexed user, uint256 indexed tokenId);
    event RewardPaid(address indexed user, uint256 reward);

    constructor(address initialOwner, address stakingNFT_, address rewardsToken_) Ownable(initialOwner) {
        stakingNFT = IERC721(stakingNFT_);
        rewardsToken = IERC20(rewardsToken_);
    }

    function totalStaked() external view returns (uint256) {
        return _totalStaked;
    }

    function lastTimeRewardApplicable() public view returns (uint256) {
        return block.timestamp < periodFinish ? block.timestamp : periodFinish;
    }

    function rewardPerShare() public view returns (uint256) {
        if (_totalStaked == 0) {
            return rewardPerShareStored;
        }
        return rewardPerShareStored + ((lastTimeRewardApplicable() - lastUpdateTime) * rewardRate * 1e18) / _totalStaked;
    }

    function earned(address account) public view returns (uint256) {
        uint256 rps = rewardPerShare();
        return (stakedBalance[account] * (rps - userRewardPerSharePaid[account])) / 1e18 + rewards[account];
    }

    function _updateReward(address account) internal {
        rewardPerShareStored = rewardPerShare();
        lastUpdateTime = lastTimeRewardApplicable();
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerSharePaid[account] = rewardPerShareStored;
        }
    }

    function onERC721Received(address, address from, uint256 tokenId, bytes calldata)
        external
        override
        returns (bytes4)
    {
        require(msg.sender == address(stakingNFT), "NFTStake: wrong nft");
        require(stakedOwner[tokenId] == address(0), "NFTStake: already staked");
        _updateReward(from);
        stakedOwner[tokenId] = from;
        stakedBalance[from]++;
        _totalStaked++;
        emit Staked(from, tokenId);
        return IERC721Receiver.onERC721Received.selector;
    }

    function stake(uint256 tokenId) external nonReentrant {
        stakingNFT.safeTransferFrom(msg.sender, address(this), tokenId);
    }

    function unstake(uint256 tokenId) external nonReentrant {
        require(stakedOwner[tokenId] == msg.sender, "NFTStake: not staker");
        _updateReward(msg.sender);
        stakedOwner[tokenId] = address(0);
        stakedBalance[msg.sender]--;
        _totalStaked--;
        stakingNFT.safeTransferFrom(address(this), msg.sender, tokenId);
        emit Unstaked(msg.sender, tokenId);
    }

    function getReward() external nonReentrant {
        _updateReward(msg.sender);
        uint256 r = rewards[msg.sender];
        if (r > 0) {
            rewards[msg.sender] = 0;
            rewardsToken.safeTransfer(msg.sender, r);
            emit RewardPaid(msg.sender, r);
        }
    }

    function notifyRewardAmount(uint256 reward) external onlyOwner {
        _updateReward(address(0));
        if (block.timestamp >= periodFinish) {
            rewardRate = reward / rewardsDuration;
        } else {
            uint256 remaining = periodFinish - block.timestamp;
            uint256 leftover = remaining * rewardRate;
            rewardRate = (reward + leftover) / rewardsDuration;
        }
        uint256 balance = rewardsToken.balanceOf(address(this));
        require(rewardRate <= balance / rewardsDuration, "notify: balance");
        lastUpdateTime = block.timestamp;
        periodFinish = block.timestamp + rewardsDuration;
        emit RewardAdded(reward, rewardsDuration);
    }

    function setRewardsDuration(uint256 newDuration) external onlyOwner {
        require(block.timestamp > periodFinish, "duration: active");
        require(newDuration > 0, "duration: 0");
        rewardsDuration = newDuration;
    }
}
