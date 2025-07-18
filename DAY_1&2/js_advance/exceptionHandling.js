/**
 * EXCEPTION HANDLING IN JAVASCRIPT
 */

/**
 * TRY...CATCH BLOCK
 * Used to handle errors and prevent program crashes.
 */
try {
    // Code that may throw an error
    let x = y; // 'y' is not defined, so it will throw an error
} catch (error) {
    console.log("Error caught:", error.message); // Handling the error
}

/**
 * FINALLY BLOCK
 * This block always executes, regardless of whether an error occurred or not.
 */
try {
    let num = 10;
    console.log(num);
} catch (error) {
    console.log("Error:", error.message);
} finally {
    console.log("This will always execute");
}

/**
 * THROW STATEMENT
 * Used to throw custom errors.
 */
function checkAge(age) {
    if (age < 18) {
        throw new Error("You must be 18 or older");
    }
    return "Access granted";
}

try {
    console.log(checkAge(15)); // This will throw an error
} catch (error) {
    console.log("Caught exception:", error.message);
}

/**
 * CUSTOM ERROR CLASSES
 * We can create our own error classes for better error handling.
 */
class CustomError extends Error {
    constructor(message) {
        super(message);
        this.name = "CustomError";
    }
}

try {
    throw new CustomError("This is a custom error!");
} catch (error) {
    console.log(`${error.name}: ${error.message}`);
}

/**
 * NESTED TRY...CATCH BLOCKS
 * Handling errors at different levels.
 */
try {
    try {
        throw new Error("Inner error");
    } catch (innerError) {
        console.log("Caught inner error:", innerError.message);
        throw new Error("Outer error");
    }
} catch (outerError) {
    console.log("Caught outer error:", outerError.message);
}

/**
 * ASYNC ERROR HANDLING
 * Handling errors in asynchronous code.
 */
async function fetchData() {
    try {
        let response = await fetch("invalid-url"); // This will fail
        let data = await response.json();
        console.log(data);
    } catch (error) {
        console.log("Async error caught:", error.message);
    }
}
fetchData();

/**
 * EXCEPTION HANDLING IN NODE.JS
 */
const fs = require("fs");

/**
 * Handling errors while reading a file
 */
fs.readFile("nonexistent.txt", "utf8", (err, data) => {
    if (err) {
        console.log("File read error:", err.message);
    } else {
        console.log("File content:", data);
    }
});

/**
 * Handling errors in synchronous functions
 */
try {
    let data = fs.readFileSync("nonexistent.txt", "utf8");
    console.log("File content:", data);
} catch (error) {
    console.log("Synchronous file read error:", error.message);
}

/**
 * Handling errors in an Express.js route
 */
const express = require("express");
const app = express();

app.get("/", (req, res) => {
    try {
        throw new Error("Something went wrong!");
    } catch (error) {
        res.status(500).send("Error: " + error.message);
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

/**
 * EXCEPTION HANDLING IN EXPRESS & MONGOOSE
 */
const mongoose = require("mongoose");

// Connecting to MongoDB with error handling
mongoose.connect("mongodb://localhost:27017/testDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(error => {
    console.log("MongoDB connection error:", error.message);
});

// Defining a sample schema and model
const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
});
const User = mongoose.model("User", userSchema);

// Handling errors in a route with Mongoose
app.get("/users", async (req, res) => {
    try {
        let users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
