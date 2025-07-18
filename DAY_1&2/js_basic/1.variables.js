/*VARIABLE DECLARATIONS AND BASICS*/

/*The Three Ways to Declare Variables*/

let changeable = 42;      // Modern, block-scoped, can be reassigned
// The `let` keyword allows you to declare a variable with block scope. This means the variable is only availclosing block (like a loop or a function).able within the nearest en
// It also allows you to reassign its value. `let` was introduced to replace `var` and reduce errors in code.

const constant = 100;     // Modern, block-scoped, cannot be reassigned
// The `const` keyword also has block scope like `let`, but once a value is assigned to a `const` variable, it cannot be reassigned.
// This makes `const` perfect for values that should not change.

var oldWay = "legacy";    // Old way, function-scoped (avoid using)
// `var` is function-scoped, meaning the variable is accessible anywhere within the function it's declared in, but not outside it.
// It is recommended to avoid using `var` in modern JavaScript due to its scoping quirks and potential to cause bugs.


/*Variable Scope Demonstration*/

{
    let blockScoped = "only available in this block"; // Block-scoped
    var notBlockScoped = "available outside too";     // Function-scoped
}
// `let` is block-scoped, so it is only accessible inside the curly braces `{}` where it's declared.
// `var` is function-scoped, meaning that despite being declared inside a block, it can still be accessed outside the block.

console.log(notBlockScoped);      // Works! Shows why var can be dangerous
console.log(blockScoped);        // Error! blockScoped is not defined outside the block

// `var` can leak outside of the block, which may cause unintended bugs or unexpected behavior in your code.


/*Constant Variables and Objects*/

const person = { name: "John" };   // Const object can have its properties changed
// `const` is used for declaring the object itself. However, it only prevents reassigning the reference of the object, not the internal properties.

person.name = "Jane";             // Valid! Only reassignment is restricted
// This works because we're modifying the properties of the object, not reassigning the entire object itself.


// person = { name: "Jane" };      // Error! Can't reassign const
// This would throw an error because we're trying to reassign the entire object, which is not allowed when using `const`.


/*Multiple Variable Declarations*/

let a = 1, b = 2, c = 3;          // Declare multiple variables in one line
// This is a valid syntax, but it's generally less readable. Each variable should ideally be declared on its own line for clarity.

let x, y, z;                      // Declare without initialization
// This declares the variables `x`, `y`, and `z` without assigning values to them yet. The default value for uninitialized variables is `undefined`.


/*VARIABLE TYPES AND TYPE SYSTEM*/

/*Basic Types in JavaScript*/

let numberVar = 42;               // Number type
// This is a simple number. JavaScript does not differentiate between integers and floating-point numbers. All are considered the `Number` type.

let stringVar = "Hello";          // String type
// This is a string type variable, which holds sequences of characters. Strings are immutable in JavaScript, meaning they can't be changed after creation.

let booleanVar = true;            // Boolean type
// Booleans can only hold two possible values: `true` or `false`. They are used for conditions and logical expressions.

let undefinedVar;                 // Undefined type
// A variable that is declared but not assigned a value will have the `undefined` value. `undefined` is a type itself.

let nullVar = null;               // Null type
// `null` represents an intentional absence of any value or object. It's often used to reset or empty a variable.

let symVar = Symbol("id");     // Symbol type
// A `Symbol` is a unique and immutable value that can be used as an object property key. It's often used to avoid property name conflicts.

/*undefined is not the same as null:

undefined indicates a variable has been declared but not assigned a value.
null is an assignment value that explicitly indicates the absence of a value.*/

