require('events').EventEmitter.prototype._maxListeners = 100; // Fixes Warning message --->  "(node:6578) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 data listeners added. Use emitter.setMaxListeners() to increase limit"
const assert = require('assert');
const ganache = require('ganache-cli'); // Local test Ethereum network.
const Web3 = require('web3'); // Name is capitalized because Web3 is a constructor function used to provide instances of the Web 3 library.

// const web3 = new Web3(ganache.provider()); // Use next two lines instead due to a Web3 Version Fix.
const provider = ganache.provider();
const web3 = new Web3(provider);

const { interface, bytecode } = require('../compile'); // Exported file compile.js has 'interface'(ABI) and 'bytecode'(compiled contract) properties.

let accounts;
let inbox;

beforeEach(async () => { // Executes before every single test.
    /**************************
    // Interacting with ganache network. Get a list of all accounts
    web3.eth.getAccounts().then(fetchedAccounts => {
        console.log('==========', fetchedAccounts);
    });
    ***************************/
    
    // REFACTOR TO ASYNC/AWAIT
    // Interacting with ganache network. Get a list of all accounts
    accounts = await web3.eth.getAccounts(); // Because this function is asynchronous in nature uou have to place 'async' in beforeEach().

    // Use one of those accounts to deploy a contract.
    // inbox is the JS object representation of the contract. We can interact with this object and call functions on it that correspond to the contract in Inbox.sol. In other words, the inbox object represents the contract that exists on the blockchain, but in JS form.
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: ['Hi there!'] })
        .send({ from: accounts[0], gas: '1000000' }); // Everytime blockchain is modified you have to spend some gas.
    
    // Web3 Version fix
    // ADD THIS ONE LINE RIGHT HERE!!!!! <---------------------
    inbox.setProvider(provider);
});

describe('Inbox', () => {
    it('deploys a contract', () => {
        // console.log(accounts);
        // console.log(inbox);
        assert.ok(inbox.options.address); // If this a defined value(aka truthy like a string) then test will pass. If address is undefined or null then test will fail.
    });

    it('has a default message', async () => {
        // methods property gives us access to the public methods Inbox/setMessage in Inbox.sol.
        const message = await inbox.methods.message().call();
        assert.equal(message, 'Hi there!');
    });

    it('can change the message', async () => {
        await inbox.methods.setMessage('bye').send({ from: accounts[0] });
        const message = await inbox.methods.message().call();
        assert.equal(message, 'bye');
    });
});

/***************************************************************** 
class Car {
    park() {
        return 'stopped';
    }

    drive() {
        return 'vroom';
    }
}

let car;

// Executes immediately everytime an it() test runs.
beforeEach(() => {
    car = new Car();
});

// 'Car' is solely for me and has nothing to do with class Car
describe('Car', () => {
    it('can park', () => { 
        // car.park() produces value by our code and 'stopped' is value we think it should be
        assert.equal(car.park(), 'stopped');
    });

    it('can drive', () => {
        assert.equal(car.drive(), 'vroom');
    });
});
*****************************************************************/