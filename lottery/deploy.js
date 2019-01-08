const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile'); // Exported file compile.js has 'interface' and 'bytecode' properties.

const provider = new HDWalletProvider(
    //'shell canyon govern push oblige small record jewel float bundle approve alert', // Unlocks an Account.
    'giggle comic affair surge lottery pet brief congress squirrel wheel chimney brown',
    'https://rinkeby.infura.io/v3/6f9e4489d9de490abc913169c6bf8107'
);

// web3 instance allows Rinkeby network interaction like send Ether, deploy/update contracts, whatever we want to do.
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from acount', accounts[0]);
    
    // lottery is the JS object representation of the contract. We can interact with this object and call functions on it that correspond to the contract in Lottery.sol. In other words, the inbox object represents the contract that exists on the blockchain, but in JS form.
    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: '0x' + bytecode })
        .send( { gas: '1000000', from: accounts[0]} );

    console.log(interface);
    console.log('Contract deployed to', result.options.address);
};
deploy();