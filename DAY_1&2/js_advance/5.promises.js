/* *****************************************
 * 🌟 PROMISES IN JAVASCRIPT: BEYOND CALLBACKS
 ******************************************/

/* *****************************************
 * 📌 WHY PROMISES OVER CALLBACKS?
 * 
 * 1. Avoid callback hell
 * 2. Better error handling
 * 3. Chaining capabilities
 * 4. Better flow control
 * 5. Built-in state management
 ******************************************/

/* *****************************************
 * 📌 BASIC PROMISE EXAMPLE
 ******************************************/
const simplePromise = new Promise((resolve, reject) => {
    // Simulating an async operation
    setTimeout(() => {
        const success = true;
        if (success) {
            resolve("Operation successful!");
        } else {
            reject("Operation failed!");
        }
    }, 1000);
});

// Using the promise
simplePromise
    .then(result => console.log(result))
    .catch(error => console.error(error));

/* *****************************************
 * 📌 CALLBACK HELL VS PROMISES
 ******************************************/
// Callback Hell Version
function callbackHellExample() {
    asyncOperation1(function(result1) {
        asyncOperation2(result1, function(result2) {
            asyncOperation3(result2, function(result3) {
                console.log(result3);
            }, function(error) {
                console.error(error);
            });
        }, function(error) {
            console.error(error);
        });
    }, function(error) {
        console.error(error);
    });
}

// Promise Version (Much Cleaner!)
function promiseVersion() {
    return asyncOperation1()
        .then(result1 => asyncOperation2(result1))
        .then(result2 => asyncOperation3(result2))
        .then(result3 => console.log(result3))
        .catch(error => console.error(error));
}

/* *****************************************
 * 📌 PROMISE STATES
 ******************************************/
const statesDemo = new Promise((resolve, reject) => {
    // Promise starts in 'pending' state
    console.log('Promise is pending...');
    
    setTimeout(() => {
        // Changes to 'fulfilled' when resolved
        resolve('Promise is fulfilled!');
        // OR changes to 'rejected' if rejected
        // reject('Promise is rejected!');
    }, 1000);
});

/* *****************************************
 * 📌 PROMISE CHAINING
 ******************************************/
function getData() {
    return new Promise(resolve => {
        setTimeout(() => resolve(5), 1000);
    });
}

getData()
    .then(num => num * 2)          // Returns 10
    .then(num => num + 3)          // Returns 13
    .then(result => console.log(result))  // Logs 13
    .catch(error => console.error(error));

/* *****************************************
 * 📌 PARALLEL PROMISES
 ******************************************/
const promise1 = Promise.resolve(3);
const promise2 = new Promise(resolve => setTimeout(() => resolve('foo'), 2000));
const promise3 = Promise.resolve(42);

// Wait for all promises to complete
Promise.all([promise1, promise2, promise3])
    .then(values => console.log(values))  // [3, 'foo', 42]
    .catch(error => console.error(error));

/* *****************************************
 * 📌 REAL-WORLD EXAMPLE: API CALLS
 ******************************************/
function fetchUserData(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = {
                id: userId,
                name: 'John Doe',
                email: 'john@example.com'
            };
            resolve(user);
        }, 1000);
    });
}

function fetchUserPosts(user) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const posts = [
                { id: 1, title: 'Post 1' },
                { id: 2, title: 'Post 2' }
            ];
            resolve({ user, posts });
        }, 1000);
    });
}

// Clean promise chain
fetchUserData(1)
    .then(user => fetchUserPosts(user))
    .then(data => console.log(data))
    .catch(error => console.error(error));

/* *****************************************
 * 📌 ASYNC/AWAIT (MODERN PROMISE SYNTAX)
 ******************************************/
async function getUserData() {
    try {
        const user = await fetchUserData(1);
        const data = await fetchUserPosts(user);
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}

/* *****************************************
 * 🔑 ADVANTAGES OF PROMISES OVER CALLBACKS:
 * 
 * 1. Better Error Handling:
 *    - Single .catch() for multiple operations
 *    - Error propagation through chain
 * 
 * 2. Cleaner Syntax:
 *    - No nested callbacks
 *    - Clear sequential operations
 * 
 * 3. Better Flow Control:
 *    - Promise.all() for parallel operations
 *    - Promise.race() for timeouts
 * 
 * 4. Guaranteed Execution:
 *    - Always either resolves or rejects
 *    - No "forgotten" callbacks
 * 
 * 5. Built-in State Management:
 *    - Pending, Fulfilled, or Rejected
 *    - Cannot change state once settled
 * 
 * 6. Better Debugging:
 *    - Clearer stack traces
 *    - Easier to follow code flow
 ******************************************/ 