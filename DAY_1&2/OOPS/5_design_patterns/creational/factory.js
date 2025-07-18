/*====================== FACTORY PATTERN ======================*/
// Creates objects without exposing creation logic

class Button {
    constructor(type) {
        this.type = type;
    }
}

class PrimaryButton extends Button {
    constructor() {
        super('primary');
    }
    render() {
        return `<button class="primary">Click Me</button>`;
    }
}

class SecondaryButton extends Button {
    constructor() {
        super('secondary');
    }
    render() {
        return `<button class="secondary">Click Me</button>`;
    }
}

class ButtonFactory {
    createButton(type) {
        switch(type) {
            case 'primary':
                return new PrimaryButton();
            case 'secondary':
                return new SecondaryButton();
            default:
                throw new Error('Button type not supported');
        }
    }
}

module.exports = ButtonFactory; 