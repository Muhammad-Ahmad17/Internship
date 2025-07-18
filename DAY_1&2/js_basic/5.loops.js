/* FOR LOOP */
{
    /* 1. Declaration & Usage */
    for (let i = 0; i < 5; i++) {
        console.log("For loop:", i);
    }

    /* 2. Typical use case */
    // Iterating over arrays
    let arr = ["a", "b", "c"];
    for (let i = 0; i < arr.length; i++) {
        console.log(arr[i]);
    }
}

/* WHILE LOOP */
{
    /* 1. Declaration & Usage */
    let count = 0;
    while (count < 3) {
        console.log("While loop:", count);
        count++;
    }

    /* 2. Typical use case */
    // Looping until a condition is false
    let num = 5;
    while (num > 0) {
        console.log(num);
        num--;
    }
}

/* DO...WHILE LOOP */
{
    /* 1. Declaration & Usage */
    let i = 0;
    do {
        console.log("Do...while loop:", i);
        i++;
    } while (i < 2);

    /* 2. Difference from while */
    // Executes at least once, even if condition is false
    let flag = false;
    do {
        console.log("Runs once even if false");
    } while (flag);
}

/* FOR...OF LOOP */
{
    /* 1. Declaration & Usage */
    let arr = [10, 20, 30];
    for (let value of arr) {
        console.log("For...of loop:", value);
    }

    /* 2. Typical use case */
    // Iterating over iterable objects (arrays, strings)
    let str = "abc";
    for (let char of str) {
        console.log(char);
    }
}

/* FOR...IN LOOP */
{
    /* 1. Declaration & Usage */
    let obj = { x: 1, y: 2 };
    for (let key in obj) {
        console.log("For...in loop:", key, obj[key]);
    }

    /* 2. Typical use case */
    // Iterating over object properties
    let person = { name: "Ali", age: 25 };
    for (let prop in person) {
        console.log(prop, person[prop]);
    }
}

/* BREAK & CONTINUE */
{
    /* 1. break */
    for (let i = 0; i < 5; i++) {
        if (i === 3) break;
        console.log("Break at 3:", i);
    }

    /* 2. continue */
    for (let i = 0; i < 5; i++) {
        if (i % 2 === 0) continue;
        console.log("Continue skips even:", i);
    }
}