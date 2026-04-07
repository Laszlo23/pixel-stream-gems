// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {CreatorTokenFactory} from "../src/CreatorTokenFactory.sol";
import {CreatorToken} from "../src/CreatorToken.sol";

contract CreatorTokenFactoryTest is Test {
    CreatorTokenFactory internal factory;
    address internal alice = address(0xA11CE);

    function setUp() public {
        vm.prank(alice);
        factory = new CreatorTokenFactory(alice);
    }

    function test_deployCreatorToken_mintsToCaller() public {
        vm.prank(alice);
        address tokenAddr = factory.deployCreatorToken("Test Token", "TST", 1_000 ether);
        CreatorToken token = CreatorToken(tokenAddr);
        assertEq(token.balanceOf(alice), 1_000 ether);
        assertEq(token.owner(), alice);
    }
}
