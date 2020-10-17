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
    return [resp.addr, resp.name, resp.symbol, resp.decimals, resp.totalSupply.toNumber()];
}

describe('TokenLoader', () => {
    let uniTokenLoader: UniTokenLoader;
    const madeUpAddress = "0x050554F710c6fAFDBDB390FF653f9FAF25761Ad4";

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


        const response = await uniTokenLoader.loadTokens([uniToken.address]);

        // For arrays we have to use the eql method, equal does not work
        expect(respToArr(response[0])).to.eql([token0.address, 'AllUsedERC20Methods', 'ALLERC20', 18, 1000000000]);
    });

    it('Check handling of non-contract addresses', async () => {
        const response = await uniTokenLoader.loadTokens([madeUpAddress]);

        // For arrays we have to use the eql method, equal does not work
        expect(respToArr(response[0])).to.eql(['0x0000000000000000000000000000000000000000', '', '', 0, 0]);
        expect(respToArr(response[1])).to.eql(['0x0000000000000000000000000000000000000000', '', '', 0, 0]);
        expect(response.length).to.equal(2);
    });

    it('Check returned data for a combination of valid Uni-V2 token, made up address and non-Uni ERC20', async () => {
        const AllUsedErc20MethodsFactory = await ethers.getContractFactory('AllUsedERC20Methods');
        const token0: AllUsedErc20Methods = (await AllUsedErc20MethodsFactory.deploy()) as unknown as AllUsedErc20Methods;
        const token1: AllUsedErc20Methods = (await AllUsedErc20MethodsFactory.deploy()) as unknown as AllUsedErc20Methods;

        const UniTokenFactory = await ethers.getContractFactory('UniToken');
        const uniToken: UniToken = (await UniTokenFactory.deploy(token0.address, token1.address)) as unknown as UniToken;


        const response = await uniTokenLoader.loadTokens([uniToken.address, madeUpAddress, token0.address]);

        // For arrays we have to use the eql method, equal does not work
        expect(respToArr(response[0])).to.eql([token0.address, 'AllUsedERC20Methods', 'ALLERC20', 18, 1000000000]);
        expect(respToArr(response[1])).to.eql([token1.address, 'AllUsedERC20Methods', 'ALLERC20', 18, 1000000000]);
        expect(respToArr(response[2])).to.eql(['0x0000000000000000000000000000000000000000', '', '', 0, 0]);
        expect(respToArr(response[3])).to.eql(['0x0000000000000000000000000000000000000000', '', '', 0, 0]);
        expect(respToArr(response[4])).to.eql(['0x0000000000000000000000000000000000000000', '', '', 0, 0]);
        expect(respToArr(response[5])).to.eql(['0x0000000000000000000000000000000000000000', '', '', 0, 0]);
        expect(response.length).to.equal(6);
    });
});
