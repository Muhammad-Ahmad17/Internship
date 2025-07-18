const factorial = (n) => n<=1 ? 1 : n * factorial(n - 1);
console.log(`FACTORIAL OF 5 IS ${factorial(5)}`)

function factorial1 (n) {
    //base case
    if(n<=1) return 1;
    //recursive case
    return n * factorial(n - 1);
}
console.log(`FACTORIAL OF 6 IS ${factorial1(6)}`)
