Step 1: Set Up Your AWS Account and IAM Permissions

Sign up for an AWS account at https://aws.amazon.com/ if you don't have one (free tier available).
In the AWS Management Console, search for "IAM" (Identity and Access Management).
Create a new user or role with permissions for DynamoDB. Attach the AmazonDynamoDBFullAccess policy for simplicity (tighten it later for production).
Note your Access Key ID and Secret Access Key—these are needed for authentication in Node.js. For security, use environment variables or AWS CLI configuration instead of hardcoding.
Install the AWS CLI (Command Line Interface) from https://aws.amazon.com/cli/ and run aws configure to set your credentials.


Step 2: Set Up Your Node.js Project

Ensure you have Node.js installed (version 14+ recommended; download from https://nodejs.org/).
Create a new project folder: mkdir dynamodb-node-tutorial && cd dynamodb-node-tutorial.
Initialize: npm init -y.
Install the AWS SDK v3 packages: npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb.

@aws-sdk/client-dynamodb: Low-level client for DynamoDB operations.
@aws-sdk/lib-dynamodb: Higher-level document client for easier JSON handling (recommended for beginners).

install docker in your machine we are going to run dynamodn locally inside container to setup the dynamodb using docker i have added a script in package.json
```
"dynamodb": "docker run -p 8000:8000 amazon/dynamodb-local"
```	
you just have to run npm run dynamodb


Step 3: Run and understand the code 

	1 connection.js
	2 crud


---

## client vs docClient
When you use:

```js
const docClient = DynamoDBDocumentClient.from(client);
```

you are **wrapping the low-level DynamoDB client (`client`)** with the **DocumentClient**, which gives you a more natural, JavaScript-friendly way to work with DynamoDB.

---

### 🔹 Purpose

* **`client` (DynamoDBClient)**

  * Works directly with DynamoDB in its raw form.
  * You must manually handle `AttributeValues` like:

    ```json
    { "year": { "N": "2025" }, "title": { "S": "Inception" } }
    ```

* **`docClient` (DynamoDBDocumentClient)**

  * Simplifies requests/responses.
  * Automatically **converts JavaScript types** into DynamoDB types.
  * You can write:

    ```js
    { year: 2025, title: "Inception" }
    ```

---

### 🔹 Example

Without `DynamoDBDocumentClient`:

```js
const params = {
  TableName: "Movies",
  Item: {
    year: { N: "2025" },
    title: { S: "Inception" }
  }
};
await client.send(new PutItemCommand(params));
```

With `DynamoDBDocumentClient`:

```js
const params = {
  TableName: "Movies",
  Item: {
    year: 2025,
    title: "Inception"
  }
};
await docClient.send(new PutCommand(params));
```

---

✅ **So basically:**
`docClient` = user-friendly wrapper → no need to manually convert JS objects to DynamoDB format.

---

 