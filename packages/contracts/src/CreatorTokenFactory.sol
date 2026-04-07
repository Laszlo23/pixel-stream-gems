// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {CreatorToken} from "./CreatorToken.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @notice Deploys {CreatorToken} instances; caller becomes token owner and receives initial supply.
contract CreatorTokenFactory is Ownable {
    event CreatorTokenDeployed(address indexed creator, address indexed token, string name, string symbol);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function deployCreatorToken(string calldata name_, string calldata symbol_, uint256 initialSupply)
        external
        returns (address token)
    {
        CreatorToken t = new CreatorToken(name_, symbol_, msg.sender, initialSupply);
        token = address(t);
        emit CreatorTokenDeployed(msg.sender, token, name_, symbol_);
    }
}
