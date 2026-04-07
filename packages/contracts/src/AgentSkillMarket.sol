// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title AgentSkillMarket
/// @notice ETH purchases for agent "skills" — platform fee on gross, remainder to agent payout. Purchase counts are on-chain for off-chain API / credits.
contract AgentSkillMarket is Ownable, ReentrancyGuard {
    struct Agent {
        address owner;
        address payout;
        bool active;
    }

    struct Skill {
        uint256 priceWei;
        bool active;
    }

    address public feeRecipient;
    uint256 public platformFeeBps;

    mapping(uint256 agentId => Agent) public agents;
    mapping(uint256 agentId => mapping(uint256 skillId => Skill)) public skills;
    mapping(address buyer => mapping(uint256 agentId => mapping(uint256 skillId => uint256))) public purchases;

    event AgentRegistered(uint256 indexed agentId, address indexed owner, address payout);
    event AgentPayoutUpdated(uint256 indexed agentId, address payout);
    event SkillUpdated(uint256 indexed agentId, uint256 indexed skillId, uint256 priceWei, bool active);
    event SkillPurchased(
        address indexed buyer, uint256 indexed agentId, uint256 indexed skillId, uint256 grossWei, uint256 platformWei, uint256 agentWei
    );

    constructor(address initialOwner, address feeRecipient_, uint256 platformFeeBps_) Ownable(initialOwner) {
        require(platformFeeBps_ <= 2000, "ASM: fee");
        feeRecipient = feeRecipient_;
        platformFeeBps = platformFeeBps_;
    }

    function setFeeRecipient(address r) external onlyOwner {
        feeRecipient = r;
    }

    function setPlatformFeeBps(uint256 bps) external onlyOwner {
        require(bps <= 2000, "ASM: fee");
        platformFeeBps = bps;
    }

    /// @param agentId Opaque id aligned with off-chain agent registry / NFT
    function registerAgent(uint256 agentId, address agentOwner, address payout) external onlyOwner {
        require(agentOwner != address(0) && payout != address(0), "ASM: zero");
        require(!agents[agentId].active, "ASM: exists");
        agents[agentId] = Agent({owner: agentOwner, payout: payout, active: true});
        emit AgentRegistered(agentId, agentOwner, payout);
    }

    function setAgentPayout(uint256 agentId, address payout) external {
        Agent storage a = agents[agentId];
        require(a.active && msg.sender == a.owner, "ASM: not owner");
        require(payout != address(0), "ASM: zero");
        a.payout = payout;
        emit AgentPayoutUpdated(agentId, payout);
    }

    function setSkill(uint256 agentId, uint256 skillId, uint256 priceWei, bool active_) external {
        Agent storage a = agents[agentId];
        require(a.active && msg.sender == a.owner, "ASM: not owner");
        skills[agentId][skillId] = Skill({priceWei: priceWei, active: active_});
        emit SkillUpdated(agentId, skillId, priceWei, active_);
    }

    function buySkill(uint256 agentId, uint256 skillId) external payable nonReentrant {
        Agent memory a = agents[agentId];
        require(a.active, "ASM: no agent");
        Skill memory s = skills[agentId][skillId];
        require(s.active && s.priceWei > 0, "ASM: no skill");
        require(msg.value == s.priceWei, "ASM: value");

        uint256 pf = (msg.value * platformFeeBps) / 10_000;
        uint256 toAgent = msg.value - pf;

        if (pf > 0 && feeRecipient != address(0)) {
            (bool ok,) = payable(feeRecipient).call{value: pf}("");
            require(ok, "ASM: platform pay");
        }
        if (toAgent > 0) {
            (bool ok2,) = payable(a.payout).call{value: toAgent}("");
            require(ok2, "ASM: agent pay");
        }

        purchases[msg.sender][agentId][skillId] += 1;
        emit SkillPurchased(msg.sender, agentId, skillId, msg.value, pf, toAgent);
    }
}
