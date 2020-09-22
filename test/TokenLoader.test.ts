import {expect, use} from 'chai';
import {TokenLoader} from '../typechain/TokenLoader';
import {AllUsedErc721Methods} from '../typechain/AllUsedErc721Methods';
import {solidity} from 'ethereum-waffle';
import {ethers} from "@nomiclabs/buidler";

use(solidity);

describe('TokenLoader', () => {
    let tokenLoader: TokenLoader;

    it('Check returned data for ERC721', async () => {
        const TokenLoaderFactory = await ethers.getContractFactory('TokenLoader');
        tokenLoader = await TokenLoaderFactory.deploy() as TokenLoader;

        const AllUsedErc721MethodsFactory = await ethers.getContractFactory('AllUsedERC721Methods');
        const allUsedErc721Methods: AllUsedErc721Methods = await AllUsedErc721MethodsFactory.deploy() as AllUsedErc721Methods;

        const response = await tokenLoader.loadTokens([allUsedErc721Methods.address])
        const responseArray = [response[0].tokenType, response[0].name, response[0].symbol, response[0].decimals, response[0].totalSupply.toNumber()]

        // For arrays we have to use the eql method, equal does not work
        expect(responseArray).to.eql([1, 'AllUsedERC721Methods', 'ALLERC721', 0, 1000000000]);
    });
});