/* NUMBER */
{
    /* 1. Declaration */
    let intNum = 42;
    let floatNum = 3.14;

    /* 2. Type */
    console.log(typeof intNum);      // "number"
    console.log(typeof floatNum);    // "number"

    /* 3. Special Values */
    console.log(1 / 0);              // Infinity
    console.log(-1 / 0);             // -Infinity
    console.log("abc" * 2);          // NaN (Not a Number)

    /* 4. Precision Issues */
    let sum = 0.1 + 0.2;
    console.log(sum);                // 0.30000000000000004
    console.log(Number(sum.toFixed(2))); // 0.3

    /* 5. Methods */
    console.log(intNum.toFixed(2));  // "42.00"
    console.log(Number.isNaN(NaN));  // true
}

/* STRING */
{
    /* 1. Declaration */
    let str = "Hello";
    let str2 = 'World';
    let str3 = `Template`;

    /* 2. Type */
    console.log(typeof str);         // "string"

    /* 3. Immutability */
    // Mutability means strings cannot be changed in place.
    let s = "abc";
    // s[0] = "z"; // No effect

    /* 4. Methods */
    console.log(str.length);         // 5
    console.log(str.toUpperCase());  // "HELLO"
    console.log(str.concat(str2));   // "HelloWorld"
    console.log(str.includes("ll")); // true

    /* 5. Template Literals */
    let name = "John";
    let greeting = `Hello, ${name}!`;
    console.log(greeting);           // "Hello, John!"
}

/* BOOLEAN */
{
    /* 1. Declaration */
    let isTrue = true;
    let isFalse = false;

    /* 2. Type */
    console.log(typeof isTrue);      // "boolean"

    /* 3. Usage */
    if (isTrue) {
        console.log("It's true!");
    }

    /* 4. Falsy Values */
    // false, 0, "", null, undefined, NaN are all falsy
    console.log(Boolean(0));         // false
    console.log(Boolean(""));        // false
    console.log(Boolean("abc"));     // true
}
/* UNDEFINED */
{
    /* 1. Declaration */
    let notAssigned;
    console.log(notAssigned); // undefined

    /* 2. Type */
    console.log(typeof notAssigned); // "undefined"

    /* 3. Usage */
    // Indicates a variable has been declared but not assigned a value
    function noReturn() {}
    console.log(noReturn()); // undefined (no return value)

    // Accessing a non-existent property
    const obj = {};
    console.log(obj.missing); // undefined

    /* 4. Global undefined */
    console.log(undefined); // undefined (global value)

    /* 5. Comparison */
    console.log(undefined == null);  // true (loose equality)
    console.log(undefined === null); // false (strict equality)

    /* 6. Falsy Value */
    if (!undefined) {
        console.log("undefined is falsy"); // This will run
    }

    /* 7. Best Practice */
    // Use typeof to check for undefined
    if (typeof notAssigned === "undefined") {
        console.log("Variable is undefined");
    }
}

/* NULL */
{
    /* 1. Declaration */
    let empty = null;
    console.log(empty); // null

    /* 2. Type */
    console.log(typeof empty); // "object" (quirk in JS)

    /* 3. Usage */
    // Used to represent intentional absence of value
    let user = null; // No user assigned

    // Resetting a variable
    let data = "some value";
    data = null; // Now intentionally empty

    /* 4. Comparison */
    console.log(null == undefined);  // true (loose equality)
    console.log(null === undefined); // false (strict equality)

    /* 5. Falsy Value */
    if (!null) {
        console.log("null is falsy"); // This will run
    }

    /* 6. Best Practice */
    // Use strict equality to check for null
    if (user === null) {
        console.log("User is null");
    }

    /* 7. Quirks */
    // typeof null returns "object" due to a legacy bug
    // null is not an object, but this behavior remains for compatibility

    /* 8. When to use null vs undefined */
    // - Use undefined for variables that have not been assigned a value
    // - Use null when you want to explicitly indicate "no value" or "empty"
}

/* SUMMARY: NULL vs UNDEFINED */
// undefined: variable declared but not assigned, missing object property, function with no return
// null: intentional absence of value, explicit "empty" assignment

