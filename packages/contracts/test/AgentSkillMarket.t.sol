// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {AgentSkillMarket} from "../src/AgentSkillMarket.sol";

contract AgentSkillMarketTest is Test {
    AgentSkillMarket public market;
    address public owner = address(this);
    address public platform = address(0xBEEF);
    address public agentOwner = address(0xA11CE);
    address public agentPayout = address(0xB0B);
    address public buyer = address(0xC0FFEE);

    uint256 constant AGENT_ID = 1;
    uint256 constant SKILL_ID = 10;
    uint256 constant PRICE = 1 ether;
    uint256 constant FEE_BPS = 250;

    function setUp() public {
        market = new AgentSkillMarket(owner, platform, FEE_BPS);
        market.registerAgent(AGENT_ID, agentOwner, agentPayout);
        vm.prank(agentOwner);
        market.setSkill(AGENT_ID, SKILL_ID, PRICE, true);
    }

    function testBuySkill_splitsFee() public {
        uint256 pf = (PRICE * FEE_BPS) / 10_000;
        uint256 toAgent = PRICE - pf;

        vm.deal(buyer, PRICE);
        vm.prank(buyer);
        market.buySkill{value: PRICE}(AGENT_ID, SKILL_ID);

        assertEq(platform.balance, pf);
        assertEq(agentPayout.balance, toAgent);
        assertEq(market.purchases(buyer, AGENT_ID, SKILL_ID), 1);
    }

    function testBuySkill_revertWrongValue() public {
        vm.deal(buyer, PRICE);
        vm.prank(buyer);
        vm.expectRevert(bytes("ASM: value"));
        market.buySkill{value: PRICE - 1}(AGENT_ID, SKILL_ID);
    }
}
