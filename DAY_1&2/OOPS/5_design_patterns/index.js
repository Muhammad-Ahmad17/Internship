// Import and demonstrate pattern usage
const APIFacade = require('./structural/facade');
const APIProxy = require('./structural/proxy');
const Order = require('./behavioral/state');
const { ChatMediator, User } = require('./behavioral/mediator');

// Facade Pattern Example
const api = new APIFacade();
api.getUserOrder(1).then(data => console.log(data));

// Proxy Pattern Example
const proxy = new APIProxy();
console.log(proxy.fetchData('key1')); // Makes API call
console.log(proxy.fetchData('key1')); // Returns cached data

// State Pattern Example
const order = new Order();
console.log(order.nextState()); // "Order is now processing"
console.log(order.nextState()); // "Order has been shipped"

// Mediator Pattern Example
const chatRoom = new ChatMediator();
const john = new User('John', chatRoom);
const jane = new User('Jane', chatRoom);

chatRoom.addUser(john);
chatRoom.addUser(jane);
john.send('Hello Jane!'); 