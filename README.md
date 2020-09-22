# token-loader
A solidity smart contract which returns information about tokens for a given array of addresses.
The contract is designed to handle incomplete interface implementations.
The returned value is an array of structs containing the following properties:

- ***bool probablyIsERC721***: is true for contract which implements the ERC165 interface and all the mandatory ERC721 methods
- ***string name***: name of the token, when not present defaults to an empty string
- ***string symbol***: symbol of the token, when not present defaults to an empty string
- ***uint8 decimals***: number of decimals in ERC20, when not present is set to 0 (always the case for ERC721)
- ***uint256 totalSupply***: the total token supply, when not present defaults to 0


## Installation and deployment
1. Install the dependencies:
    ```bash
        npm install
    ```
2. Build the project:
    ```bash
        npm run-script build
    ```
3. Run the tests:
    ```bash
        npm test
    ```
4. Deploy:
    ```bash
        npx buidler run scripts/deploy.ts --network NETWORK
    ```
5. Verify on Etherscan:
    ```bash
         npx buidler verify ADDRESS --network NETWORK
    ```
    >ADDRESS: the address of the deployed contract
    
    >NETWORK: mainnet, ropsten,... (has to be defined in buidler.config.ts)