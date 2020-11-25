import { ethers } from 'hardhat';
import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { TokenLoader } from '../typechain/TokenLoader';
import { AllUsedERC20Methods } from '../typechain/AllUsedERC20Methods';
import { AllUsedERC721Methods } from '../typechain/AllUsedERC721Methods';
import { IncompleteERC20 } from '../typechain/IncompleteERC20';
import { IncompleteERC721 } from '../typechain/IncompleteERC721';
import { OtherERC165 } from '../typechain/OtherERC165';

chai.use(solidity);
const { expect } = chai;

function respToArr(resp: any): Array<any> {
    return [resp.addr, resp.definitelyIsERC721, resp.name, resp.symbol, resp.decimals, resp.totalSupply.toNumber()];
}

describe('TokenLoader', () => {
    let tokenLoader: TokenLoader;

    beforeEach(async () => {
        const TokenLoaderFactory = await ethers.getContractFactory('TokenLoader');
        tokenLoader = (await TokenLoaderFactory.deploy()) as TokenLoader;
    });

    it('Check returned data for ERC20', async () => {
        const AllUsedERC20MethodsFactory = await ethers.getContractFactory('AllUsedERC20Methods');
        const allUsedERC20Methods: AllUsedERC20Methods = (await AllUsedERC20MethodsFactory.deploy()) as AllUsedERC20Methods;

        const response = await tokenLoader.loadTokens([allUsedERC20Methods.address]);

        // For arrays we have to use the eql method, equal does not work
        expect(respToArr(response[0])).to.eql([allUsedERC20Methods.address, false, 'AllUsedERC20Methods', 'ALLERC20', 18, 1000000000]);
    });

    it('Check returned data for ERC721', async () => {
        const AllUsedERC721MethodsFactory = await ethers.getContractFactory('AllUsedERC721Methods');
        const allUsedERC721Methods: AllUsedERC721Methods = (await AllUsedERC721MethodsFactory.deploy()) as AllUsedERC721Methods;

        const response = await tokenLoader.loadTokens([allUsedERC721Methods.address]);

        // For arrays we have to use the eql method, equal does not work
        expect(respToArr(response[0])).to.eql([allUsedERC721Methods.address, true, 'AllUsedERC721Methods', 'ALLERC721', 0, 1000000000]);
    });

    it('Check returned data for incomplete ERC20', async () => {
        const IncompleteERC20Factory = await ethers.getContractFactory('IncompleteERC20');
        const incompleteERC20: IncompleteERC20 = (await IncompleteERC20Factory.deploy()) as IncompleteERC20;

        const response = await tokenLoader.loadTokens([incompleteERC20.address]);

        // For arrays we have to use the eql method, equal does not work
        expect(respToArr(response[0])).to.eql([incompleteERC20.address, false, '', 'INCERC20', 0, 1000000000]);
    });

    it('Check returned data for incomplete ERC721', async () => {
        const IncompleteERC721Factory = await ethers.getContractFactory('IncompleteERC721');
        const incompleteERC721: IncompleteERC721 = (await IncompleteERC721Factory.deploy()) as IncompleteERC721;

        const response = await tokenLoader.loadTokens([incompleteERC721.address]);

        // For arrays we have to use the eql method, equal does not work
        expect(respToArr(response[0])).to.eql([incompleteERC721.address, true, 'IncompleteERC721', '', 0, 0]);
    });

    it('Check returned data for non-ERC721 contract supporting ERC165', async () => {
        const OtherERC165Factory = await ethers.getContractFactory('OtherERC165');
        const otherERC165: OtherERC165 = (await OtherERC165Factory.deploy()) as OtherERC165;

        const response = await tokenLoader.loadTokens([otherERC165.address]);

        // For arrays we have to use the eql method, equal does not work
        expect(respToArr(response[0])).to.eql([otherERC165.address, false, '', '', 0, 0]);
    });

    it('Check for correct response length', async () => {
        const OtherERC165Factory = await ethers.getContractFactory('OtherERC165');
        const otherERC165: OtherERC165 = (await OtherERC165Factory.deploy()) as OtherERC165;

        const response = await tokenLoader.loadTokens([otherERC165.address]);

        expect(response.length).to.equal(1);
    });

    it('Check loading multiple contracts at once', async () => {
        const IncompleteERC20Factory = await ethers.getContractFactory('IncompleteERC20');
        const incompleteERC20: IncompleteERC20 = (await IncompleteERC20Factory.deploy()) as IncompleteERC20;

        const IncompleteERC721Factory = await ethers.getContractFactory('IncompleteERC721');
        const incompleteERC721: IncompleteERC721 = (await IncompleteERC721Factory.deploy()) as IncompleteERC721;

        const response = await tokenLoader.loadTokens([incompleteERC20.address, incompleteERC721.address, incompleteERC20.address]);

        expect(response.length).to.equal(3);
        expect(respToArr(response[0])).to.eql([incompleteERC20.address, false, '', 'INCERC20', 0, 1000000000]);
        expect(respToArr(response[1])).to.eql([incompleteERC721.address, true, 'IncompleteERC721', '', 0, 0]);
        expect(respToArr(response[2])).to.eql([incompleteERC20.address, false, '', 'INCERC20', 0, 1000000000]);
    });

    it('Check handling of non-contract addresses', async () => {
        const response = await tokenLoader.loadTokens(['0x050554F710c6fAFDBDB390FF653f9FAF25761Ad4']);

        // For arrays we have to use the eql method, equal does not work
        expect(respToArr(response[0])).to.eql(['0x0000000000000000000000000000000000000000', false, '', '', 0, 0]);
    });
});
