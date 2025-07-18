/* *****************************************
 * 📌 CALLBACK PARAMETERIZATION EXAMPLES
 ******************************************/

// 1. Basic Callback with Single Parameter
function simpleCallback(callback) {
    callback("Hello");  // Passing single parameter
}

simpleCallback((message) => {
    console.log(message);  // Output: Hello
});

// 2. Multiple Parameters in Callback
function processUserData(callback) {
    const user = {
        name: "John",
        age: 30
    };
    callback(user.name, user.age);  // Passing multiple parameters
}

processUserData((name, age) => {
    console.log(`${name} is ${age} years old`);  // Output: John is 30 years old
});

// 3. Error-First Callback Pattern (Node.js style)
function fetchData(callback) {
    const success = true;
    if (success) {
        callback(null, "Data fetched");  // First param null means no error
    } else {
        callback(new Error("Failed"), null);  // First param is error object
    }
}

fetchData((error, data) => {
    if (error) {
        console.error(error);
    } else {
        console.log(data);  // Output: Data fetched
    }
});

// 4. Callback with Options Object
function processWithOptions(data, options, callback) {
    const result = options.uppercase ? data.toUpperCase() : data;
    callback(result);
}

processWithOptions("hello", { uppercase: true }, (result) => {
    console.log(result);  // Output: HELLO
});

/* *****************************************
 * 🔑 KEY POINTS ABOUT PARAMETERIZATION:
 * 
 * 1. Parameters are passed to callback when it's invoked
 * 2. Callback parameters represent data it can access
 * 3. Common patterns include:
 *    - Single parameter
 *    - Multiple parameters
 *    - Error-first pattern
 *    - Options objects
 ******************************************/ 