// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.20;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

import "./IFixedSwap.sol";

contract Base is OwnableUpgradeable, ReentrancyGuardUpgradeable, IFixedSwap, EIP712 {
    using ECDSA for bytes32;

    uint256 public constant TX_FEE_DENOMINATOR = 1e18;

    uint256 public txFeeRatio;
    address public adminWallet;
    address public signer;
    // pool index => whitelist merkle root
    mapping(uint256 => bytes32) public whitelistRootP;
    // address => pool message => pool message used or not
    mapping(address => mapping(bytes32 => bool)) public poolMessages;
    // pool index => if is auction holder enabled
    mapping(uint256 => bool) public auctionHolders;
    // minimum amount of AUCTION to hold
    uint256 public minimumAuction;
    // AUCTION token address
    address public auctionToken;
    // backend id
    mapping(uint256 => bool) public ids;

    // pool index => release type
    mapping(uint256 => ReleaseType) public releaseTypes;
    // pool index => release data
    mapping(uint256 => ReleaseData[]) public releaseDataList;
    // address => pool index => released amount
    mapping(address => mapping(uint256 => uint256)) public myReleased;

    event ReleaseDataSet(uint256 indexed index, ReleaseType releaseType, ReleaseData[] releaseDataList);

    constructor() EIP712("WarpGateBase", "1.0.0") {}

    function computeReleasableAmount(uint256 index, uint256 myTotalRelease) public view returns (uint256) {
        ReleaseData[] memory _releaseDataList = releaseDataList[index];
        if (_releaseDataList.length == 0 || block.timestamp < _releaseDataList[0].startAt) {
            return 0;
        }

        ReleaseType releaseType = releaseTypes[index];
        uint256 releasedAmount = 0;
        if (releaseType == ReleaseType.Cliff) {
            if (_releaseDataList[0].startAt <= block.timestamp) {
                releasedAmount = myTotalRelease;
            }
        } else if (releaseType == ReleaseType.Linear) {
            ReleaseData memory releaseTime = _releaseDataList[0];
            uint256 elapsedTime = 0;
            if (block.timestamp < releaseTime.endAtOrRatio) {
                elapsedTime = block.timestamp - releaseTime.startAt;
            } else {
                elapsedTime = uint256(releaseTime.endAtOrRatio) - releaseTime.startAt;
            }
            uint256 totalTime = uint256(releaseTime.endAtOrRatio) - releaseTime.startAt;
            releasedAmount = (myTotalRelease * elapsedTime) / totalTime;
        } else if (releaseType == ReleaseType.Fragment) {
            uint256 ratio = 0;
            for (uint256 i = 0; i < _releaseDataList.length; i++) {
                if (_releaseDataList[i].startAt <= block.timestamp) {
                    ratio = ratio + _releaseDataList[i].endAtOrRatio;
                }
            }
            releasedAmount = (myTotalRelease * ratio) / 1e18;
        }

        return releasedAmount;
    }

    function setReleaseData(
        uint256 index,
        uint48 claimAt,
        ReleaseType releaseType,
        ReleaseData[] memory releaseData
    ) internal {
        if (releaseType == ReleaseType.Instant) {
            require(claimAt == 0, "invalid claimAt");
            require(releaseData.length == 0, "Invalid releaseData length");
        } else if (releaseType == ReleaseType.Linear || releaseType == ReleaseType.Cliff) {
            require(claimAt != 0, "invalid claimAt");
            require(releaseData.length == 1, "Invalid releaseData length");
            require(claimAt == releaseData[0].startAt, "Require: claimAt == releaseStartAt");
            if (releaseType == ReleaseType.Linear) {
                require(releaseData[0].startAt < releaseData[0].endAtOrRatio, "Require: startAt < endAtOrRatio");
            }
        } else if (releaseType == ReleaseType.Fragment) {
            require(claimAt != 0, "invalid claimAt");
            require(releaseData.length >= 1, "Invalid releaseData length");
            require(claimAt == releaseData[0].startAt, "Require: claimAt == releaseStartAt");
            for (uint256 i = 1; i < releaseData.length; i++) {
                require(claimAt <= releaseData[i].startAt, "Require: claimAt <= releaseStartAt");
            }
            uint256 ratio = 0;
            for (uint256 i = 0; i < releaseData.length; i++) {
                ratio = ratio + releaseData[i].endAtOrRatio;
            }
            require(ratio == 1e18, "Total ratio must equal to 1e18");
        }

        releaseTypes[index] = releaseType;
        for (uint256 i = 0; i < releaseData.length; i++) {
            releaseDataList[index].push(releaseData[i]);
        }

        emit ReleaseDataSet(index, releaseType, releaseData);
    }

    function checkAuctionHolder(uint256 index, address target) internal view {
        if (auctionHolders[index]) {
            require(IERC20(auctionToken).balanceOf(target) >= minimumAuction, "Not auction holder");
        }
    }

    function setAuctionHolder(address _auctionToken, uint256 _minimumAuction) external onlyOwner {
        require(_auctionToken != address(0), "Invalid auction token");
        auctionToken = _auctionToken;
        minimumAuction = _minimumAuction;
    }

    function getReleaseDataListLength(uint256 index) external view returns (uint256) {
        return releaseDataList[index].length;
    }

    // solhint-disable-next-line func-name-mixedcase
    function __BounceBase_init(uint256 _txFeeRatio, address _adminWallet, address _signer) internal onlyInitializing {
        super.__Ownable_init(msg.sender);
        super.__ReentrancyGuard_init();

        _setTxFeeRatio(_txFeeRatio);
        _setAdminWallet(_adminWallet);
        _setSigner(_signer);
    }

    function transferAndCheck(address token0, address from, uint256 amount) internal {
        IERC20 _token0 = IERC20(token0);
        uint256 token0BalanceBefore = _token0.balanceOf(address(this));
        _token0.transferFrom(from, address(this), amount);
        require(_token0.balanceOf(address(this)) - token0BalanceBefore == amount, "not support deflationary token");
    }

    function checkWhitelist(uint256 index, bytes32 leaf, bytes32[] memory proof) internal view {
        if (whitelistRootP[index] != bytes32(0)) {
            require(MerkleProof.verify(proof, whitelistRootP[index], leaf), "not whitelisted");
        }
    }

    function checkUser(bytes32 hash, uint256 expireAt, bytes memory signature) internal view {
        _verifySignature(hash, expireAt, signature);
    }

    function checkCreator(bytes32 hash, uint256 expireAt, bytes memory signature) internal {
        bytes32 message = _verifySignature(hash, expireAt, signature);
        require(!poolMessages[msg.sender][message], "pool message used");
        poolMessages[msg.sender][message] = true;
    }

    function _verifySignature(bytes32 hash, uint256 expireAt, bytes memory signature) private view returns (bytes32) {
        require(block.timestamp < expireAt, "signature expired");
        bytes32 message = keccak256(abi.encode(msg.sender, hash, block.chainid, expireAt));
        bytes32 hash = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    keccak256("Signature(address _account,bytes32 _hash,uint256 _chainId,uint256 _expireAt)"),
                    msg.sender,
                    hash,
                    block.chainid,
                    expireAt
                )
            )
        );
        //check if signer is equal to the signer
        require(SignatureChecker.isValidSignatureNow(signer, message, signature), "invalid signature");
        return message;
    }

    function setTxFeeRatio(uint256 _txFeeRatio) external onlyOwner {
        _setTxFeeRatio(_txFeeRatio);
    }

    function setadminWallet(address _adminWallet) external onlyOwner {
        _setAdminWallet(_adminWallet);
    }

    function setSigner(address _signer) external onlyOwner {
        _setSigner(_signer);
    }

    function _setTxFeeRatio(uint256 _txFeeRatio) private {
        require(_txFeeRatio <= TX_FEE_DENOMINATOR, "invalid txFeeRatio");
        txFeeRatio = _txFeeRatio;
    }

    function _setAdminWallet(address _adminWallet) private {
        require(_adminWallet != address(0), "invalid adminWallet");
        adminWallet = _adminWallet;
    }

    function _setSigner(address _signer) private {
        require(_signer != address(0), "invalid signer");
        signer = _signer;
    }

    uint256[38] private __gap;
}
