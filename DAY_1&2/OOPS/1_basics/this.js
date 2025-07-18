/*====================== THIS KEYWORD ======================*/
// Understanding 'this' binding in different contexts

// 1. Global Context
console.log(this); // window/global

// 2. Function Context
function regularFunction() {
    console.log(this);
}

// 3. Method Context
const user = {
    name: "John",
    regularMethod: function() {
        console.log(this.name);
    },
    arrowMethod: () => {
        console.log(this.name);
    }
};

// 4. Constructor Context
function Car(brand) {
    this.brand = brand;
    this.getBrand = function() {
        return this.brand;
    }
}

module.exports = { user, Car }; 