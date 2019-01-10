// From Remix paste here.

pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players;
    
    function Lottery() public {
        manager = msg.sender; // person creating contract assigned to manager.  
    }
    
    function enter() public payable {
        
        require(msg.value > .01 ether); // auto covertss to wei
        players.push(msg.sender); 
    }
    
    function random() private view returns (uint) {
        // block is another global var. Also, unit() convers the hex hash into uint since that we expect to be returned.
        return uint(keccak256(block.difficulty, now, players));
    }
    
    function pickWinner() public restricted {
        uint index = random() % players.length;
        // 'this' references instance of current contract and 'balance' is amount of ether the contract has and will send to winner.
        players[index].transfer(this.balance);
        players = new address[](0); // Dynamic array with zero elements initialized inside of it.
    }
    
    modifier restricted() {
        require(msg.sender == manager); // Only manager can call pickWinner().
        _;
    }
    
    function getPlayers() public view returns (address[]) {
        return players;
    }
}