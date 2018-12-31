const path = require('path'); // cross-platform compatibility
const fs = require('fs');
const solc = require('solc'); // solidity compiler

const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol'); // Read in contents(raw source code) from Inbox contract.
const source = fs.readFileSync(inboxPath, 'utf8');

// console.log(solc.compile(source, 1)); // 1 means one contract attempting to compile can be more
// Now use Solidity compiler by feeding Inbox contract to it.
module.exports = solc.compile(source, 1).contracts[':Inbox']; // 1 means one contract attempting to compile can be more. If we had multiple files to compile then use this format contracts['<FILENAME>:Inbox'];
