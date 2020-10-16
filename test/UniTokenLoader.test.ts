import {expect, use} from 'chai';
import {
    AllUsedErc20Methods,
    TokenLoader,
    UniToken,
    UniTokenLoader
} from '../typechain';
import {solidity} from 'ethereum-waffle';
import {ethers} from '@nomiclabs/buidler';

use(solidity);

function respToArr(resp: any): Array<any> {
    return [resp.name, resp.symbol, resp.decimals, resp.totalSupply.toNumber()];
}

describe('TokenLoader', () => {
    let uniTokenLoader: UniTokenLoader;

    beforeEach(async () => {
        const UniTokenLoaderFactory = await ethers.getContractFactory('UniTokenLoader');
        uniTokenLoader = (await UniTokenLoaderFactory.deploy()) as unknown as UniTokenLoader;
    });

    it('Check returned data for a valid Uni-V2 token', async () => {
        const AllUsedErc20MethodsFactory = await ethers.getContractFactory('AllUsedERC20Methods');
        const token0: AllUsedErc20Methods = (await AllUsedErc20MethodsFactory.deploy()) as unknown as AllUsedErc20Methods;
        const token1: AllUsedErc20Methods = (await AllUsedErc20MethodsFactory.deploy()) as unknown as AllUsedErc20Methods;

        const UniTokenFactory = await ethers.getContractFactory('UniToken');
        const uniToken: UniToken = (await UniTokenFactory.deploy(token0.address, token1.address)) as unknown as UniToken;


        const response = await uniTokenLoader.loadTokens(uniToken.address);

        // For arrays we have to use the eql method, equal does not work
        expect(respToArr(response[0])).to.eql(['AllUsedERC20Methods', 'ALLERC20', 18, 1000000000]);
    });

    it('Check handling of non-contract addresses', async () => {
        const response = await uniTokenLoader.loadTokens("0x050554F710c6fAFDBDB390FF653f9FAF25761Ad4");

        // For arrays we have to use the eql method, equal does not work
        expect(respToArr(response[0])).to.eql(['', '', 0, 0]);
        expect(respToArr(response[1])).to.eql(['', '', 0, 0]);
        expect(response.length).to.equal(2);
    });
});
