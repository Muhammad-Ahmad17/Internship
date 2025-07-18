/*====================== POLYMORPHISM ======================*/
// Ability of objects to take multiple forms

// 1. Method Overriding
class Animal {
    makeSound() {
        return "Some generic sound";
    }
}

class Dog extends Animal {
    makeSound() {
        return "Woof!";
    }
}

class Cat extends Animal {
    makeSound() {
        return "Meow!";
    }
}

// 2. Method Overloading (Simulated in JavaScript)
class Calculator {
    add(a, b, c) {
        if (arguments.length === 2) {
            return a + b;
        } 
        else if (arguments.length === 3) {
            return a + b + c;
        }
    }
}

module.exports = { Animal, Dog, Cat, Calculator }; 