pragma solidity ^0.7.1;

contract OtherERC165 {
    function supportsInterface(bytes4 interfaceID)
        external
        pure
        returns (bool)
    {
        return false;
    }
}
