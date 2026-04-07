// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {CreatorToken} from "../src/CreatorToken.sol";

contract CreatorTokenTest is Test {
    address internal alice = address(0xA11CE);
    address internal bob = address(0xB0B);

    CreatorToken internal token;

    function setUp() public {
        vm.prank(alice);
        token = new CreatorToken("Creator Coin", "CR8", alice, 500 ether);
    }

    function test_ownerCanMint() public {
        vm.prank(alice);
        token.mint(bob, 100 ether);
        assertEq(token.balanceOf(bob), 100 ether);
    }

    function test_nonOwnerCannotMint() public {
        vm.prank(bob);
        vm.expectRevert();
        token.mint(bob, 1 ether);
    }
}
