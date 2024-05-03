// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

import "./IFOInitializableV6.sol";

/**
 * @title IFODeployerV6
 */
contract IFODeployerV6 is Ownable {
    using SafeERC20 for IERC20;

    uint256 public constant MAX_BUFFER_BLOCKS = 400000; // 200,000 blocks (6-7 days on BSC)

    event AdminTokenRecovery(address indexed tokenRecovered, uint256 amount);
    event NewIFOContract(address indexed ifoAddress);

    /**
     *  It creates the IFO contract and initializes the contract.
     * @param _lpToken: the LP token used
     * @param _offeringToken: the token that is offered for the IFO
     * @param _startBlock: the start block for the IFO
     * @param _endBlock: the end block for the IFO
     * @param _maxPoolId: maximum id of pools, sometimes only public sale exist
     * @param _adminAddress: the admin address for handling tokens
     * @param _iCakeAddress: iCake smart contract address, which is used to calculate IFO Limit
     */
    function createIFO(
        address _lpToken,
        address _offeringToken,
        uint256 _startBlock,
        uint256 _endBlock,
        uint8 _maxPoolId,
        address _adminAddress,
        address _iCakeAddress
    )
        external
        // uint256 _pointThreshold
        onlyOwner
    {
        require(IERC20(_lpToken).totalSupply() >= 0);
        require(IERC20(_offeringToken).totalSupply() >= 0);
        require(
            _lpToken != _offeringToken,
            "Operations: Tokens must be be different"
        );
        require(
            _endBlock < (block.number + MAX_BUFFER_BLOCKS),
            "Operations: EndBlock too far"
        );
        require(
            _startBlock < _endBlock,
            "Operations: StartBlock must be inferior to endBlock"
        );
        require(
            _startBlock > block.number,
            "Operations: StartBlock must be greater than current block"
        );

        bytes memory bytecode = type(IFOInitializableV6).creationCode;
        bytes32 salt = keccak256(
            abi.encodePacked(_lpToken, _offeringToken, _startBlock)
        );
        address ifoAddress;

        assembly {
            ifoAddress := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }

        require(ifoAddress != address(0));

        IFOInitializableV6(ifoAddress).initialize(
            _lpToken,
            _offeringToken,
            _startBlock,
            _endBlock,
            MAX_BUFFER_BLOCKS,
            _maxPoolId,
            _adminAddress,
            _iCakeAddress
            // _pointThreshold
        );

        emit NewIFOContract(ifoAddress);
    }

    /**
     *  It allows the admin to recover wrong tokens sent to the contract
     * @param _tokenAddress: the address of the token to withdraw
     * @dev This function is only callable by admin.
     */
    function recoverWrongTokens(address _tokenAddress) external onlyOwner {
        uint256 balanceToRecover = IERC20(_tokenAddress).balanceOf(
            address(this)
        );
        require(balanceToRecover > 0, "Operations: Balance must be > 0");
        IERC20(_tokenAddress).safeTransfer(
            address(msg.sender),
            balanceToRecover
        );

        emit AdminTokenRecovery(_tokenAddress, balanceToRecover);
    }
}
