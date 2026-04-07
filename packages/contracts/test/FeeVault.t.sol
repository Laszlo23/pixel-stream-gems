// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {FeeVault} from "../src/FeeVault.sol";
import {GemsPlatformToken} from "../src/GemsPlatformToken.sol";

contract FeeVaultTest is Test {
    address internal owner = address(0xA11CE);
    address internal platform = address(0x70);
    address internal creator = address(0xC0);
    address internal bob = address(0xB0B);

    GemsPlatformToken internal token;
    FeeVault internal vault;

    function setUp() public {
        vm.prank(owner);
        token = new GemsPlatformToken(owner, "Fee Asset", "FEE", 1_000_000 ether);
        vault = new FeeVault(IERC20(address(token)), owner, platform, creator, 1_000);

        vm.prank(owner);
        token.mint(bob, 10_000 ether);
    }

    function test_deposit_splitsBpsAndClaims() public {
        uint256 amount = 1_000 ether;
        uint256 toPlatform = (amount * 1_000) / 10_000;
        uint256 toCreator = amount - toPlatform;

        vm.startPrank(bob);
        token.approve(address(vault), amount);
        vault.deposit(amount);
        vm.stopPrank();

        assertEq(vault.platformAccrued(), toPlatform);
        assertEq(vault.creatorAccrued(), toCreator);

        vault.claimPlatform();
        vault.claimCreator();

        assertEq(token.balanceOf(platform), toPlatform);
        assertEq(token.balanceOf(creator), toCreator);
        assertEq(vault.platformAccrued(), 0);
        assertEq(vault.creatorAccrued(), 0);
    }
}
