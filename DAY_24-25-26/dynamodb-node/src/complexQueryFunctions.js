// Import required AWS SDK clients and commands for Node.js (CJS)
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");

// Create DynamoDB Client
const client = new DynamoDBClient({
  region: "local",
  endpoint: "http://localhost:8000",
});
const docClient = DynamoDBDocumentClient.from(client);

/**
 * Function to get all movies released before the year 2000
 */
async function listMoviesBefore2000() {
  try {
    const params = {
      TableName: "Movies",
      FilterExpression: "#yr < :yyyy",
      ExpressionAttributeNames: { "#yr": "year" },
      ExpressionAttributeValues: { ":yyyy": 2000 }
    };

    const command = new ScanCommand(params);
    const response = await docClient.send(command);

    console.log("Movies released before 2000:",response.Items)

    // console.log("Movies released before 2000:");
    // response.Items.forEach((movie) => {
    //   //console.log(movie);
    //   //console.log(`- ${movie.title} (${movie.year})`);
    // });

    return response.Items;
  } catch (err) {
    console.error("Error fetching movies:", err);
    throw err;
  }
}

// Example call
listMoviesBefore2000();
