const path = require('path'); // cross-platform compatibility
const fs = require('fs');
const solc = require('solc'); // solidity compiler

const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol'); // Read in contents(raw source code) from Lottery contract.
const source = fs.readFileSync(lotteryPath, 'utf8');

// console.log(solc.compile(source, 1)); // 1 means one contract attempting to compile can be more
// Now use Solidity compiler by feeding Inbox contract to it.
module.exports = solc.compile(source, 1).contracts[':Lottery']; // 1 means one contract attempting to compile can be more. If we had multiple files to compile then use this format contracts['<FILENAME>:Inbox'];
