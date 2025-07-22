
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
