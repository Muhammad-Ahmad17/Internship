/*FUNCTIONS IN JAVASCRIPT*/
/*Function Declarations*/
function factorial1(n) {
    if (n <= 1) return 1;
    return n * factorial1(n - 1);
}
// Common Use: Widely used for defining named functions, especially in modules, libraries, and for code that prioritizes readability.
// Hoisting: Can be called before it's defined in the code because of hoisting.
// When to use: When defining utility functions, APIs, or named functions in your scripts.

/*Function Expressions*/
const factorial = function (n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
};
// Common Use: Preferred in cases where functions are assigned to variables or passed as arguments.
// Hoisting: Not hoisted, so they cannot be called before the function is defined.
// When to use: When you need a more modular, flexible approach or want to encapsulate functions in variables.

/*Arrow Functions*/
const factorialArrow = (n) => (n <= 1 ? 1 : n * factorialArrow(n - 1));
// Common Use: Preferred for inline callbacks, short utility functions, and when 'this' binding is not required.
// Hoisting: Not hoisted, similar to function expressions.
// Limitations: Cannot be used as constructors and lack their own 'this', 'arguments', or 'super' bindings.
// When to use: For short, clean, functional-style programming or in modern JavaScript codebases.


/*Default Parameters*/
function greet(name = 'Guest') {
    return `Hello, ${name}!`;
}
// Common Use: Useful when providing default values for parameters, so you don’t have to check for undefined.
// Hoisting: Default parameters are hoisted, but only the parameter definition (not the actual value assignment).
// When to use: When you want to ensure a parameter has a default value when not passed.

// Example of default parameter usage
console.log(greet()); // Output: "Hello, Guest!"
console.log(greet('John')); // Output: "Hello, John!"

/*Function Scope & Closures*/

function outer() {
    let outerVar = 'I am from outer scope';
    return function inner() {
        console.log(outerVar);
    };
}
const closureFunction = outer();
closureFunction(); // Output: "I am from outer scope"
// Common Use: Useful for data encapsulation and creating functions that have access to their lexical scope even after the outer function has executed.
// Hoisting: The inner function is not hoisted, but its scope can still access variables from the outer function.
// When to use: When you need to retain access to variables from an outer function in another context.


// Example of function scope
let globalVar = 'I am global';

function scopeExample() {
    let localVar = 'I am local';
    console.log(globalVar); // Accessible
    console.log(localVar);  // Accessible
}

scopeExample();
// console.log(localVar); // Error: localVar is not defined in global scope

/*Understanding this in Functions*/
function regularFunction() {
    console.log(this);
}
regularFunction(); // 'this' refers to the global object (or undefined in strict mode)

const person = {
    name: 'Alice',
    greet: function() {
        console.log(`Hello, ${this.name}`);
    }
};
person.greet(); // 'this' refers to the person object

const arrowPerson = {
    name: 'Bob',
    greet: () => {
        console.log(`Hello, ${this.name}`); // 'this' is lexically bound and doesn't refer to arrowPerson
    }
};
arrowPerson.greet(); // Output: "Hello, undefined" because 'this' doesn't refer to arrowPerson

// Arrow functions have a different behavior for 'this' – they inherit it from the outer context.

// Example of using 'this' in an event listener
const button = document.createElement('button');
button.innerText = 'Click me';
document.body.appendChild(button);

button.addEventListener('click', function() {
    console.log(this); // 'this' refers to the button element
});

// Arrow function in an event listener
button.addEventListener('click', () => {
    console.log(this); // 'this' refers to the outer context (window, in browsers)
});
