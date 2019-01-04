require('events').EventEmitter.prototype._maxListeners = 100; // Fixes Warning message --->  "(node:6578) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 data listeners added. Use emitter.setMaxListeners() to increase limit"
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

// const web3 = new Web3(ganache.provider()); // Use next two lines instead due to a Web3 Version Fix.
const provider = ganache.provider();
const web3 = new Web3(provider);

const { interface, bytecode } = require('../compile');

let lottery;
let accounts;

beforeEach(async () => { // Executes before every single test.

    // Interacting with ganache network. Get a list of all accounts
    accounts = await web3.eth.getAccounts();

    // Use one of those accounts to deploy a contract.
    // lottery is the JS object representation of the contract. We can interact with this object and call functions on it that correspond to the contract in Lottery.sol. In other words, the inbox object represents the contract that exists on the blockchain, but in JS form.
    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode })
        .send({ from: accounts[0], gas: '1000000' })

    // Web3 Version fix
    // ADD THIS ONE LINE RIGHT HERE!!!!! <---------------------
    lottery.setProvider(provider);
});

describe('Lottery Contract', () => {
    it('deploys a contract', () => {
        // console.log(accounts);
        // console.log(inbox);
        // This is the address to where our contract was deployed to on the local test network.
        assert.ok(lottery.options.address); // If this a defined value(aka truthy like a string) then test will pass. If address is undefined or null then test will fail.
    });

    it('allows one account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether') // convert .02 ethers to wei
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0],
        });
        
        // 1. Make sure there is only 1 record inside players array.
        assert.equal(1, players.length);
        // 2. Make sure correct address is stored inside array.
        assert.equal(accounts[0], players[0]);
    });

    it('allows multiple accounts to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether') // convert .02 ethers to wei
        });

        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether') // convert .02 ethers to wei
        });

        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02', 'ether') // convert .02 ethers to wei
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0],
        });

        // 1. Make sure all 3 records are inside players array.
        assert.equal(3, players.length);
        // 2. Make sure the 3 player addresses are stored inside array.
        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
    });

    it('requires a minimum amount of ether to enter', async () => {
        // Use try-cath to make sure some error occurred in below block of code.
        // Also, we are using try-catch because that's what you use with async/await. If we were using traditional promises then we would use a catch statement instead.
        try 
        {
            // When we attempt to enter with this wei value 0 an error should be thrown!!!
            await lottery.methods.enter().send({
                from: accounts[0],
                value: 0 // value of 0 will cause it to jump to catch() 
            });
            assert(false); // Fail test no matter what.
        } catch(err) {
            // assert.ok(err); // Checks for existence.
            // console.log('wow!')
            assert(err); // Checks for truthiness
        }
    });

    // We don't need to call enter() to test this. 
    it('only manager can call pickWinner', async () => {
        try
        {
            await lottery.methods.pickWinner().send({
                from: accounts[1] // NOT the manager
            });
            assert(false); // fail test no matter what
        } catch(err) {
            assert(err); // Checks for truthiness
        }
    }) ;

    it('sends mone to the winner and resets the players array', async () => {
        // We are only entering one player in this game because if we add two or more it overcomplicates test due to the random nature of function random().
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether') // convert .02 ethers to wei
        });

        // Returns ether in units of wei that a given account controls. Can be used on external accounts(like you and me) or of contracts. Just give it an address and it will return its balance.
        // Also, there is a gas charge to take into account charged as a processing fee by the network.
        const initialBalance = await web3.eth.getBalance(accounts[0]); // Should be 2 ethers less bcause of value: web3.utils.toWei('2', 'ether')

        // Pick winner. Bascaily accounts[0] should receive back the 2 ether it sent in. Get yo money back!!
        await lottery.methods.pickWinner().send({ from: accounts[0] });

        const finalBalance = await web3.eth.getBalance(accounts[0]);

        const difference = finalBalance - initialBalance;
        // console.log(difference);
        assert(difference > web3.utils.toWei('1.8', 'ether')); // Why 1.8 and not 2?? Because as an educated guestimate we are factoring in gas cost.
    }); 

});

