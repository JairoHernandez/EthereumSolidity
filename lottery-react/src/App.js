import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  // Execution flow sequence:
  // 1. Component App always initially loads with empty state. 
  // 2. It will follow this by running render with empty state.
  // 3. Once App component fully renders it fires componentDidMount to reach out to the blockchain network to retrieve current state of manager's address. This causes render() method to fire again.

  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     manager: '',
  //     players: [],
  //     balance: '', // This is not actually a number but an object. It’s technically a number wrapped in a library called bignumberjs.
  //     value: '', // just text input
  //     message: ''
  //   };

  // }

  // manager, players, balance properties are utilized by contract itself or at least coming from the contract.
  // value, message are being produced by Component itself.
  state = {
    manager: '',
    players: [],
    balance: '', // This is not actually a number but an object. It’s technically a number wrapped in a library called bignumberjs.
    value: '', // just text input
    message: ''
  };

  async componentDidMount() {
    // When we are inside Ethereum world with React and making usse of the the Metamask Provider rather than the copy from our App we do NOT have to specify where this call is coming from.
    // No need no to do --> .call({ from: accounts[0] }) because Metamask Provider already has a default account set. It's going to be the first account signed into in Metamask, which is "Account 1"
    const manager = await lottery.methods.manager().call(); // manager is still a function even though it looks like variable in lottery/contracts/Lottery.sol.
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address); // getBalance() is builtin in wei.


    this.setState({ manager, players, balance }); // ES6 { manager: 'manager' } = { manager}
  }

  // One thing to be aware of, whenever we are making use of an event handler with React we always have to worry about the context of the function. By context I mean the value of 'this'.
  // Traditionally we have made technique use of calling {this.onSubmit.bind(this)}. However with the version of Babel running in the create-react-app package we get a benefit piece of
  // syntax to keep us from worrying about manually binding the function. Instead of writing it like this, which requires using bind
  /*
  onSubmit() {

  }
  */
 // we write it like this. We are still defining a method inside the class but we don't have to worry about writing 'this' inside the method like we normally would.
 // The value of 'this' will be automatically set for us to be equal to our component, which is exactly what we want, so we don't have to worry about binding 'onSubmit' 
 // down in the render function.
  onSubmit = async event => { // event represents the form submission
    // this <--- don't have to worry about writing 'this' inside the method.
  
    // As usual we want to prevent the form from submitting itself in the classic html way.
    event.preventDefault();

    // send a transaction to the 'enter' function in solidity. This is what makes onSubmit() asynchronous.
    // One thing to mention before writing the transaction. A couple of videos ago when making calls in the JS React way that uses the provider from web3; lottery.methods.manager().call(),
    // we don't have to make use of that 'from' property and specify which account we are sending this transaction from, now that is true with call(), however with the web3 version we are
    // using here unfortunately that is not true of sending transactions. So when we send a transaction unfortunately we do have to retrieve a list of accounts from the web3 object and 
    // specify the accounts that is going to be used to send money over to that particular function existing in our contract. Long-story-short before directly calling the lottery contract
    // 'send' or 'enter' method we have to get a list of our accounts. Now we have gotten a list of our accounts in the past before, which was done in render() --> web3.eth.getAccounts().then(console.log);.
    const accounts = await web3.eth.getAccounts(); // TAKE-TWO! LONG-STORY-SHORT. These accounts are being provide by Metamask.

    // Tells user the status of what's currently happening with the app. You still need to initialize this message property at the top of the component.
    // Then we will place it inside render().
    this.setState({ message: 'Waiting on transaction success to be entered...' });

    // This will enter us into our contract by sending a transaction to the network which will take 15-30 seconds.
    await lottery.methods.enter().send({
      from: accounts[0], // we are going to assume the first account in the accounts array is going to be sending the transaction
      value: web3.utils.toWei(this.state.value, 'ether') // We grab this from render {this.state.value} and it's a value in ether so we need to convert to wei.
    });

    // After transactino completes.
    this.setState({ message: 'You have been entered!' });
  };

  onClick = async () => {
    // Get list of accounts.
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success for picking winner...' });

    // It would really be nice if we could tell our users who just won the contract, but we can't because here we are sending a transaction and 
    // whenever send a transaction we get no return value back so we have no ability right now to be told who won the lottery.
    // Solution is to add lastWinner players[index] into Lottery.sol. However he'll leave that up to us look at video tip for idea.
    // At the end of the day you can just check in Metamask to see if you lost or gained money.
    // By sending a transaction to the network which will take 15-30 seconds.
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: 'A winner has been picked!' });
  };

  render() {

    web3.eth.getAccounts().then(console.log);

    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by {this.state.manager}.
          There are currently {this.state.players.length} people entered, competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!
        </p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amounter of ether to Enter</label>
            <input
              value={this.state.value}
              onChange={event => this.setState({value: event.target.value})}
            />
          </div>
          <button>Enter</button>
        </form>
        <hr />
        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick a winnder!</button>
        <hr />
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
