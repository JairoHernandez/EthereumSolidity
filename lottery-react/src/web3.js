import Web3 from 'web3';

// Use old Provider for web3 v0.20 used by Metamask. It's the Provider that connects directly to Rinkeby network.
const web3 = new Web3(window.web3.currentProvider); 

// Now the export allows it to be required by another file. It exports version web3 1.0.
export default web3; // Used by App.js