// Checking for both:
function isNullOrUndefined(val) {
    return val == null; // true for both null and undefined
}
console.log(isNullOrUndefined(undefined)); // true
console.log(isNullOrUndefined(null));      // true
console.log(isNullOrUndefined(0));         // false 

/* BIGINT */
{
    /* 1. Declaration */
    let big = 1234567890123456789012345678901234567890n;

    /* 2. Type */
    console.log(typeof big);         // "bigint"

    /* 3. Usage */
    let sum = big + 10n;
    console.log(sum);                // 1234567890123456789012345678901234567900n

    /* 4. Cannot mix with Number */
    // let error = big + 10; // TypeError
}

/* OBJECT */
{
    /* 1. Declaration */
    let obj = { name: "John", age: 30 };

    /* 2. Type */
    console.log(typeof obj);         // "object"

    /* 3. Properties */
    console.log(obj.name);           // "John"

    /* 4. Methods */
    obj.greet = function() {
        return `Hello, ${this.name}`;
    };
    console.log(obj.greet());        // "Hello, John"

    /* 5. Arrays are objects */
    let arr = [1, 2, 3];
    console.log(typeof arr);         // "object"
    console.log(Array.isArray(arr)); // true
}

/*SYMBOLS*/
{
    /* 1. Uniqueness */
    const symbol1 = Symbol("id");
    const symbol2 = Symbol("id");
    console.log(symbol1 === symbol2);  // false

    /* 2. Description */
    const symbol = Symbol("id");
    console.log(symbol.description);  // "id"

    /* 3. Symbol as Object Property Key */
    const obj = {};
    const uniqueSymbol = Symbol("key");
    obj[uniqueSymbol] = "value";
    console.log(obj[uniqueSymbol]);  // "value"

    /* 4. Not Enumerated in Loops */
    const objWithSymbol = {
        [uniqueSymbol]: "private"
    };
    for (let key in objWithSymbol) {
        console.log(key);  // Nothing is logged because `uniqueSymbol` is not enumerable
    }

    /* 5. Global Symbols */
    const globalSymbol1 = Symbol.for("shared");
    const globalSymbol2 = Symbol.for("shared");
    console.log(globalSymbol1 === globalSymbol2);  // true

    /* 6. Well-known Symbols */
    const iterableObj = {
        [Symbol.iterator]() {
            let step = 0;
            return {
                next() {
                    step++;
                    if (step <= 2) return {value: step, done: false};
                    return {done: true};
                }
            };
        }
    };

    for (let value of iterableObj) {
        console.log(value);  // 1, 2
    }

    /* 7. Immutability */
    let symbolVar = Symbol("id");

    let objWithImmutableSymbol = {
        [symbolVar]: "value"
    };

    console.log(objWithImmutableSymbol[symbolVar]);  // "value"
}
let bigIntVar = 9007199254740991n;// BigInt type for large integers
// `BigInt` allows you to store large integers that are beyond the range of the `Number` type.

/*Type Checking and typeof*/

console.log(typeof numberVar);    // "number"
// The `typeof` operator returns the type of a variable. Here, it tells us that `numberVar` is of type `number`.

console.log(typeof stringVar);    // "string"
// Similarly, `typeof stringVar` returns "string", which is the type of the variable `stringVar`.

console.log(typeof undefinedVar); // "undefined"
// The type of a variable that is declared but not initialized is `undefined`.

console.log(typeof nullVar);      // "object" - JavaScript quirk!
// `typeof null` is a quirky case in JavaScript and will return "object". This is a historical bug in the language.
//The bug originated because, in the early days, null was stored in memory as 0, which was mistakenly categorized as
// an object type. This behavior persisted to ensure compatibility with older JavaScript code, even though the
// underlying memory model has evolved.

/*How to check for null*/
let null1Var = null;
if (null1Var === null) {
    console.log("It's null!");  // This will work correctly
}

/*TYPE COERCION AND CONVERSION*/

/*Automatic Type Coercion Examples*/

