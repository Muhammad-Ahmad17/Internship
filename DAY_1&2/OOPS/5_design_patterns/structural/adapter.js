/*====================== ADAPTER PATTERN ======================*/
// Allows incompatible interfaces to work together

// Old Interface
class OldAPI {
    getUsers() {
        return [{name: 'John', surname: 'Doe'}];
    }
}

// New Interface
class NewAPI {
    getUsersData() {
        return [{firstName: 'John', lastName: 'Doe'}];
    }
}

// Adapter
class APIAdapter {
    constructor(newAPI) {
        this.newAPI = newAPI;
    }

    getUsers() {
        const users = this.newAPI.getUsersData();
        return users.map(user => ({
            name: user.firstName,
            surname: user.lastName
        }));
    }
}

module.exports = { OldAPI, NewAPI, APIAdapter }; 