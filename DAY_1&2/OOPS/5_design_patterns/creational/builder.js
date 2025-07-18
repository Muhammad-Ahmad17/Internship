/*====================== BUILDER PATTERN ======================*/
// Constructs complex objects step by step

class Pizza {
    constructor() {
        this.toppings = [];
    }
}

class PizzaBuilder {
    constructor() {
        this.pizza = new Pizza();
    }

    addCheese() {
        this.pizza.toppings.push('cheese');
        return this;
    }

    addPepperoni() {
        this.pizza.toppings.push('pepperoni');
        return this;
    }

    addVegetables() {
        this.pizza.toppings.push('vegetables');
        return this;
    }

    build() {
        return this.pizza;
    }
}

module.exports = PizzaBuilder; 