console.log("5" + 3);         // "53" (number converted to string)
console.log("5" - 3);         // 2 (string converted to number)
console.log("5" * 2);         // 10 (string converted to number)
console.log("10" / 2);        // 5 (string converted to number)
console.log("5" + null);      // "5null" (null converted to string)
console.log("5" - null);      // 5 (null converted to 0)
console.log("5" + undefined); // "5undefined" (undefined converted to string)
console.log("5" - undefined); // NaN (undefined cannot be converted to number)
console.log(10 / "2");        // 5 (string "2" converted to number)

/* Boolean Coercion */
console.log(5 + true);        // 6 (true converted to 1)
console.log(5 + false);       // 5 (false converted to 0)
console.log("5" == 5);        // true (string converted to number)
console.log("true" == true);  // false (no meaningful conversion)

/* Equality vs. Strict Equality */
console.log(5 == "5");            // true (string converted to number)
console.log(5 === "5");           // false (no coercion)
console.log(null == undefined);   // true (special coercion rule)
console.log(null === undefined);  // false (strict equality, no coercion)

/* Logical Operations */
console.log(null || "default");   // "default" (null is falsy)
console.log(0 && "value");        // 0 (0 is falsy, short-circuits)
console.log(1 && "value");        // "value" (1 is truthy)

/* Objects and Type Coercion */
console.log({} + []);             // "[object Object]" (toString of {})
console.log([] + []);             // "" (empty strings concatenated)
console.log([] == 0);             // true (empty array converted to number)

/* Unary Operators */
console.log(+"5");                // 5 (string converted to number)
console.log(+true);               // 1 (true converted to number)
console.log(+null);               // 0 (null converted to number)
console.log(+undefined);          // NaN (undefined cannot be converted to a number)
console.log(+{});                 // NaN (empty object cannot be converted to a number)
console.log(+[]);                 // 0 (empty array converted to number)


/*Manual Type Conversion*/

let num = Number("42");           // Convert string to number
// Here we are manually converting the string `"42"` to the number `42`. If the string can't be converted to a valid number, it will return `NaN`.

let str = String(42);             // Convert number to string
// This converts the number `42` to the string `"42"`.

let bool = Boolean(1);            // Convert to boolean
// The `Boolean` constructor converts any truthy value to `true`, and any falsy value (like `0`, `""`, `null`, `undefined`, or `NaN`) to `false`.
// Here, `1` is truthy, so `bool` will be `true`.


/*VARIABLE SCOPE AND HOISTING*/

/*Scope Levels*/

let globalVar = "I'm global";    // Global scope - accessible everywhere
// A variable declared outside any function or block is globally scoped, meaning it can be accessed anywhere in the code.

function scopeDemo() {
    let functionVar = "I'm function-scoped";    // Function scope
    // This variable is declared inside a function and is accessible only within that function.

    if (true) {
        let blockVar = "I'm block-scoped";      // Block scope
        // This variable is declared inside a block and is accessible only within that block.

        var notBlockVar = "I'm not block-scoped"; // Function scope (var)
        // Even though `notBlockVar` is declared inside a block, it is function-scoped because it was declared using `var`.
    }
    // console.log(blockVar);  // Error! blockVar is not defined
    console.log(notBlockVar); // Works! Accessible due to var
}


/*Hoisting Behavior*/


/* Hoisting with var **/
console.log(a);  // undefined (var is hoisted, but initialization happens later)
var a = 5;
console.log(a);  // 5 (a is now initialized)

/* Hoisting with let and const **/
console.log(b);  // ReferenceError: Cannot access 'b' before initialization (let/const are hoisted but not initialized)
let b = 10;

console.log(c);  // ReferenceError: Cannot access 'c' before initialization (const also hoisted but not initialized)
const c = 20;

/* Hoisting with Function Declarations **/
console.log(foo());  // "Hello, World!" (function declaration is hoisted with its definition)
function foo() {
    return "Hello, World!";
}

