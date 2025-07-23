
const fs = require('fs');

// write file 
fs.writeFileSync('ahmad.txt', 'Hello World');
console.log('File created successfully');

// read file 
const data = fs.readFileSync('ahmad.txt', 'utf8');
console.log(data);

// append file 
fs.appendFileSync('ahmad.txt', 'Hello World jsssjsjjkadhsjkfdhsdfjkcsdhfkjbhsadfnvjkbhdqsfjkefhjkvijdfgsv');
console.log('File appended successfully');

// // delete file 
// fs.unlinkSync('ahmad_new.txt');
// console.log('File deleted successfully');

// check if file exists 
const exists = fs.existsSync('ahmad.txt');
console.log('File exists:', exists);



/**
 * FILE SYSTEM MODULE OPERATIONS
 * 
 * This module demonstrates various file system operations using Node.js fs module
 * Includes both synchronous and asynchronous operations for:
 * - Reading files
 * - Writing files
 * - Appending to files
 * - Checking file existence

 */

/***************************************
 * 📘 fs.readFileSync vs fs.readFile
 ***************************************/

// Importing fs module
const fs = require('fs');

/***************************************
 * ✅ Synchronous: fs.readFileSync
 **************************************/

// This blocks the rest of the code until file is fully read
const dataSync = fs.readFileSync('ahmad.txt', 'utf8');
console.log("Synchronous Read:");
console.log(dataSync);

/*
 Pros:
 - Simple to write
 - Immediately returns the data
 - Useful for small files or config files during app startup

 Cons:
 - Blocking: Halts execution until file is read
 - Not recommended in real-time applications like servers
*/

/***************************************
 * ✅ Asynchronous: fs.readFile
 **************************************/

// This does not block — the rest of the code runs while the file is read
fs.readFile('ahmad.txt', 'utf8', (err, dataAsync) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }
  console.log("Asynchronous Read:");
  console.log(dataAsync);
});

/*
 Pros:
 - Non-blocking: Other code runs while file is loading
 - Ideal for performance-critical or server applications

 Cons:
 - Requires a callback or async/await
 - Code can get nested if not managed properly (callback hell)
*/

/***************************************
 * 🧪 Output Comparison
 **************************************/

// To see difference clearly, add logs before and after
console.log("Before reading file asynchronously");
// fs.readFile will run in background
console.log("After scheduling async read");
