/* *****************************************
 * 🚨 UNDERSTANDING EVAL() IN JAVASCRIPT 🚨
 ******************************************/

/* *****************************************
 * 📌 BASIC EVAL USAGE
 ******************************************/
// Evaluates a string expression and returns its value
let x = 10;
let y = 20;
console.log(eval('x + y'));  // Output: 30

/* *****************************************
 * 📌 MATHEMATICAL EXPRESSIONS
 ******************************************/
// Eval can process mathematical expressions as strings
let mathExpression = "2 * (3 + 4)";
console.log(eval(mathExpression));  // Output: 14

/* *****************************************
 * 📌 STRING CONCATENATION
 ******************************************/
// Be careful with string operations
let str1 = "'Hello' + ' ' + 'World'";
console.log(eval(str1));  // Output: Hello World

/* *****************************************
 * 📌 EXECUTING MULTIPLE STATEMENTS
 ******************************************/
// Multiple statements can be executed using semicolons
let multiStatement = "let a = 5; let b = 7; a * b";
console.log(eval(multiStatement));  // Output: 35

/* *****************************************
 * ⚠️ SECURITY CONCERNS
 ******************************************/
// WARNING: Never use eval with untrusted input
// Bad example (DO NOT USE):
let userInput = "console.log('potentially harmful code')";
// eval(userInput);  // Security risk!

/* *****************************************
 * 📌 PRACTICAL EXAMPLES
 ******************************************/
// Calculator-like functionality
function calculateExpression(expr) {
    try {
        return eval(expr);
    } catch (error) {
        return "Invalid Expression";
    }
}

// Test cases
console.log(calculateExpression("5 + 3"));  // Output: 8
console.log(calculateExpression("2 ** 3"));  // Output: 8
console.log(calculateExpression("invalid"));  // Output: Invalid Expression

/* *****************************************
 * 📌 SCOPE IN EVAL
 ******************************************/
// Eval runs in the current scope
function testScope() {
    let local = 42;
    return eval('local');  // Can access local variables
}
console.log(testScope());  // Output: 42

/* *****************************************
 * 📌 ALTERNATIVES TO EVAL
 ******************************************/
// Better alternatives for specific use cases
// 1. For mathematical expressions
const safeCalculate = new Function('return ' + '2 * 3')();
console.log(safeCalculate);  // Output: 6

// 2. For JSON parsing
let jsonStr = '{"name": "John", "age": 30}';
let obj = JSON.parse(jsonStr);  // Safer than eval
console.log(obj.name);  // Output: John

/* *****************************************
 * 🔒 BEST PRACTICES
 ******************************************/
// 1. Avoid eval() when possible
// 2. Use JSON.parse() for JSON data
// 3. Use mathematical libraries for calculations
// 4. Always validate and sanitize input if eval must be used
// 5. Consider using Function constructor as a slightly safer alternative
