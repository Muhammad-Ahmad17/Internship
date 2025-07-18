/*====================== OBSERVER PATTERN ======================*/
// Defines one-to-many dependency between objects

class NewsAgency {
    constructor() {
        this.subscribers = [];
    }

    subscribe(observer) {
        this.subscribers.push(observer);
    }

    unsubscribe(observer) {
        this.subscribers = this.subscribers.filter(sub => sub !== observer);
    }

    notify(news) {
        this.subscribers.forEach(observer => observer.update(news));
    }
}

class NewsChannel {
    constructor(name) {
        this.name = name;
    }

    update(news) {
        console.log(`${this.name} received news: ${news}`);
    }
}

module.exports = { NewsAgency, NewsChannel }; 