// eslint-disable-next-line no-unused-vars
import { BuidlerConfig, usePlugin } from '@nomiclabs/buidler/config';
import { INFURA_PROJECT_ID, PRIVATE_KEY, ETHERSCAN_API_KEY } from './config';

usePlugin('@nomiclabs/buidler-ethers');
usePlugin('@nomiclabs/buidler-etherscan');
usePlugin('@nomiclabs/buidler-waffle');

// Activate the following plugin when support for ethers v5 is present
// usePlugin('buidler-typechain');

const config: BuidlerConfig = {
    solc: {
        version: '0.7.1',
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
