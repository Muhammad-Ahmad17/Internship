/*====================== PROTOTYPES ======================*/
// JavaScript's inheritance mechanism

// Base Object
function Animal(name) {
    this.name = name;
}

Animal.prototype.makeSound = function() {
    return "Some sound";
};

// Inheritance
function Dog(name) {
    Animal.call(this, name);
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
    return "Woof!";
};

module.exports = { Animal, Dog }; 