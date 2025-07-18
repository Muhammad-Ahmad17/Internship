/* *****************************************
 * 🔄 ASYNC PATTERNS IN JAVASCRIPT
 * Comparing Callbacks, Promises, and Async/Await
 ******************************************/

/* *****************************************
 * 📌 SCENARIO: USER DATA FETCHING
 * 1. Fetch user by ID
 * 2. Fetch user's posts
 * 3. Fetch post comments
 ******************************************/

/* *****************************************
 * 1️⃣ CALLBACK APPROACH
 ******************************************/
function getUserCallback(userId, callback) {
    setTimeout(() => {
        const user = { id: userId, name: 'John Doe' };
        callback(null, user);
    }, 1000);
}

function getUserPostsCallback(userId, callback) {
    setTimeout(() => {
        const posts = [
            { id: 1, title: 'Post 1' },
            { id: 2, title: 'Post 2' }
        ];
        callback(null, posts);
    }, 1000);
}

function getPostCommentsCallback(postId, callback) {
    setTimeout(() => {
        const comments = [
            { id: 1, text: 'Comment 1' },
            { id: 2, text: 'Comment 2' }
        ];
        callback(null, comments);
    }, 1000);
}

// Using Callbacks (Callback Hell)
console.log('🔄 Starting Callback Version...');
getUserCallback(1, (error, user) => {
    if (error) {
        console.error('Error:', error);
        return;
    }
    console.log('👤 User:', user);

    getUserPostsCallback(user.id, (error, posts) => {
        if (error) {
            console.error('Error:', error);
            return;
        }
        console.log('📝 Posts:', posts);

        getPostCommentsCallback(posts[0].id, (error, comments) => {
            if (error) {
                console.error('Error:', error);
                return;
            }
            console.log('💬 Comments:', comments);
        });
    });
});

/* *****************************************
 * 2️⃣ PROMISE APPROACH
 ******************************************/
function getUserPromise(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = { id: userId, name: 'John Doe' };
            resolve(user);
        }, 1000);
    });
}

function getUserPostsPromise(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const posts = [
                { id: 1, title: 'Post 1' },
                { id: 2, title: 'Post 2' }
            ];
            resolve(posts);
        }, 1000);
    });
}

function getPostCommentsPromise(postId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const comments = [
                { id: 1, text: 'Comment 1' },
                { id: 2, text: 'Comment 2' }
            ];
            resolve(comments);
        }, 1000);
    });
}

// Using Promises (Chain)
console.log('🔄 Starting Promise Version...');
getUserPromise(1)
    .then(user => {
        console.log('👤 User:', user);
        return getUserPostsPromise(user.id);
    })
    .then(posts => {
        console.log('📝 Posts:', posts);
        return getPostCommentsPromise(posts[0].id);
    })
    .then(comments => {
        console.log('💬 Comments:', comments);
    })
    .catch(error => {
        console.error('Error:', error);
    });

/* *****************************************
 * 3️⃣ ASYNC/AWAIT APPROACH
 ******************************************/
async function getUserAsync(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = { id: userId, name: 'John Doe' };
            resolve(user);
        }, 1000);
    });
}

async function getUserPostsAsync(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const posts = [
                { id: 1, title: 'Post 1' },
                { id: 2, title: 'Post 2' }
            ];
            resolve(posts);
        }, 1000);
    });
}

async function getPostCommentsAsync(postId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const comments = [
                { id: 1, text: 'Comment 1' },
                { id: 2, text: 'Comment 2' }
            ];
            resolve(comments);
        }, 1000);
    });
}

// Using Async/Await (Most Clean)
async function fetchUserData(userId) {
    try {
        console.log('🔄 Starting Async/Await Version...');
        
        const user = await getUserAsync(userId);
        console.log('👤 User:', user);

        const posts = await getUserPostsAsync(user.id);
        console.log('📝 Posts:', posts);

        const comments = await getPostCommentsAsync(posts[0].id);
        console.log('💬 Comments:', comments);

        return { user, posts, comments };
    } catch (error) {
        console.error('Error:', error);
    }
}

/* *****************************************
 * 🔄 EXECUTING ALL VERSIONS
 ******************************************/
// Run all versions to see the difference
// Note: These will run concurrently

// Callback Version (runs first)
// ... callback code above already executes ...

// Promise Version (runs second)
// ... promise code above already executes ...

// Async/Await Version (runs third)
fetchUserData(1);

/* *****************************************
 * 📊 COMPARISON OF APPROACHES:
 * 
 * 1. Callbacks:
 *    ✅ Simple for single operations
 *    ❌ Leads to callback hell
 *    ❌ Error handling is verbose
 *    ❌ Hard to reason about
 * 
 * 2. Promises:
 *    ✅ Better error handling with .catch()
 *    ✅ Chain-able operations
 *    ✅ Better flow control
 *    ❌ Still requires nested .then()
 * 
 * 3. Async/Await:
 *    ✅ Looks like synchronous code
 *    ✅ Cleaner error handling (try/catch)
 *    ✅ Easier to debug
 *    ✅ Most readable
 *    ❌ Must remember to use await
 *    ❌ Must use in async function
 * 
 * 🎯 RECOMMENDATION:
 * Use Async/Await for modern code, but
 * understand all patterns as you'll see
 * them in different codebases.
 ******************************************/ 