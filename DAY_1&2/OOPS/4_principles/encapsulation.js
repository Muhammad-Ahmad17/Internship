/*====================== ENCAPSULATION ======================*/
// Information hiding and bundling

class BankAccount {
    #balance = 0;
    #transactions = [];

    constructor(owner) {
        this.owner = owner;
    }

    deposit(amount) {
        if (amount > 0) {
            this.#balance += amount;
            this.#addTransaction('deposit', amount);
            return true;
        }
        return false;
    }

    #addTransaction(type, amount) {
        this.#transactions.push({
            type,
            amount,
            date: new Date()
        });
    }

    getBalance() {
        return this.#balance;
    }
}

module.exports = BankAccount; 