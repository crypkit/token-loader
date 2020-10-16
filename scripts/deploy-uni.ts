import { ethers } from '@nomiclabs/buidler';
import { UniTokenLoader } from '../typechain';
import * as fs from 'fs';

async function main() {
    const UniTokenLoaderFactory = await ethers.getContractFactory('UniTokenLoader');
    const uniTokenLoader: UniTokenLoader = (await UniTokenLoaderFactory.deploy()) as unknown as UniTokenLoader;

    console.log(`Contract address: ${uniTokenLoader.address}`);
    console.log(`Tx hash: ${uniTokenLoader.deployTransaction.hash}`);

    // Save the contract address to a file
    fs.writeFile('lastDeploymentUni.json', JSON.stringify({ tokenLoaderAddress: uniTokenLoader.address }), 'utf8', () => {
        console.log('Contract address saved to lastDeploymentUni.json');
    });

    // The contract is NOT deployed yet; we must wait until it is mined
    await uniTokenLoader.deployed();
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
