/*====================== STRATEGY PATTERN ======================*/
// Defines a family of algorithms and makes them interchangeable

class PaymentStrategy {
    pay(amount) {
        throw new Error('pay() must be implemented');
    }
}

class CreditCardStrategy extends PaymentStrategy {
    pay(amount) {
        return `Paid ${amount} using Credit Card`;
    }
}

class PayPalStrategy extends PaymentStrategy {
    pay(amount) {
        return `Paid ${amount} using PayPal`;
    }
}

class ShoppingCart {
    constructor(paymentStrategy) {
        this.paymentStrategy = paymentStrategy;
    }

    checkout(amount) {
        return this.paymentStrategy.pay(amount);
    }
}

module.exports = { CreditCardStrategy, PayPalStrategy, ShoppingCart }; 