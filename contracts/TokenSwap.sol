// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
pragma abicoder v2;

/**
    @title Unidex token swapper
    @author Jaskaran Singh
    @notice Token Swapper 
    @dev Works on Uniswap V3
*/

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract TokenSwap {
    ISwapRouter public immutable i_swapRouter;
    // address public constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    // address public constant WETH9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    // address public constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    uint24 public immutable i_POOLFEE;
    bool isPaused = false; //false initially
    address immutable i_owner;

    event txMined(uint256 amount, address customer);

    modifier onlyOwner() {
        require(msg.sender == i_owner);
        _;
    }

    constructor(ISwapRouter _swaprouter, uint24 _POOLFEE) {
        i_swapRouter = _swaprouter;
        i_POOLFEE = _POOLFEE; //3000 initially
        i_owner = msg.sender;
    }

    /**
        @notice swapExactInputSingle swaps a fixed amount of token 1 for a maximum possible amount of token 2
        `exactInputSingle` in the swap router.
        @notice msg.sender must approve this contract
        @dev Naively set amountOutMinimum to 0. In production, use an oracle or other data source to choose a safer value for amountOutMinimum.
         We also set the sqrtPriceLimitx96 to be 0 to ensure we swap our exact input amount.
        @dev The calling address must approve this contract to spend at least `amountIn` worth of its token 1 for this function to succeed.
        @param amountIn The exact amount of DAI that will be swapped for WETH9.
        @return amountOut The amount of token 2 received.
    */
    function swapExactInputSingle(
        uint256 amountIn,
        address tokenIn,
        address tokenOut
    ) external payable returns (uint256 amountOut) {
        require(isPaused = false);
        IERC20(tokenIn).approve(address(this), amountIn);
        TransferHelper.safeTransferFrom(
            tokenIn,
            payable(msg.sender),
            address(this),
            amountIn
        );
        TransferHelper.safeApprove(tokenIn, address(i_swapRouter), amountIn);
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: i_POOLFEE,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });
        amountOut = i_swapRouter.exactInputSingle(params); // The call to `exactInputSingle` executes the swap.
        emit txMined(amountIn, msg.sender);
    }

    /**
     * @notice getter function
     * @return pool fees
     */
    function getPoolFee() public view returns (uint256) {
        return i_POOLFEE;
    }

    /**
     * @notice pauses the contract
     * @dev safety function
     * @dev can be called by the owner only
     */
    function pauseContract() public onlyOwner {
        isPaused = true;
    }
}
