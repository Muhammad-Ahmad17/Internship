/*====================== MEDIATOR PATTERN ======================*/
// Reduces direct connections between components
// Common in: Chat applications, Form validation, Component communication

class ChatMediator {
    constructor() {
        this.users = new Map();
    }

    addUser(user) {
        this.users.set(user.name, user);
    }

    removeUser(userName) {
        this.users.delete(userName);
    }

    sendMessage(message, fromUser) {
        for (let [userName, user] of this.users) {
            if (userName !== fromUser) {
                user.receiveMessage(message, fromUser);
            }
        }
    }
}

class User {
    constructor(name, mediator) {
        this.name = name;
        this.mediator = mediator;
    }

    send(message) {
        this.mediator.sendMessage(message, this.name);
    }

    receiveMessage(message, fromUser) {
        console.log(`${this.name} received from ${fromUser}: ${message}`);
    }
}

module.exports = { ChatMediator, User }; 