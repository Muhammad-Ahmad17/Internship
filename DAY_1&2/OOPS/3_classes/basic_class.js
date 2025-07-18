/*====================== CLASSES ======================*/
// Modern syntax for creating objects and implementing inheritance

class Book {
    constructor(title, author) {
        this.title = title;
        this.author = author;
    }

    getInfo() {
        return `${this.title} by ${this.author}`;
    }

    static fromJSON(json) {
        return new Book(json.title, json.author);
    }
}

module.exports = Book; 