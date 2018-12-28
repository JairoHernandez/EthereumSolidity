pragma solidity ^0.4.17;

contract Inbox {

    string public message; // This a function in shortened form...remember getMessage()!

    function Inbox(string initialMessage) public {
        message = initialMessage;
    }

    function setMessage(string newMessage) public {
        message = newMessage;
    }
}