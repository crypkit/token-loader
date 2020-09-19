pragma solidity ^0.7.1;
pragma experimental ABIEncoderV2;

// target contract interface - selection of used ERC20 methods
abstract contract Target {
    function name() public virtual view returns (string memory);

    function symbol() public virtual view returns (string memory);

    function decimals() public virtual view returns (uint8);

    function totalSupply() public virtual view returns (uint256);
}

contract TokenLoader {
    struct TokenInfo {
        string name;
        string symbol;
        uint8 decimals;
        uint256 totalSupply;
    }

    function loadTokens(address[] calldata tokens)
        external
        view
        returns (TokenInfo[] memory tokenInfo)
    {
        tokenInfo = new TokenInfo[](tokens.length);

        for (uint256 i = 0; i < tokens.length; i++) {
            Target target = Target(tokens[i]);
            tokenInfo[i] = TokenInfo(
                target.name(),
                target.symbol(),
                target.decimals(),
                target.totalSupply()
            );
        }

        return tokenInfo;
    }
}
