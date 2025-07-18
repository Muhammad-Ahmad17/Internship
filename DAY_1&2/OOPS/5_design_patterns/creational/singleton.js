/*====================== SINGLETON PATTERN ======================*/
// Ensures a class has only one instance

class DatabaseConnection {
    static #instance = null;
    #connections = 0;

    constructor() {
        if (DatabaseConnection.#instance) {
            return DatabaseConnection.#instance;
        }
        this.host = 'localhost';
        this.user = 'admin';
        DatabaseConnection.#instance = this;
    }

    connect() {
        this.#connections++;
        return `Connected to database. Active connections: ${this.#connections}`;
    }

    disconnect() {
        this.#connections--;
        return `Disconnected. Remaining connections: ${this.#connections}`;
    }
}

module.exports = DatabaseConnection; 