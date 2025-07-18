/* *****************************************
 * 🌟 STRING MANIPULATION IN JAVASCRIPT 🌟
 ******************************************/

/* *****************************************
 * 📝 DECLARING STRINGS
 ******************************************/
let str1 = "Hello, World!";  // Double quotes
let str2 = 'JavaScript';     // Single quotes
let str3 = `Template literals`; // Backticks for template literals

/* *****************************************
 * 📌 STRING PROPERTIES (one and only one)
 ******************************************/
let text1 = "JavaScript";
console.log(text1.length);  // Output: 10

/* *****************************************
 * 📌 ACCESSING CHARACTERS
 ******************************************/
console.log(text1[0]);        // Output: J
console.log(text1.charAt(4)); // Output: S

/* *****************************************
 * 📌 STRING METHODS (JavaScript)
 * A complete reference with examples and explanations
 ******************************************/

const text = "JavaScript is awesome!";

/* ------------------------------
 * 2. 🔠 Case Transformation
 * ------------------------------ */
console.log(text.toUpperCase()); 
// ➝ "JAVASCRIPT IS AWESOME!"

console.log(text.toLowerCase()); 
// ➝ "javascript is awesome!"

/* ------------------------------
 * 3. 🔍 Searching in Strings
 * ------------------------------ */
console.log(text.includes("awesome")); 
// ➝ true (checks if substring exists)

console.log(text.startsWith("Java")); 
// ➝ true (checks if string starts with "Java")

console.log(text.endsWith("!")); 
// ➝ true (checks if string ends with "!")

console.log(text.indexOf("is")); 
// ➝ 11 (first occurrence)

console.log(text.lastIndexOf("a")); 
// ➝ 3 (last occurrence)

/* ------------------------------
 * 4. 🔎 Character Inspection
 * ------------------------------ */
console.log(text.charAt(0)); 
// ➝ "J" (character at index 0)

console.log(text.charCodeAt(0)); 
// ➝ 74 (Unicode of "J")

console.log(text[1]); 
// ➝ "a" (bracket notation alternative)

/* ------------------------------
 * 5. ✂️ Extracting Substrings
 * ------------------------------ */
console.log(text.slice(0, 10)); 
// ➝ "JavaScript" (from 0 to 9)

console.log(text.substring(0, 4)); 
// ➝ "Java" (similar to slice but no negatives)

console.log(text.substr(0, 4)); 
// ➝ "Java" (start + length) — ❗ deprecated

/* ------------------------------
 * 6. ✏️ Replacing Substrings
 * ------------------------------ */
console.log(text.replace("awesome", "powerful")); 
// ➝ "JavaScript is powerful!"

console.log("aaa".replaceAll("a", "*")); 
// ➝ "***" (replaces all occurrences)

/* ------------------------------
 * 7. 📤 Splitting and Joining
 * ------------------------------ */
console.log(text.split(" ")); 
// ➝ ["JavaScript", "is", "awesome!"] (split into array)

console.log("Hello".concat(" World")); 
// ➝ "Hello World" (joins strings)

console.log("Hi".repeat(3)); 
// ➝ "HiHiHi" (repeats string)

let fruitArray = ["Apple", "Banana", "Cherry"];
let joinedFruits = fruitArray.join(" - ");
console.log(joinedFruits);  // Output: Apple - Banana - Cherry


/* ------------------------------
 * 8. ✨ Trimming & Padding
 * ------------------------------ */
console.log("  Hello  ".trim()); 
// ➝ "Hello" (removes whitespace)

console.log("  Hello".trimStart()); 
// ➝ "Hello"

console.log("Hello  ".trimEnd()); 
// ➝ "Hello"

console.log("5".padStart(3, "0")); 
// ➝ "005"

console.log("5".padEnd(3, "-")); 
// ➝ "5--"

/* ------------------------------
 * 🧠 BONUS TIPS
 * ------------------------------ */
// Strings are immutable — methods return new strings
// JavaScript automatically boxes string primitives for method calls

const sample = "Code";
sample[0] = "X";
console.log(sample); // ➝ "Code" (unchanged)

console.log(sample[0]); // ➝ "C" (can read by index)

/* *****************************************
 * 🔹 REPEATING STRINGS
 ******************************************/
let repeatText = "JS ";
console.log(repeatText.repeat(3));  // Output: JS JS JS

/* *****************************************
 * 🔹 STRING INTERPOLATION (TEMPLATE LITERALS)
 ******************************************/
let name = "John";
let greeting = `Hello, ${name}!`;
console.log(greeting);  // Output: Hello, John!

/* *****************************************
 * 🔹 MUTABILITY
 ******************************************/
// Strings in JavaScript are immutable.
// This means you cannot change characters in a string directly.

let immutableStr = "JavaScript";
immutableStr[0] = "j"; // This does nothing!

console.log(immutableStr); // Output: JavaScript

// To "change" a string, you must create a new one:
let newStr = "j" + immutableStr.slice(1);
console.log(newStr); // Output: javascript


/* *****************************************
 * 🔹 HANDLING SPECIAL CHARACTERS
 ******************************************/
let specialChars = "Hello\nWorld!";
console.log(specialChars);
// Output:
// Hello
// World!

/* *****************************************
 * 🔹 CONVERTING DATA TO STRINGS
 ******************************************/
let number = 123;
console.log(number.toString());  // Output: "123"
console.log(String(true));       // Output: "true"

