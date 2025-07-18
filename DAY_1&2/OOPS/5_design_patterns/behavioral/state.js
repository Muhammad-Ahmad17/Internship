/*====================== STATE PATTERN ======================*/
// Manages state transitions
// Common in: Form wizards, Workflow management, UI state

class OrderState {
    constructor(order) {
        this.order = order;
    }
    
    next() {
        throw new Error("Method 'next()' must be implemented");
    }
}

class PendingState extends OrderState {
    next() {
        this.order.setState(new ProcessingState(this.order));
        return "Order is now processing";
    }
}

class ProcessingState extends OrderState {
    next() {
        this.order.setState(new ShippedState(this.order));
        return "Order has been shipped";
    }
}

class ShippedState extends OrderState {
    next() {
        this.order.setState(new DeliveredState(this.order));
        return "Order has been delivered";
    }
}

class DeliveredState extends OrderState {
    next() {
        return "Order is already delivered";
    }
}

class Order {
    constructor() {
        this.state = new PendingState(this);
    }

    setState(state) {
        this.state = state;
    }

    nextState() {
        return this.state.next();
    }
}

module.exports = Order; 