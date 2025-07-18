const isPalindrome = (array , reverseArray) => {
    for (let i = 0; i <= array.length; i++) {
        if (array[i] !== reverseArray[i]) {
            return false;
        }
    }
    return true;
}
const isPalindrome2 = (array) => {
    let ptr1 = 0;
    let ptr2 = array.length - 1;
    while (ptr1 <= ptr2) {
        if(array[ptr1] !== array[ptr2]) {
            return false;
        }
        ptr1++;
        ptr2--;
    }
    return true;
}

const isPalindrome3 = (array) => {
    for (let i = 0; i < array.length / 2; i++) {
        if (array[i] !== array[array.length - 1 - i]) {
            return false;
        }
    }
    return true;
};


const arr = [1 , 2 ,4, 2 , 1];
const reverseArr = [...arr].reverse();  // Copy and reverse the array
//console.log(isPalindrome(arr, reverseArr));  // Output: true
console.log(isPalindrome2(arr));

