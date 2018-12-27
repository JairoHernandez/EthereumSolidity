const assert = require('assert');
const ganache = require('ganache-cli'); // Local test Ethereum network.
const Web3 = require('web3'); // Name is capitalized because Web3 is a constructor function used to provide instances of the Web 3 library.
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile'); // Exported file compile.js has 'interface' and 'bytecode' properties.

let accounts;
let inbox;

beforeEach(async () => {
    /**************************
    // Get a list of all accounts
    web3.eth.getAccounts().then(fetchedAccounts => {
        console.log('==========', fetchedAccounts);
    });
    ***************************/
    
    // REFACTOR TO ASYNC/AWAIT
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts(); // Because this function is asynchronous in nature uou have to place 'async' in beforeEach().

    // Use one of those accounts to deploy a contract.
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: ['Hi there!'] })
        .send({ from: accounts[0], gas: '1000000'} ); // Everytime blockchain is modified you have to spend some gas.

});

describe('Inbox', () => {
    it('deploys a contract', () => {
        console.log(accounts);
        console.log('=================');
        console.log(inbox);
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

// Executes everytime an it() test runs.
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