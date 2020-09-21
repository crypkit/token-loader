# token-loader
1. Compile:

    npx buidler compile

2. Generate typechain (buidler-typechain doesn't yet support ethers-v5):

    typechain --target ethers-v5 --outDir ./typechain ./artifacts/*.json

3. Run tests:

    npx buidler test

4. Deploy:

    npx buidler run scripts/deploy.ts --network NETWORk

5. Verify on Etherscan:

     npx buidler verify ADDRESS --network NETWORK

>ADDRESS: the address of the deployed contract

>NETWORK: mainnet, ropsten,... (has to be defined in buidler.config.ts)