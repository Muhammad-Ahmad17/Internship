/*====================== SINGLE RESPONSIBILITY PRINCIPLE ======================*/
// A class should have only one reason to change

class UserManager {
    constructor() {
        this.users = [];
    }

    addUser(user) {
        this.users.push(user);
    }

    removeUser(userId) {
        this.users = this.users.filter(user => user.id !== userId);
    }
}

class UserValidator {
    validateUser(user) {
        // Validation logic
        return user.name && user.email;
    }
}

class UserRenderer {
    renderUser(user) {
        return `<div>${user.name} (${user.email})</div>`;
    }
}

module.exports = { UserManager, UserValidator, UserRenderer }; 

/*or b hn bad me search kar laina*/