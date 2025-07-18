/*====================== OBJECTS BASICS ======================*/
// Foundation of OOP in JavaScript

// 1. Object Literals
const person = {
    name: "John",
    age: 30,
    greet() {
        return `Hello, I'm ${this.name}`;
    }
};

// 2. Constructor Functions
function Person(name, age) {
    this.name = name;
    this.age = age;
    this.greet = function() {
        return `Hello, I'm ${this.name}`;
    }
}

// 3. Object.create()
const personProto = {
    greet() {
        return `Hello, I'm ${this.name}`;
    }
};

// Usage Examples
const person1 = new Person("Jane", 25);
const person2 = Object.create(personProto);

module.exports = { Person, personProto }; 