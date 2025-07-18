/* *****************************************
 * 🎯 UNDERSTANDING CALLBACKS IN JAVASCRIPT
 ******************************************/

/* *****************************************
 * 📌 BASIC CALLBACK EXAMPLE
 ******************************************/
function greet(name, callback) {
    console.log(`Hello ${name}!`);
    callback();
}

function callbackFunction() {
    console.log("I am callback function");
}

// Using the callback
greet("John", callbackFunction);
// Output:
// Hello John!
// I am callback function

/* *****************************************
 * 📌 CALLBACKS WITH PARAMETERS
 ******************************************/
function processUser(name, age, callback) {
    const user = {
        name: name,
        age: age
    };
    callback(user);
}

processUser("Alice", 25, (user) => {
    console.log(`User ${user.name} is ${user.age} years old`);
});

/* *****************************************
 * 📌 ASYNCHRONOUS CALLBACKS
 ******************************************/
console.log("Starting...");

setTimeout(() => {
    console.log("2 seconds have passed!");
}, 2000);

console.log("Finishing...");
// Output:
// Starting...
// Finishing...
// (after 2 seconds) 2 seconds have passed!

/* *****************************************
 * 📌 ERROR HANDLING IN CALLBACKS
 ******************************************/
function fetchData(success, error) {
    const randomNumber = Math.random();
    if (randomNumber > 0.5) {
        success("Data successfully fetched!");
    } else {
        error("Error: Could not fetch data");
    }
}

fetchData(
    (data) => console.log(data),
    (err) => console.error(err)
);
// Possible outputs:
// Either: "Data successfully fetched!"
// Or: "Error: Could not fetch data"

/* *****************************************
 * 📌 CALLBACK HELL EXAMPLE
 ******************************************/
// ❌ Bad Practice (Callback Hell)
getData(function(a) {
    getMoreData(a, function(b) {
        getMoreData(b, function(c) {
            getMoreData(c, function(d) {
                console.log('Callback hell example:', d);
            });
        });
    });
});

/* *****************************************
 * 📌 SOLVING CALLBACK HELL WITH NAMED FUNCTIONS
 ******************************************/
// ✅ Better Practice
function handleD(d) {
    console.log('Result:', d);
}

function handleC(c) {
    getMoreData(c, handleD);
}

function handleB(b) {
    getMoreData(b, handleC);
}

function handleA(a) {
    getMoreData(a, handleB);
}

getData(handleA);

/* *****************************************
 * 📌 PRACTICAL EXAMPLES
 ******************************************/

// 1. Array methods with callbacks
const numbers = [1, 2, 3, 4, 5];

// forEach example
numbers.forEach((num) => {
    console.log(num * 2);
});
// Output:
// 2
// 4
// 6
// 8
// 10

// map example
const doubled = numbers.map((num) => num * 2);
// doubled = [2, 4, 6, 8, 10]

// filter example
const evenNumbers = numbers.filter((num) => num % 2 === 0);
// evenNumbers = [2, 4]

/* *****************************************
 * 📌 EVENT LISTENERS WITH CALLBACKS
 ******************************************/
// Example for browser environment
/*
document.getElementById('button').addEventListener('click', function() {
    console.log('Button clicked!');
});
*/

/* *****************************************
 * 📌 REAL-WORLD EXAMPLE: FILE PROCESSING
 ******************************************/
function processFile(filename, callback) {
    console.log(`Processing ${filename}...`);
    setTimeout(() => {
        let success = true;
        if (success) {
            callback(null, `${filename} processed successfully`);
        } else {
            callback(new Error('Processing failed'));
        }
    }, 1000);
}

processFile('data.txt', (error, result) => {
    if (error) {
        console.error('Error:', error.message);
    } else {
        console.log('Success:', result);
    }
});

/* *****************************************
 * 📌 CUSTOM HIGHER-ORDER FUNCTION
 ******************************************/
function repeat(times, callback) {
    for (let i = 0; i < times; i++) {
        callback(i);
    }
}

repeat(3, (i) => {
    console.log(`Iteration ${i + 1}`);
});

/* *****************************************
 * 🔑 KEY POINTS ABOUT CALLBACKS:
 * 
 * 1. Callbacks are functions passed as arguments
 * 2. They enable asynchronous programming
 * 3. Common in event handling and array methods
 * 4. Can lead to callback hell if nested deeply
 * 5. Being replaced by Promises and async/await
 *    in modern JavaScript for better readability
 ******************************************/
