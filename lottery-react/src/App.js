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

  state = {
    manager: '',
    players: [],
    balance: '', // This is not actually a number but an object. It’s technically a number wrapped in a library called bignumberjs.
    value: ''// just text input
  };

  async componentDidMount() {
    // When we are inside Ethereum world with React and making usse of the the Metamask Provider rather than the copy from our App we do NOT have to specify where this call is coming from.
    // No need no to do --> .call({ from: accounts[0] }) because Metamask Provider already has a default account set. It's going to be the first account signed into in Metamask, which is "Account 1"
    const manager = await lottery.methods.manager().call(); // manager is still a function even though it looks like variable in lottery/contracts/Lottery.sol.
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address); // getBalance() is builtin in wei.


    this.setState({ manager, players, balance }); // ES6 { manager: 'manager' } = { manager}
  }

  render() {

    web3.eth.getAccounts().then(console.log);

    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by {this.state.manager}.
          There are currently {this.state.players.length} people entered, competing to win
          {web3.utils.fromWei(this.state.balance, 'ether')} ether!
        </p>
        <hr />
        <form>
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
      </div>
    );
  }
}

export default App;
