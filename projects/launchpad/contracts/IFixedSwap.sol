pragma solidity 0.8.20;

interface IFixedSwap {
    enum ReleaseType {
        Instant, // 0
        Cliff, // 1
        Linear, // 2
        Fragment // 3
    }

    enum PoolType {
        FixedSwap, // 0
        DutchAuction, // 1
        SealedBid, // 2
        Random, // 3
        FixedSwapNFT, // 4
        EnglishAuctionNFT, // 5
        RandomNFT, // 6
        EnglishAuction, // 7
        MutantEnglishAuctionNFT // 8
    }

    struct CreateReq {
        // pool name
        string name;
        // address of sell token
        address token0;
        // address of buy token
        address token1;
        // total amount of token0
        uint256 amountTotal0;
        // total amount of token1
        uint256 amountTotal1;
        // the timestamp in seconds the pool will open
        uint48 openAt;
        // the timestamp in seconds the pool will be closed
        uint48 closeAt;
        // the delay timestamp in seconds when buyers can claim after pool filled
        uint48 claimAt;
        uint256 maxAmount1PerWallet;
        // whitelist merkle root
        bytes32 whitelistRoot;
    }

    struct Pool {
        // creator of the pool
        address creator;
        // address of sell token
        address token0;
        // address of buy token
        address token1;
        // total amount of token0
        uint256 amountTotal0;
        // total amount of token1
        uint256 amountTotal1;
        // the timestamp in seconds the pool will open
        uint48 openAt;
        // the timestamp in seconds the pool will be closed
        uint48 closeAt;
        // the delay timestamp in seconds when buyers can claim after pool filled
        uint48 claimAt;
    }

    struct ReleaseData {
        uint64 startAt;
        // entAt in timestamp or ratio in 1e18
        uint64 endAtOrRatio;
    }
}
