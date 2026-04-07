// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {CreatorNFTFactory} from "../src/CreatorNFTFactory.sol";
import {CreatorNFTCollection} from "../src/CreatorNFTCollection.sol";
import {GemsMarketplace} from "../src/GemsMarketplace.sol";
import {GemsPlatformToken} from "../src/GemsPlatformToken.sol";
import {LPStakingRewards} from "../src/LPStakingRewards.sol";

contract GemsEcosystemTest is Test {
    address internal alice = address(0xA11CE);
    address internal bob = address(0xB0B);
    address internal platform = address(0x70);

    CreatorNFTFactory internal nftFactory;
    GemsMarketplace internal market;
    GemsPlatformToken internal gems;
    LPStakingRewards internal lpFarm;

    function setUp() public {
        vm.prank(alice);
        nftFactory = new CreatorNFTFactory(alice);

        market = new GemsMarketplace(alice, platform, 250);
        gems = new GemsPlatformToken(alice, "Gems Platform", "GEMS", 1_000_000 ether);
        vm.prank(alice);
        gems.mint(alice, 100_000 ether);

        lpFarm = new LPStakingRewards(alice, address(gems), address(gems));
    }

    function test_nftFactory_deploysThreeMax() public {
        vm.startPrank(alice);
        address c0 = nftFactory.deployCollection(0, "Access", "ACC", 100, 0.01 ether, 500);
        nftFactory.deployCollection(1, "Moments", "MOM", 50, 0, 500);
        nftFactory.deployCollection(2, "Perks", "PRK", 25, 0, 500);
        vm.expectRevert();
        nftFactory.deployCollection(0, "Extra", "EXT", 10, 0, 500);
        vm.stopPrank();

        assertEq(nftFactory.collectionCount(alice), 3);
        address[] memory cols = nftFactory.collectionsOf(alice);
        assertEq(cols.length, 3);
        assertEq(cols[0], c0);
        CreatorNFTCollection col = CreatorNFTCollection(c0);
        assertEq(col.collectionKind(), uint8(0));
    }

    function test_marketplace_listBuyRoyaltiesAndFee() public {
        vm.prank(alice);
        address colAddr = nftFactory.deployCollection(0, "Pass", "PASS", 10, 0, 1000);
        CreatorNFTCollection col = CreatorNFTCollection(colAddr);

        vm.prank(alice);
        col.mintTo(bob, "ipfs://1");

        vm.prank(bob);
        col.setApprovalForAll(address(market), true);

        uint256 price = 1 ether;
        vm.prank(bob);
        market.list(colAddr, 1, price);

        (address royaltyReceiver, uint256 royaltyAmt) = col.royaltyInfo(1, price);
        assertEq(royaltyReceiver, alice);
        assertEq(royaltyAmt, price / 10);

        uint256 platformFee = (price * 250) / 10_000;
        uint256 toSeller = price - royaltyAmt - platformFee;

        vm.deal(alice, price);
        vm.prank(alice);
        market.buy{value: price}(colAddr, 1);

        assertEq(col.ownerOf(1), alice);
        assertEq(platform.balance, platformFee);
        assertEq(bob.balance, toSeller);
    }

    function test_lpStaking_notifyAndClaim() public {
        vm.startPrank(alice);
        gems.transfer(bob, 5_000 ether);
        gems.transfer(address(lpFarm), 10_000 ether);
        lpFarm.notifyRewardAmount(7_000 ether);
        vm.stopPrank();

        vm.startPrank(bob);
        gems.approve(address(lpFarm), type(uint256).max);
        lpFarm.stake(1_000 ether);
        vm.warp(block.timestamp + 3.5 days);
        uint256 earned = lpFarm.earned(bob);
        assertGt(earned, 0);
        lpFarm.getReward();
        vm.stopPrank();
        assertGt(gems.balanceOf(bob), 0);
    }
}
