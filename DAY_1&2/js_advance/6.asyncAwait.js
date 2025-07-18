/* *****************************************
 * 🚀 ASYNC/AWAIT: MODERN ASYNC JAVASCRIPT
 ******************************************/

/* *****************************************
 * 📌 WHY ASYNC/AWAIT OVER PROMISES?
 * 
 * 1. More readable, synchronous-like code
 * 2. Cleaner error handling with try/catch
 * 3. Easier debugging
 * 4. Better error stack traces
 * 5. Simpler conditional logic
 ******************************************/

/* *****************************************
 * 📌 BASIC SYNTAX COMPARISON
 ******************************************/
// Promise Version
function getDataPromise() {
    return fetch('https://api.example.com/data')
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
}

// Async/Await Version (Cleaner!)
async function getDataAsync() {
    try {
        const response = await fetch('https://api.example.com/data');
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}

/* *****************************************
 * 📌 CONDITIONAL LOGIC COMPARISON
 ******************************************/
// Promise Version (More Complex)
function conditionalPromise() {
    return getData()
        .then(result => {
            if (result.needsExtra) {
                return getExtraData()
                    .then(extraData => {
                        result.extra = extraData;
                        return result;
                    });
            }
            return result;
        });
}

// Async/Await Version (Much Cleaner!)
async function conditionalAsync() {
    const result = await getData();
    if (result.needsExtra) {
        result.extra = await getExtraData();
    }
    return result;
}

/* *****************************************
 * 📌 ERROR HANDLING COMPARISON
 ******************************************/
// Promise Version
function handleErrorsPromise() {
    return fetchUser()
        .then(user => {
            if (!user.loggedIn) {
                throw new Error('User not logged in');
            }
            return fetchUserData(user);
        })
        .then(userData => processUserData(userData))
        .catch(error => {
            console.error('Error:', error);
            return defaultData;
        });
}

// Async/Await Version (Cleaner Error Handling)
async function handleErrorsAsync() {
    try {
        const user = await fetchUser();
        if (!user.loggedIn) {
            throw new Error('User not logged in');
        }
        const userData = await fetchUserData(user);
        return await processUserData(userData);
    } catch (error) {
        console.error('Error:', error);
        return defaultData;
    }
}

/* *****************************************
 * 📌 PARALLEL EXECUTION
 ******************************************/
// Running multiple promises in parallel
async function parallel() {
    try {
        const [users, products, orders] = await Promise.all([
            fetchUsers(),
            fetchProducts(),
            fetchOrders()
        ]);
        return { users, products, orders };
    } catch (error) {
        console.error('Error:', error);
    }
}

/* *****************************************
 * 📌 SEQUENTIAL VS PARALLEL
 ******************************************/
// Sequential (when order matters)
async function sequential() {
    const user = await fetchUser();
    const posts = await fetchUserPosts(user.id);
    const comments = await fetchPostComments(posts[0].id);
    return { user, posts, comments };
}

// Parallel (when order doesn't matter)
async function parallel() {
    const [categories, tags, authors] = await Promise.all([
        fetchCategories(),
        fetchTags(),
        fetchAuthors()
    ]);
    return { categories, tags, authors };
}

/* *****************************************
 * 📌 REAL-WORLD EXAMPLE: API CALLS
 ******************************************/
async function fetchUserProfile(userId) {
    try {
        // Get user data
        const user = await fetchUser(userId);
        
        // Get user's posts and friends in parallel
        const [posts, friends] = await Promise.all([
            fetchUserPosts(userId),
            fetchUserFriends(userId)
        ]);

        // Process data sequentially if needed
        const enrichedPosts = await enrichPostsWithMetadata(posts);
        
        return {
            user,
            posts: enrichedPosts,
            friends
        };
    } catch (error) {
        console.error('Error fetching profile:', error);
      throw error; // Re-throw to handle it in the calling function
    }
}

/* *****************************************
 * 📌 BEST PRACTICES
 ******************************************/
// 1. Always use try/catch with await
async function bestPractice1() {
    try {
        await riskyOperation();
    } catch (error) {
        handleError(error);
    }
}

// 2. Remember that async functions always return promises
async function bestPractice2() {
    return 'Hello'; // Actually returns Promise<string>
}

// 3. Careful with loops
async function bestPractice3(items) {
    // ❌ Bad: Sequential processing
    for (const item of items) {
        await processItem(item);
    }

    // ✅ Good: Parallel processing
    await Promise.all(items.map(item => processItem(item)));
}

/* *****************************************
 * 📌 SYNCHRONOUS VS ASYNCHRONOUS COMPARISON
 ******************************************/
// Synchronous Example (Blocking)
function synchronousExample() {
    console.log('Start');
    const result = longRunningOperation(); // Blocks execution until complete
    console.log(result);
    console.log('End');
}

// Asynchronous Example (Non-Blocking)
async function asynchronousExample() {
    console.log('Start');
    const result = await longRunningOperation(); // Doesn't block execution
    console.log(result);
    console.log('End');
}

/* *****************************************
 * 🔑 KEY ADVANTAGES OF ASYNC/AWAIT:
 * 
 * 1. Readability:
 *    - Looks like synchronous code
 *    - Easier to understand the flow
 * 
 * 2. Error Handling:
 *    - Use traditional try/catch
 *    - Better stack traces
 * 
 * 3. Conditional Logic:
 *    - Cleaner if/else statements
 *    - More natural control flow
 * 
 * 4. Debugging:
 *    - Can use breakpoints effectively
 *    - Step through async code
 * 
 * 5. Zero Compromise:
 *    - Built on promises
 *    - Can mix with .then() if needed
 ******************************************/ 