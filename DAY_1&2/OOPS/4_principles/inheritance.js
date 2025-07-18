/*====================== INHERITANCE ======================*/
// Code reuse and establishing relationships between classes

class Vehicle {
    constructor(make, model) {
        this.make = make;
        this.model = model;
    }

    getInfo() {
        return `${this.make} ${this.model}`;
    }
}

class Car extends Vehicle {
    constructor(make, model, type) {
        super(make, model);
        this.type = type;
    }

    getInfo() {
        return `${super.getInfo()} - ${this.type}`;
    }
}

module.exports = { Vehicle, Car }; 