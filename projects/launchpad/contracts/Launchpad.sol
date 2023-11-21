// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./FixedSwap.sol";
import "./IFixedSwap.sol";

contract Launchpad is IFixedSwap {
    uint256 saleId;

    event LaunchpadLaunched(uint256 saleId);

    address public fixedSwapContract;

    function launchFixedSwap(
        CreateReq memory poolReq,
        ReleaseType releaseType,
        ReleaseData[] memory releaseData,
        bool enableAuctionHolder,
        bool enableReverse,
        uint256 expireAt,
        bytes memory signature
    ) external returns (uint256) {
        FixedSwap(fixedSwapContract).createV2(
            saleId,
            poolReq,
            releaseType,
            releaseData,
            enableAuctionHolder,
            enableReverse,
            expireAt,
            signature
        );
        saleId++;

        emit LaunchpadLaunched(saleId);
        return saleId;
    }
}
