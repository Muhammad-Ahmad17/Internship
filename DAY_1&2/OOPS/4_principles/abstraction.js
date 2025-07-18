/*====================== ABSTRACTION ======================*/
// Hiding complex implementation details and showing only necessary features

// Using Abstract Class (Simulated in JavaScript)
class Database {
    constructor() {
        if (this.constructor === Database) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    connect() {
        throw new Error("Method 'connect()' must be implemented.");
    }

    query() {
        throw new Error("Method 'query()' must be implemented.");
    }

    disconnect() {
        throw new Error("Method 'disconnect()' must be implemented.");
    }
}

// Implementation
class MySQLDatabase extends Database {
    connect() {
        return "Connected to MySQL";
    }

    query(sql) {
        return `Executing MySQL query: ${sql}`;
    }

    disconnect() {
        return "Disconnected from MySQL";
    }
}

// Interface simulation
class PaymentProcessor {
    constructor() {
        this.payment_methods = {
            process_credit_card: (amount) => `Processing ${amount} via Credit Card`,
            process_paypal: (amount) => `Processing ${amount} via PayPal`
        };
    }

    processPayment(method, amount) {
        if (this.payment_methods[method]) {
            return this.payment_methods[method](amount);
        }
        throw new Error("Payment method not supported");
    }
}

module.exports = { Database, MySQLDatabase, PaymentProcessor }; 