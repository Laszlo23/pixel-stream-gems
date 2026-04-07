// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {NFTStakingRewards} from "../src/NFTStakingRewards.sol";
import {GemsPlatformToken} from "../src/GemsPlatformToken.sol";
import {MockERC721} from "./MockERC721.sol";

contract NFTStakingRewardsTest is Test {
    address internal owner = address(0xA11CE);
    address internal bob = address(0xB0B);

    MockERC721 internal nft;
    GemsPlatformToken internal rewards;
    NFTStakingRewards internal farm;

    function setUp() public {
        nft = new MockERC721();
        vm.prank(owner);
        rewards = new GemsPlatformToken(owner, "RWD", "RWD", 1_000_000 ether);
        farm = new NFTStakingRewards(owner, address(nft), address(rewards));

        nft.mint(bob, 1);
        vm.prank(owner);
        rewards.mint(address(farm), 50_000 ether);
        vm.prank(owner);
        farm.notifyRewardAmount(7_000 ether);
    }

    function test_stakeWarpGetReward() public {
        vm.startPrank(bob);
        nft.setApprovalForAll(address(farm), true);
        farm.stake(1);
        vm.stopPrank();

        vm.warp(block.timestamp + 3.5 days);
        uint256 earned = farm.earned(bob);
        assertGt(earned, 0);

        uint256 before = rewards.balanceOf(bob);
        vm.prank(bob);
        farm.getReward();
        assertGt(rewards.balanceOf(bob), before);
    }
}
