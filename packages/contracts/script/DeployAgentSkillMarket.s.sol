// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {AgentSkillMarket} from "../src/AgentSkillMarket.sol";

/// @notice Deploy AgentSkillMarket. Env: PRIVATE_KEY, AGENT_MARKET_FEE_RECIPIENT (optional, defaults deployer), AGENT_MARKET_FEE_BPS (optional, default 250)
contract DeployAgentSkillMarket is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(pk);
        address feeRecipient = vm.envOr("AGENT_MARKET_FEE_RECIPIENT", deployer);
        uint256 feeBps = vm.envOr("AGENT_MARKET_FEE_BPS", uint256(250));

        vm.startBroadcast(pk);
        AgentSkillMarket market = new AgentSkillMarket(deployer, feeRecipient, feeBps);
        console2.log("AgentSkillMarket:", address(market));
        vm.stopBroadcast();
    }
}