/* *****************************************
 * 🛠 PRACTICAL EXAMPLES OF STRING MANIPULATION
 ******************************************/

/* *****************************************
 * ✅ 1. REVERSING A STRING
 ******************************************/
function reverseString(str) {
    return str.split("").reverse().join("");
}
console.log(reverseString("JavaScript"));  // Output: tpircSavaJ

/* *****************************************
 * ✅ 2. CHECKING FOR PALINDROME
 ******************************************/
function isPalindrome(str) {
    let reversed = str.split("").reverse().join("");
    return str === reversed;
}
console.log(isPalindrome("madam"));  // Output: true
console.log(isPalindrome("hello"));  // Output: false

/* *****************************************
 * ✅ 3. COUNTING VOWELS
 ******************************************/
function countVowels(str) {
    let vowels = "aeiouAEIOU";
    let count = 0;
    str.split('').forEach(char => {
        if (vowels.includes(char)) {
            count++;
        }
    });
    return count;
}
console.log(countVowels("JavaScript"));  // Output: 3

/* *****************************************
 * ✅ 4. FINDING A SUBSTRING
 ******************************************/
function findSubstring(text, substring) {
    return text.includes(substring);
}
console.log(findSubstring("Hello, World!", "World"));  // Output: true
console.log(findSubstring("Hello, World!", "Java"));   // Output: false

/* *****************************************
 * ✅ 5. CAPITALIZING THE FIRST LETTER OF A STRING
 ******************************************/
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
console.log(capitalizeFirstLetter("hello"));  // Output: Hello

/* *****************************************
 * ✅ 6. CONVERTING A SENTENCE TO TITLE CASE
 ******************************************/
function makeHeading (str){
	return str.
			split (" ")
			.map (word=>word[0].toUpperCase() + word.slice(1).toLowerCase())
			.join (" ")

}

console.log(makeHeading("mY nAMe is AhMaD"))

/* *****************************************
 * ✅ 7. REMOVING WHITESPACES FROM A STRING
 ******************************************/
function removeWhitespaces(str) {
    return str.replace(/\s+/g, "");
}
console.log(removeWhitespaces("  Hello   World!  "));  // Output: HelloWorld!

/* *****************************************
 * ✅ 8. COUNTING THE OCCURRENCE OF A CHARACTER
 ******************************************/
function countCharacterOccurrence(str, char) {
    let count = 0;
    for (let c of str) {
        if (c === char) {
            count++;
        }
    }
    return count;
}
console.log(countCharacterOccurrence("JavaScript", "a"));  // Output: 2

/* *****************************************
 * ✅ 9. FINDING THE LONGEST WORD IN A SENTENCE
 ******************************************/
function findLongestWord(sentence) {
    let words = sentence.split(" ");
    let longest = words[0];
    for (let word of words) {
        if (word.length > longest.length) {
            longest = word;
        }
    }
    return longest;
}
console.log(findLongestWord("I love JavaScript programming"));  // Output: programming

/* *****************************************
 * ✅ 10. CHECKING IF A STRING IS A NUMBER
 ******************************************/
function isNumber(str) {
    return !isNaN(str);
}
console.log(isNumber("12345"));  // Output: true
console.log(isNumber("JavaScript"));  // Output: false

/* *****************************************
 * ✅ 11. FINDING THE FIRST NON-REPEATING CHARACTER IN A STRING
 ******************************************/
function findFirstNonRepeatingChar(str) {
    let charCount = {};
    for (let char of str) {
        charCount[char] = (charCount[char] || 0) + 1;
    }
    for (let char of str) {
        if (charCount[char] === 1) {
            return char;
        }
    }
    return null; // If no non-repeating character is found  
}

/* *****************************************
 * ✅ 12. CHECKING IF A STRING IS AN ANAGRAM
 ******************************************/
function isAnagram(str1, str2) {
    const normalize = str => str.toLowerCase().split("").sort().join("");
    return normalize(str1) === normalize(str2);
}
console.log(isAnagram("listen", "silent"));  // Output: true
console.log(isAnagram("hello", "world"));    // Output: false

/* *****************************************
 * ✅ 13. FINDING ALL UNIQUE CHARACTERS IN A STRING
 ******************************************/
function findUniqueChars(str) {
    let uniqueChars = new Set();
    for (let char of str) {
        uniqueChars.add(char);
    }
    return Array.from(uniqueChars).join("");    
}

/* *****************************************
 * ✅ 14. CHECKING IF A STRING CONTAINS ONLY DIGITS
 ******************************************/
function containsOnlyDigits(str) {
    return /^\d+$/.test(str);
}
console.log(containsOnlyDigits("12345"));  // Output: true
console.log(containsOnlyDigits("JavaScript"));  // Output: false

/* *****************************************
 * ✅ 15. FINDING THE REPEATED CHARACTER IN A STRING
    ******************************************/
function findRepeatedCharacter(str) {
    let charCount = {}; 
    for (let char of str) {
        charCount[char] = (charCount[char] || 0) + 1;
    }
    for (let char in charCount) {
        if (charCount[char] > 1) {
            return char;
        }
    }
    return null;
    }
console.log(findRepeatedCharacter("JavaScript"));  // Output: a (or any other repeated character)
/* *****************************************
 * ✅ 16. CHECKING IF A STRING IS A VALID EMAIL
 ******************************************/
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}
console.log(isValidEmail("T2m0O@example.com"));  // Output: true
console.log(isValidEmail("invalid-email"));      // Output: false

