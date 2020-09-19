import { ethers } from '@nomiclabs/buidler';
import * as fs from 'fs';

async function main() {
    const TokenLoader = await ethers.getContractFactory('TokenLoader');
    const tokenLoader = await TokenLoader.deploy();

    console.log(`Contract address: ${tokenLoader.address}`);
    console.log(`Tx hash: ${tokenLoader.deployTransaction.hash}`);

    // Save the contract address to a file
    fs.writeFile(
        'lastDeployment.json',
        JSON.stringify({ tokenLoaderAddress: tokenLoader.address }),
        'utf8',
        () => {
            console.log('Contract address saved to lastDeployment.json');
        },
    );

    // The contract is NOT deployed yet; we must wait until it is mined
    await tokenLoader.deployed();
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
