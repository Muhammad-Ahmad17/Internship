/* Objects in JavaScript */

/* Creating an Object */
const person = {
    firstName: 'John',
    lastName: 'Doe',
    age: 30,
    hobbies: ['reading', 'traveling'],
    address: {
        street: '123 Main St',
        city: 'New York',
        country: 'USA'
    },
    greet: function() {
        console.log(`Hello, my name is ${this.firstName} ${this.lastName}`);
    }
};

/* Accessing Object Properties */
console.log(person.firstName); // John
console.log(person['lastName']); // Doe
console.log(person.address.city); // New York

/* Adding and Updating Properties */
person.email = 'john.doe@example.com';
console.log(person.email); // john.doe@example.com
person.age = 31;
console.log(person.age); // 31

/* Deleting Properties */
delete person.hobbies;
console.log(person.hobbies); // undefined

/* Methods in Objects */
person.greet(); // Hello, my name is John Doe

/* Looping Through Objects */
for (let key in person) {
    console.log(`${key}: ${person[key]}`);
}

/* Object.keys() - Returns an array of keys */
console.log(Object.keys(person));

/* Object.values() - Returns an array of values */
console.log(Object.values(person));

/* Object.entries() - Returns an array of key-value pairs */
console.log(Object.entries(person));

/* Entinty {key: value} */

/* Checking Property Existence */
console.log('age' in person); // true
console.log('hobbies' in person); // false

/* Copying Objects */

/* 
📘 One-Shot: Shallow vs Deep Copy in JavaScript

🔹 1. Data Types Overview
   - Primitives (string, number, boolean, null, undefined, symbol, bigint):
     → Stored and compared by **value**
   - Reference types (object, array, function, Date, etc.):
     → Stored and compared by **reference**

🔹 2. What is a Copy?
   - A way to duplicate data from one variable to another.
   - The nature of the copy depends on **how deeply** data is duplicated.

────────────────────────────────────────────

🔹 3. Shallow Copy

✅ Behavior:
   - Copies only **top-level properties**
   - Nested objects/arrays are copied **by reference**
   - Functions are preserved (copied by reference)
   - Changes to nested objects in the copied object **affect the original**

📌 Example:
const original = {
  name: "Ahmad",
  address: { city: "Lahore" },
  greet: () => "Hello"
};

const shallow = { ...original };
shallow.name = "Ali";                     // ✅ original.name unaffected
shallow.address.city = "Karachi";         // ❌ original.address.city is changed
shallow.greet === original.greet;         // ✅ true (same function)

📎 Common Methods:
   - `Object.assign({}, obj)`
   - Spread syntax `{ ...obj }`

────────────────────────────────────────────

🔹 4. Deep Copy

✅ Behavior:
   - Recursively copies **all nested structures**
   - Original and copy are completely independent
   - Changes in the copied object **do NOT affect** the original
   - Functions and certain special types are **not supported** in most methods

📌 Example using structuredClone():
const original = {
  name: "Ahmad",
  created: new Date(),
  info: { score: 90 }
};

const copy = structuredClone(original);
copy.name = "Ali";                        // ✅ original.name remains "Ahmad"
copy.info.score = 100;                    // ✅ original.info.score remains 90
copy.created === original.created;        // ❌ false (different Date objects)
copy.created.getTime() === original.created.getTime(); // ✅ true

📎 Common Methods:
   - `structuredClone(obj)` → ✅ modern, supports Date, Map, Set
   - `JSON.parse(JSON.stringify(obj))` → ❌ loses functions, Dates, undefined
   - `_.cloneDeep(obj)` → ✅ full deep copy, including functions (via Lodash)

────────────────────────────────────────────

🔹 5. Function Preservation

- `structuredClone()` → ❌ **throws error** if a function exists
- `JSON.stringify()` → ❌ silently **removes functions**
- `_.cloneDeep()` → ✅ keeps functions (by reference)

✅ Safe workaround:
const { greet, ...safeObject } = original;
const copy = structuredClone(safeObject);
copy.greet = greet;

────────────────────────────────────────────

🔹 6. Comparison Summary

| Feature                       | Shallow Copy        | Deep Copy                   |
|------------------------------|---------------------|-----------------------------|
| Copies top-level properties  | ✅ Yes              | ✅ Yes                       |
| Copies nested objects        | ❌ Reference shared | ✅ Fully cloned              |
| Affects original if nested   | ✅ Yes              | ❌ No                        |
| Functions supported          | ✅ Yes              | ❌ No (unless using lodash)  |
| Date/Map/Set support         | ✅ Reference only   | ✅ (via structuredClone)     |
| Circular refs supported      | ❌ No               | ✅ structuredClone only      |
| Performance                  | 🔋 Fast             | 🧠 Slower (more processing)  |
| Suitable for flat objects    | ✅ Yes              | ✅ Yes                       |
| Suitable for complex objects | ❌ Risky            | ✅ Safe                      |

────────────────────────────────────────────

🔹 7. Checking Equality

- Primitives:
  `"Ahmad" === "Ahmad"` → ✅ true (value)
- Reference types:
  `copy.address === original.address` → ❌ false (if deep copy)
  `copy.created === original.created` → ❌ false
  `copy.created.getTime() === original.created.getTime()` → ✅ true (same value)

────────────────────────────────────────────

✅ Conclusion:
Use **shallow copy** when:
- Your object is flat and doesn't contain nested references.

Use **deep copy** when:
- You need to safely duplicate complex/nested data.
- Use `structuredClone()` if you don’t have functions.
- Use `_.cloneDeep()` or custom cloning if you need to preserve functions.
*/



    /* Merging Objects */
    // shallow copy -> spread operator(...)
    const additionalInfo = {
        occupation: 'Developer',
        isMarried: false
    };
    const mergedPerson = { ...person, ...additionalInfo };
    console.log(mergedPerson);

/* Object Destructuring */
// Destructuring is a JavaScript feature that lets you unpack values from 
// objects (or arrays) into separate variables using a concise syntax.

const { firstName, age } = person;
console.log(firstName); // John
console.log(age); // 31

/* Spread Operator with Objects */
const updatedPerson = { ...person, city: 'Los Angeles' };
console.log(updatedPerson);

/* Nested Objects */
const company = {
    //  `primitive attribute`
    name: 'TechCorp',
    // `array of objects`
    employees: [
        {
            name: 'Alice',
            position: 'Developer'
        },
        {
            name: 'Bob',
            position: 'Designer'
        }
    ]
};
console.log(company.employees[1].name); // Bob
