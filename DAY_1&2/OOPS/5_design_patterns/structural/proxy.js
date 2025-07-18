/*====================== PROXY PATTERN ======================*/
// Controls access to objects
// Common in: Caching, Lazy loading, Authentication

class ExpensiveAPI {
    fetchData() {
        // Simulating expensive API call
        return "Data from expensive API call";
    }
}

class APIProxy {
    constructor() {
        this.api = new ExpensiveAPI();
        this.cache = new Map();
    }

    fetchData(key) {
        if (this.cache.has(key)) {
            console.log('Returning cached data');
            return this.cache.get(key);
        }

        const data = this.api.fetchData();
        this.cache.set(key, data);
        return data;
    }
}

module.exports = APIProxy; 