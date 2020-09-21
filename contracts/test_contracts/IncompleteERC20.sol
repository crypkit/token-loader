pragma solidity ^0.7.1;

contract IncompleteERC20 {
    function symbol() public pure returns (string memory) {
        return 'INCERC20';
    }

    function totalSupply() public pure returns (uint256) {
        return 10**9;
    }
}
