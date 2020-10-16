import {expect, use} from 'chai';
import {
    TokenLoader,
    AllUsedErc20Methods,
    AllUsedErc721Methods,
    IncompleteErc20,
    IncompleteErc721,
    OtherErc165
} from '../typechain';
import {solidity} from 'ethereum-waffle';
import {ethers} from '@nomiclabs/buidler';

use(solidity);

function respToArr(resp: any): Array<any> {
    return [resp.definitelyIsERC721, resp.name, resp.symbol, resp.decimals, resp.totalSupply.toNumber()];
}

describe('TokenLoader', () => {
    let tokenLoader: TokenLoader;

    beforeEach(async () => {
        const TokenLoaderFactory = await ethers.getContractFactory('TokenLoader');
        tokenLoader = (await TokenLoaderFactory.deploy()) as unknown as TokenLoader;
    });

    it('Check returned data for ERC20', async () => {
        const AllUsedErc20MethodsFactory = await ethers.getContractFactory('AllUsedERC20Methods');
        const allUsedErc20Methods: AllUsedErc20Methods = (await AllUsedErc20MethodsFactory.deploy()) as unknown as AllUsedErc20Methods;

        const response = await tokenLoader.loadTokens([allUsedErc20Methods.address]);

        // For arrays we have to use the eql method, equal does not work
        expect(respToArr(response[0])).to.eql([false, 'AllUsedERC20Methods', 'ALLERC20', 18, 1000000000]);
    });

    it('Check returned data for ERC721', async () => {
        const AllUsedErc721MethodsFactory = await ethers.getContractFactory('AllUsedERC721Methods');
        const allUsedErc721Methods: AllUsedErc721Methods = (await AllUsedErc721MethodsFactory.deploy()) as unknown as AllUsedErc721Methods;

        const response = await tokenLoader.loadTokens([allUsedErc721Methods.address]);

        // For arrays we have to use the eql method, equal does not work
        expect(respToArr(response[0])).to.eql([true, 'AllUsedERC721Methods', 'ALLERC721', 0, 1000000000]);
    });

    it('Check returned data for incomplete ERC20', async () => {
        const IncompleteERC20Factory = await ethers.getContractFactory('IncompleteERC20');
        const incompleteERC20: IncompleteErc20 = (await IncompleteERC20Factory.deploy()) as unknown as IncompleteErc20;

        const response = await tokenLoader.loadTokens([incompleteERC20.address]);

        // For arrays we have to use the eql method, equal does not work
        expect(respToArr(response[0])).to.eql([false, '', 'INCERC20', 0, 1000000000]);
    });

    it('Check returned data for incomplete ERC721', async () => {
        const IncompleteERC721Factory = await ethers.getContractFactory('IncompleteERC721');
        const incompleteERC721: IncompleteErc721 = (await IncompleteERC721Factory.deploy()) as unknown as IncompleteErc721;

        const response = await tokenLoader.loadTokens([incompleteERC721.address]);

        // For arrays we have to use the eql method, equal does not work
        expect(respToArr(response[0])).to.eql([true, 'IncompleteERC721', '', 0, 0]);
    });

    it('Check returned data for non-ERC721 contract supporting ERC165', async () => {
        const OtherErc165Factory = await ethers.getContractFactory('OtherERC165');
        const otherErc165: OtherErc165 = (await OtherErc165Factory.deploy()) as unknown as OtherErc165;

        const response = await tokenLoader.loadTokens([otherErc165.address]);

        // For arrays we have to use the eql method, equal does not work
        expect(respToArr(response[0])).to.eql([false, '', '', 0, 0]);
    });

    it('Check for correct response length', async () => {
        const OtherErc165Factory = await ethers.getContractFactory('OtherERC165');
        const otherErc165: OtherErc165 = (await OtherErc165Factory.deploy()) as unknown as OtherErc165;

        const response = await tokenLoader.loadTokens([otherErc165.address]);

        expect(response.length).to.equal(1);
    });

    it('Check loading multiple contracts at once', async () => {
        const IncompleteERC20Factory = await ethers.getContractFactory('IncompleteERC20');
        const incompleteERC20: IncompleteErc20 = (await IncompleteERC20Factory.deploy()) as unknown as IncompleteErc20;

        const IncompleteERC721Factory = await ethers.getContractFactory('IncompleteERC721');
        const incompleteERC721: IncompleteErc721 = (await IncompleteERC721Factory.deploy()) as unknown as IncompleteErc721;

        const response = await tokenLoader.loadTokens([incompleteERC20.address, incompleteERC721.address, incompleteERC20.address]);

        expect(response.length).to.equal(3);
        expect(respToArr(response[0])).to.eql([false, '', 'INCERC20', 0, 1000000000]);
        expect(respToArr(response[1])).to.eql([true, 'IncompleteERC721', '', 0, 0]);
        expect(respToArr(response[2])).to.eql([false, '', 'INCERC20', 0, 1000000000]);
    });

    it('Check handling of non-contract addresses', async () => {
        const response = await tokenLoader.loadTokens(["0x050554F710c6fAFDBDB390FF653f9FAF25761Ad4"]);

        // For arrays we have to use the eql method, equal does not work
        expect(respToArr(response[0])).to.eql([false, '', '', 0, 0]);
    });
});