/* Hoisting with Function Expressions **/
console.log(bar());  // TypeError: bar is not a function (only the variable declaration is hoisted, not the function body)
var bar = function() {
    return "Hello, World!";
};

/* Hoisting in Loops **/
for (let i = 0; i < 3; i++) {
    console.log(i);  // Outputs 0, 1, 2 (let creates a new variable for each iteration)
}
/*imp: whats the value of j */
for (var j = 0; j < 3; j++) {
    console.log(j);  // Outputs 0, 1, 2 (var is hoisted and accessible outside the loop)
}
console.log(j);  // Outputs 3 (var is function-scoped, so it is accessible outside the loop)

/* Key Takeaways

1. var: Hoisted and initialized to undefined.
2. let and const: Hoisted but not initialized (temporal dead zone).
3. Function declarations are fully hoisted.
4. Function expressions only hoist the variable, not the function body.
5. let and const have block scope, var has function/global scope.
*/

/*MODERN JAVASCRIPT FEATURES*/

/*Destructuring Assignment*/

const user = { name: "John", age: 30 }; // Object destructuring
const { name, age } = user;             // Extract properties into variables
// Destructuring allows you to unpack values from arrays or objects into separate variables. Here, the `name` and `age` properties are extracted from the `user` object.
console.log( name, age); // John 30
console.log( user.name ); // John

const colors = ["red", "green", "blue"]; // Array destructuring
const [primary, secondary] = colors;    // Extract values
// In array destructuring, the first value of the array is assigned to `primary`, and the second to `secondary`.
console.log( colors); // [ 'red', 'green', 'blue' ]
console.log( primary ); // red
console.log( secondary ); // green

/*Spread Operator*/

const numbers = [1, 2, 3];
const moreNumbers = [...numbers, 4, 5];  // Spread array elements into a new array
// The spread operator (`...`) allows you to copy all elements from one array into a new array. It can also be used with objects to copy properties.

const obj = { key: "value" };
const newObj = { ...obj, additionalKey: "newValue" }; // Spread object properties
// In objects, the spread operator copies all properties of the original object and allows you to add new properties.


/*Template Literals*/

const userName = "John";
const greeting = `Hello ${userName}!`;    // String interpolation with template literals
// Template literals are used to embed expressions inside strings using `${}`. This makes string concatenation simpler and more readable.


/*Optional Chaining*/

const data = {
    details: {
        address: null
    }
};
console.log(data?.details?.address?.street);  // undefined instead of error
// Optional chaining (`?.`) allows you to safely access deeply nested properties in objects. If any part of the chain is `null` or `undefined`, it returns `undefined` rather than throwing an error.


/*COMMON PITFALLS AND GOTCHAS*/

/*
{} -> NAN (empty object cannot be converted to a number)
[] -> 0(empty array converted to number)
true -> 1
null -> 0
*/

/*Type Coercion Issues*/

console.log([] + {});          // "[object Object]" - Array converted to string
// An array (`[]`) and an object (`{}`) are coerced to their string representations, resulting in `[object Object]`.

console.log([] + []);          // "" (empty string)
// Two empty arrays are coerced into empty strings and concatenated together, producing an empty string.

console.log({} + []);          // 0 (quirk in some browsers)
// This case can return `0` in some environments, depending on how JavaScript handles the empty object and array.


/*Number Precision*/

let decimal = 0.1 + 0.2;       // 0.30000000000000004 (floating-point precision issue)
console.log(decimal === 0.3);  // false
// JavaScript cannot accurately represent some decimal numbers in binary floating point, leading to precision errors like this one.


/*Const Mutation*/

const arr = [1, 2, 3];
arr.push(4);                   // Valid! Arrays are mutable
// Even though `arr` is declared with `const`, it is still mutable. You can modify the contents of the array, but you cannot reassign `arr` to a new array.

