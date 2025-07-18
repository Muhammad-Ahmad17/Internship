/*=================== FOR EACH ===================*/
// USE TO DO X OPERATION ON ARRAY WITHOUT PASSING INDEX SEPARATELY EACH TIME
// X OPERATIONS ARE :
/*PRINT*/
let array = [1, 2, 3];
array.forEach((item) => {
    console.log(item);
})
/*UPPER AND LOWER CASE*/
let arr = ["ahmad" , "noor" , "hoor"];
arr.forEach((item) => {
    console.log(item.toUpperCase()
    );
})
/*SQUARING*/
// simple method
let arr1 = [1, 2, 3 , 4, 5, 6, 7, 8, 9];
arr1.forEach((item) => {
    console.log("square of " + item + " : " + item*item);
})
// call back function
let square = (a) =>{
    return a*a;
}
arr1.forEach((item) => {
    console.log(square(item));
})
/* VALUE , INDEX , ARRAY */
let a = [1,2,3,4,5];
a.forEach((value, index, array) => {
    console.log(value, index, array);
});
/*=================== MAP ===================*/
// SAME AS FOR EACH BUT IT RETURNS IN NEW ARRAY && IF APLLY FILTER LOGIC IT RETURN BOOLEAN ARRAY
let arr2 = [1, 2, 3 , 4];
let newArray = arr2.map((item) => {
    return (square(item));
})
console.log(arr2);
console.log(newArray);
/*=================== FILTER ===================*/

let arr3 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let newArray1 = arr3.filter((item) => {
    return  item % 2 === 0;
})
console.log(arr3);
console.log(newArray1);
/*=================== REDUCE ===================*/
// REDUCE ARRAY TO SINGLE VARIABLE
let arr4 = [1, 2, 3, 4];
/*SUM*/
const sum = arr4.reduce((a, b) => a + b);
console.log("Sum of array : " + sum);
/*LARGEST*/
const largest = arr4.reduce((a, b) => {
    return a > b ? a : b;
});
console.log("Largest in array : " + largest);


/*=================== QUIZ ===================*/
let marks = [98,80,82,91,68];
let filteredMarks = marks.filter(mark => {
    return mark > 90;
})
console.log("90+ Marks : " , filteredMarks);
/*=================== ARRAY.FROM ===================*/
// Creates a new Array from array-like or iterable objects

// From String
let str = "hello";
let chars = Array.from(str);
console.log(chars); // ['h', 'e', 'l', 'l', 'o']

// From Set
let set = new Set([1, 2, 2, 3, 4]);
let uniqueArr = Array.from(set);
console.log(uniqueArr); // [1, 2, 3, 4]

// With mapping function
let numbers = Array.from([1, 2, 3], x => x * 2);
console.log(numbers); // [2, 4, 6]

/*deep shallow copy*/