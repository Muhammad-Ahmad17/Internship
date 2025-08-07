const { kafka } = require("./client");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
}); 
async function init() {
  const producer = kafka.producer();

        console.log("Connecting Producer");
        await producer.connect();
        console.log("Producer Connected Successfully");

  rl.setPrompt("> ");
  rl.prompt();

  rl.on("line", async function (line) {
    const [riderName, location] = line.split(" ");
        await producer.send({
        topic: "rider-updates",
        messages: [
            {
            partition: location.toLowerCase() === "north" ? 0 : 1,
            key: "location-update",
            value: JSON.stringify({ name: riderName, location }),
            },
        ],
        });
  }).on("close", async () => {
    await producer.disconnect();
  });
}

init();





/** Create a Readline Interface **/
// The `readline` module in Node.js enables reading input from the user 
// line by line via the terminal. The `createInterface` method sets up an 
// interface to handle input (`process.stdin`) and output (`process.stdout`).


// const readline = require('readline');

// const rl = readline.createInterface({
//   input: process.stdin,  // Read from terminal input
//   output: process.stdout // Write to terminal output
// });

// // Prompt user and handle input
// rl.question('Enter your name: ', (name) => {
//   console.log(`Hello, ${name}!`);
//   rl.close(); // Close the interface
// });


// **Explanation**: This code imports the `readline` module, creates an 
// interface `rl` for terminal I/O, prompts the user for their name, logs a 
// greeting with the input, and closes the interface to end the program.