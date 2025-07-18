// Negative indices in JavaScript arrays are just object properties, not real array elements.
// They don’t affect array length or standard array operations.
let a = [1, 2, 3, 4];
console.log('Original array:', a);
a[-1] = 9;
console.log('After adding negative index:', a);

// Check array length - negative indices don't affect length
console.log('Array length:', a.length);  // Still shows 4

// Check actual object keys
console.log('All keys:', Object.keys(a));  // Shows ['0', '1', '2', '3', '-1']

// Check if property exists
console.log('Has -1 property:', a.hasOwnProperty('-1'));  // true

// Check if it's a "real" array index
console.log('Is -1 an array index:', Array.prototype.hasOwnProperty.call(a, '-1'));  // true

console.log(Array.isArray(a));

// Create an array
let arr = [1, 2, 3];
console.log('Is array?', Array.isArray(arr));  // true
console.log('Is object?', typeof arr);         // 'object'

// Add negative index
arr[-1] = 9;
console.log('Still array?', Array.isArray(arr));  // still true!
console.log('Still object?', typeof arr);         // still 'object'

// The difference is in how indices are treated:
// Regular indices affect length
arr[3] = 4;
console.log('Length after adding positive index:', arr.length);  // 4

// Negative indices don't affect length
arr[-2] = 8;
console.log('Length after adding negative index:', arr.length);  // still 4

// Both types of properties are accessible
console.log('Regular index value:', arr[3]);    // 4
console.log('Negative index value:', arr[-1]);  // 9
