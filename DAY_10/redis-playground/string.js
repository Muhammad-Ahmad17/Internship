const client = require("./client");
async function setString() {
    const result = await client.get('msg:3');
    await client.expire ('msg:3', 10);
    console.log(result)
}

setString()

