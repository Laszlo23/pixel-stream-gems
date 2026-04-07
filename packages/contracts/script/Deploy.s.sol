// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {CreatorTokenFactory} from "../src/CreatorTokenFactory.sol";
import {CreatorNFTFactory} from "../src/CreatorNFTFactory.sol";
import {GemsMarketplace} from "../src/GemsMarketplace.sol";
import {GemsPlatformToken} from "../src/GemsPlatformToken.sol";
import {CreatorEconomyRegistry} from "../src/CreatorEconomyRegistry.sol";
import {FeeVault} from "../src/FeeVault.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @notice Deploy core Gems protocol. Env: PRIVATE_KEY, FEE_ASSET (optional), PLATFORM, CREATOR, PLATFORM_BPS,
/// DEPLOY_PLATFORM_TOKEN (optional "1"), PLATFORM_TOKEN_CAP (wei), MARKETPLACE_FEE_BPS (optional)
contract Deploy is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(pk);

        vm.startBroadcast(pk);

        CreatorTokenFactory tokenFactory = new CreatorTokenFactory(deployer);
        console2.log("CreatorTokenFactory:", address(tokenFactory));

        CreatorNFTFactory nftFactory = new CreatorNFTFactory(deployer);
        console2.log("CreatorNFTFactory:", address(nftFactory));

        address feeRecipient = vm.envOr("MARKETPLACE_FEE_RECIPIENT", deployer);
        uint256 marketFeeBps = vm.envOr("MARKETPLACE_FEE_BPS", uint256(250));
        GemsMarketplace market = new GemsMarketplace(deployer, feeRecipient, marketFeeBps);
        console2.log("GemsMarketplace:", address(market));

        CreatorEconomyRegistry registry = new CreatorEconomyRegistry();
        console2.log("CreatorEconomyRegistry:", address(registry));

        if (vm.envOr("DEPLOY_PLATFORM_TOKEN", uint256(0)) == 1) {
            uint256 cap = vm.envOr("PLATFORM_TOKEN_CAP", uint256(1_000_000 ether));
            GemsPlatformToken gems = new GemsPlatformToken(deployer, "Gems Platform", "GEMS", cap);
            console2.log("GemsPlatformToken:", address(gems));
        }

        address feeAsset = vm.envOr("FEE_ASSET", address(0));
        if (feeAsset != address(0)) {
            address platform = vm.envAddress("PLATFORM");
            address creator = vm.envAddress("CREATOR");
            uint256 bps = vm.envOr("PLATFORM_BPS", uint256(1000));
            FeeVault vault = new FeeVault(IERC20(feeAsset), deployer, platform, creator, bps);
            console2.log("FeeVault:", address(vault));
        }

        vm.stopBroadcast();
    }
}
