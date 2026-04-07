// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @notice Optional platform reward / governance token with a fixed supply cap.
contract GemsPlatformToken is ERC20, ERC20Permit, Ownable {
    uint256 public immutable cap;

    error GemsPlatformTokenCapExceeded(uint256 cap, uint256 requestedTotal);

    constructor(address initialOwner, string memory name_, string memory symbol_, uint256 cap_)
        ERC20(name_, symbol_)
        ERC20Permit(name_)
        Ownable(initialOwner)
    {
        require(cap_ > 0, "GEMS: cap");
        cap = cap_;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        if (totalSupply() + amount > cap) {
            revert GemsPlatformTokenCapExceeded(cap, totalSupply() + amount);
        }
        _mint(to, amount);
    }
}
