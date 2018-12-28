const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile'); // Exported file compile.js has 'interface' and 'bytecode' properties.

const provider = new HDWalletProvider(
    'shell canyon govern push oblige small record jewel float bundle approve alert', // Unlocks an Account.
    'https://rinkeby.infura.io/v3/6f9e4489d9de490abc913169c6bf8107'
);

// web3 instance allows Rinkeby network interaction like send Ether, deploy/update contracts, whatever we want to do.
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from acount', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: '0x' + bytecode, arguments: ['Hi there!'] })
        .send( { gas: '1000000', from: accounts[0]} );

    console.log('Contract deployed to', result.options.address);
};
deploy();