import { expect, use } from 'chai';
import { TokenLoader } from '../typechain/TokenLoader';
import { AllUsedErc721Methods } from '../typechain/AllUsedErc721Methods';
import { solidity, deployContract, MockProvider } from 'ethereum-waffle';
import TokenLoaderArtifact from '../artifacts/TokenLoader.json';
import AllUsedERC721MethodsArtifact from '../artifacts/AllUsedERC721Methods.json';

use(solidity);

describe('TokenLoader', () => {
    const [wallet, walletTo] = new MockProvider().getWallets();
    let tokenLoader: TokenLoader;

    beforeEach(async () => {
        tokenLoader = (await deployContract(
            wallet,
            TokenLoaderArtifact,
        )) as TokenLoader;
    });

    it('check ERC721 returned data', async () => {
        let allUsedErc721Methods = (await deployContract(
            wallet,
            AllUsedERC721MethodsArtifact,
        )) as AllUsedErc721Methods;

        expect(
            await tokenLoader.loadTokens([allUsedErc721Methods.address]),
        ).to.equal(['apagds']);
    });
});
