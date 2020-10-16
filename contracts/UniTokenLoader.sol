// SPDX-License-Identifier: ISC

pragma solidity ^0.7.3;
pragma experimental ABIEncoderV2;

abstract contract UniTarget {
    function symbol() public virtual view returns (string memory);

    function token0() public virtual view returns (address);

    function token1() public virtual view returns (address);
}

// target contract interface - selection of used ERC20
abstract contract Target {
    function name() public virtual view returns (string memory);

    function symbol() public virtual view returns (string memory);

    function decimals() public virtual view returns (uint8);

    function totalSupply() public virtual view returns (uint256);
}

contract UniTokenLoader {

    struct TokenInfo {
        string name;
        string symbol;
        uint8 decimals;
        uint256 totalSupply;
    }

    function loadTokens(address token) external view returns (TokenInfo[] memory tokenInfo) {
        tokenInfo = new TokenInfo[](2);
        UniTarget uniToken = UniTarget(token);

        (bool success, bytes memory returnData) = token.staticcall(abi.encodeWithSelector(uniToken.symbol.selector));

        string memory expectedSymbol = "UNI-V2";

        if (success && keccak256(returnData) == keccak256(bytes(expectedSymbol))) {
            Target token0 = Target(uniToken.token0());
            Target token1 = Target(uniToken.token1());

            tokenInfo[0] = TokenInfo(token0.name(), token0.symbol(), token0.decimals(), token0.totalSupply());
            tokenInfo[1] = TokenInfo(token1.name(), token1.symbol(), token1.decimals(), token1.totalSupply());
        }

        return tokenInfo;
    }


}
