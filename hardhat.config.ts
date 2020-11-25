// eslint-disable-next-line no-unused-vars
import { HardhatUserConfig } from 'hardhat/config';
import { INFURA_PROJECT_ID, PRIVATE_KEY, ETHERSCAN_API_KEY } from './config';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import 'hardhat-typechain';

// Activate the following plugin when support for ethers v5 is present
// usePlugin('buidler-typechain');

const config: HardhatUserConfig = {
    solidity: {
        version: '0.7.5',
        settings: {
            optimizer: {
                enabled: true,
            },
        },
    },
    networks: {
        ropsten: {
            url: `https://ropsten.infura.io/v3/${INFURA_PROJECT_ID}`,
            accounts: [PRIVATE_KEY],
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
};

export default config;
