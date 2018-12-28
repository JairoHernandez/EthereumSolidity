const path = require('path'); // cross-platform compatibility
const fs = require('fs');
const solc = require('solc');

const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol'); // Now you can read in raw source code from contract.
const source = fs.readFileSync(inboxPath, 'utf8');

// console.log(solc.compile(source, 1)); // 1 means one contract attempting to compile can be more
// Now use Solidity compiler
module.exports = solc.compile(source, 1).contracts[':Inbox']; // 1 means one contract attempting to compile can be more
