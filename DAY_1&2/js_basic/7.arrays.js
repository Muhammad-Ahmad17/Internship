/* Arrays in JavaScript */

/* Creating Arrays */
// Using array literals
const numbers = [1, 2, 3, 4, 5];

// Using the Array constructor
const fruitsConstructor = new Array('Apple', 'Banana', 'Orange');

/* Accessing Array Elements */
const fruitsArray = ['Apple', 'Banana', 'Orange'];
console.log(fruitsArray[0]); // Output: Apple

/* Common Array Methods */
const fruitsList = ['Apple', 'Banana'];

// Adding an element to the end
fruitsList.push('Orange');

// Removing the last element
fruitsList.pop();

// Adding an element to the beginning
fruitsList.unshift('Grapes');

// Removing the first element
fruitsList.shift();

/* Finding Elements in an Array */
const index = fruitsList.indexOf('Banana'); // 1
const exists = fruitsList.includes('Apple'); // true

/* Iterating Over an Array */
const numbersArray = [1, 2, 3, 4, 5];
numbersArray.forEach(num => {
    console.log(num);
});

/* Advanced Array Methods */

// map() - Returns a new array after applying a function
const doubledNumbers = numbersArray.map(x => x * 2);
console.log(doubledNumbers); // [2, 4, 6, 8, 10]

// filter() - Returns a new array with elements that pass a condition
const filteredNumbers = numbersArray.filter(x => x > 2);
console.log(filteredNumbers); // [3, 4, 5]

// reduce() - Reduces the array to a single value
const sum = numbersArray.reduce((acc, curr) => acc + curr, 0);
console.log(sum); // 15

/* Sorting Arrays */
const fruitsSorting = ['Banana', 'Apple', 'Orange'];

// Sorting alphabetically
fruitsSorting.sort();
console.log(fruitsSorting); // ['Apple', 'Banana', 'Orange']

// Sorting numerically
const numberSorting = [40, 100, 1, 5, 25, 10];
numberSorting.sort((a, b) => a - b);
console.log(numberSorting); // [1, 5, 10, 25, 40, 100]

/* Converting Arrays to Strings */
const fruitsToString = ['Apple', 'Banana', 'Orange'];

// Using join()
const resultJoin = fruitsToString.join(', ');
console.log(resultJoin); // "Apple, Banana, Orange"

// Using toString()
const resultToString = fruitsToString.toString();
console.log(resultToString); // "Apple,Banana,Orange"

/* Multidimensional Arrays (2D Arrays) */
const matrix = [
    [1, 2, 3],
    [4, 5, 6],//
    [7, 8, 9]
];
console.log(matrix[1][2]);  Output: 6

/* Using the include() Method */
// The include() method checks if an array contains a specific value.
const colors = ['red', 'green', 'blue'];

// Application: Checking if a color exists in the array
if (colors.includes('green')) {
    console.log('Green is in the array');
} else {
    console.log('Green is not in the array');
}

// Example with numbers
const numArray = [10, 20, 30, 40, 50];
console.log(numArray.includes(20)); // true
console.log(numArray.includes(60)); // false

/* Using slice() Method */
const fruitsSlice = ['Apple', 'Banana', 'Orange', 'Mango'];
const slicedFruitsExample = fruitsSlice.slice(1, 3);
console.log(slicedFruitsExample); // ['Banana', 'Orange']

/* Using splice() Method */
// change in orignal
const fruitsSplice = ['Apple', 'Banana', 'Orange'];
fruitsSplice.splice(1, 1, 'Mango');
console.log(fruitsSplice); // ['Apple', 'Mango', 'Orange']

/**
 * slice vs splice in JavaScript
 *
 * In JavaScript, `slice` and `splice` are both used to manipulate arrays,
 * but they serve different purposes and behave differently.
 */

/*
 * slice
 * Purpose: Used to extract a portion of an array without modifying the original array.
 *
 * Syntax:
 * array.slice(start, end)
 *
 * - start: The index where the extraction begins (inclusive).
 * - end: The index where the extraction ends (exclusive). If omitted, it extracts until the end of the array.
 *
 * Returns: A new array with the extracted elements.
 *
 * Does not modify the original array.
 */

// Example: Using slice
let fruitsDemo = ["apple", "banana", "cherry", "date"];
let slicedFruitsDemo = fruitsDemo.slice(1, 3);
console.log(slicedFruitsDemo); // ["banana", "cherry"]
console.log(fruitsDemo);       // ["apple", "banana", "cherry", "date"]

/*
 * splice
 * Purpose: Used to add, remove, or replace elements in an array by modifying the original array.
 *
 * Syntax:
 * array.splice(start, deleteCount, item1, item2, ...)
 *
 * - start: The index where changes begin.
 * - deleteCount: The number of elements to remove starting from `start`.
 * - item1, item2, ... (optional): Elements to add at the `start` index.
 *
 * Returns: An array of removed elements (if any).
 *
 * Modifies the original array.
 */

// Example 1: Removing Elements
let fruits1 = ["apple", "banana", "cherry", "date"];
let removedFruits = fruits1.splice(1, 2); // Remove 2 elements starting from index 1
console.log(removedFruits); // ["banana", "cherry"]
console.log(fruits1);       // ["apple", "date"]

// Example 2: Adding Elements
let fruits2 = ["apple", "date"];
fruits2.splice(1, 0, "banana", "cherry"); // Add "banana" and "cherry" at index 1
console.log(fruits2); // ["apple", "banana", "cherry", "date"]

// Example 3: Replacing Elements
let fruits3 = ["apple", "banana", "cherry"];
fruits3.splice(1, 1, "date"); // Replace 1 element at index 1 with "date"
console.log(fruits3); // ["apple", "date", "cherry"]

/*
 * Key Differences:
 *
 * Feature              slice                          splice
 * -----------------------------------------------------------
 * Purpose              Extracts a portion of the array   Modifies the array by adding/removing/replacing elements
 * Original Array       Not modified,                     Modified
 * Return Value         New array                        Removed elements (if any)
 * Parameters           Start and optional end indices   Start index, delete count, and optional items to add
 */


/* Using concat() Method */
const tropicalFruits = ['Pineapple', 'Mango'];
const combinedFruits = fruitsConstructor.concat(tropicalFruits);
console.log(combinedFruits); // ['Apple', 'Banana', 'Orange', 'Pineapple', 'Mango']

/* Using join() Method */
const fruitsJoin = ['Apple', 'Banana', 'Orange'];
const joinedFruits = fruitsJoin.join(', ');
console.log(joinedFruits); // "Apple, Banana, Orange"

/* Using reverse() Method */
const fruitsReverse = ['Apple', 'Banana', 'Orange'];
fruitsReverse.reverse();
console.log(fruitsReverse); // ['Orange', 'Banana', 'Apple']