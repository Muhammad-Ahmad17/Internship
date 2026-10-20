// Importing using CommonJS (CJS)
const { DynamoDBClient, CreateTableCommand } = require("@aws-sdk/client-dynamodb");
const { 
  DynamoDBDocumentClient, 
  PutCommand, 
  UpdateCommand, 
  ScanCommand, 
  QueryCommand, 
  DeleteCommand 
} = require("@aws-sdk/lib-dynamodb");


// 0. Setup DynamoDB Client
const client = new DynamoDBClient({
  region: "local",
  endpoint: "http://localhost:8000",
});
const docClient = DynamoDBDocumentClient.from(client);


// 1. create scemma i mean defining keys
/** 
 * Create Movies table (only keys are defined here).
 * Attributes other than keys are schema-less and will be created on insert/update.
 */
async function createTable() {
  const params = {
    TableName: "Movies",
    KeySchema: [
      { AttributeName: "year", KeyType: "HASH" },   // Partition Key
      { AttributeName: "title", KeyType: "RANGE" }  // Sort Key
    ],
    AttributeDefinitions: [
      { AttributeName: "year", AttributeType: "N" }, 
      { AttributeName: "title", AttributeType: "S" }
    ],
    BillingMode: "PAY_PER_REQUEST"
  };

  try {
    const command = new CreateTableCommand(params);
    const response = await client.send(command);
    console.log("✅ Table created successfully:", response.TableDescription.TableName);
  } catch (error) {
    console.error("❌ Error creating table:", error.message);
  }
}


// 2. adding record in schemaless {add whatever you want}
/**
 * Add a movie (Create)
 */
async function addMovie(year, title, description) {
  const params = {
    TableName: "Movies",
    Item: { year, title, description },
  };

  try {
    await docClient.send(new PutCommand(params));
    console.log(`✅ Movie added: ${title} (${year})`);
  } catch (err) {
    console.error("❌ Error adding movie:", err);
  }
}

// 3. update record
/**
 * Update a movie's description (Update)
 */
async function updateMovieDescription(year, title, newDescription) {
  const params = {
    TableName: "Movies",
    Key: { year, title },
    UpdateExpression: "set description = :d",
    ExpressionAttributeValues: { ":d": newDescription },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    const data = await docClient.send(new UpdateCommand(params));
    console.log(`✅ Movie updated: ${title} (${year})`, data);
  } catch (err) {
    console.error("❌ Error updating movie description:", err);
  }
}

// 4. delete record on the basis of key {Since DynamoDB is schema-less, every item is uniquely identified by its primary key (either partition key only OR partition key + sort key)}
/**
 * Delete a movie (Delete)
 */
async function deleteMovie(year, title) {
  const params = {
    TableName: "Movies",
    Key: { year, title },
  };

  try {
    await docClient.send(new DeleteCommand(params));
    console.log(`🗑️ Movie deleted: ${title} (${year})`);
  } catch (err) {
    console.error("❌ Error deleting movie:", err);
  }
}

// 5. fetch all record in an array of table movies
/**
 * Retrieve all movies (Read - full scan)
 */
async function getAllMovies() {
  const params = { TableName: "Movies" };

  try {
    const data = await docClient.send(new ScanCommand(params));
    console.log("🎬 All Movies:", data.Items);
    return data.Items;
  } catch (err) {
    console.error("❌ Error scanning movies:", err);
  }
}


// 6. fetch all record in an array of table movies and on the bases of year 

/**
 * Retrieve movies by year (Read - query on partition key)
 */
async function getMoviesByYear(year) {
  const params = {
    TableName: "Movies",
    KeyConditionExpression: "#yr = :yyyy",
    ExpressionAttributeNames: { "#yr": "year" },
    ExpressionAttributeValues: { ":yyyy": year },
  };

  try {
    const data = await docClient.send(new QueryCommand(params));
    console.log(`🎬 Movies from ${year}:`, data.Items);
    return data.Items;
  } catch (err) {
    console.error("❌ Error querying movies:", err);
  }
}


/** 
 * Run examples (CRUD demo)
 * Uncomment as needed
 */
(async () => {
  // await createTable();

  // CREATE
await addMovie(2010, "Inception", "A mind-bending thriller by Christopher Nolan");
await addMovie(2014, "Interstellar", "A space exploration epic");
await addMovie(1994, "The Shawshank Redemption", "Hope and friendship inside a prison.");
await addMovie(1972, "The Godfather", "The rise of the Corleone crime family.");
await addMovie(2008, "The Dark Knight", "Batman faces the Joker in Gotham.");
await addMovie(1999, "The Matrix", "A hacker discovers reality is a simulation.");
await addMovie(1993, "Jurassic Park", "Dinosaurs are brought back to life in a theme park.");
await addMovie(1997, "Titanic", "A romance aboard the ill-fated ship.");
await addMovie(2001, "The Lord of the Rings: The Fellowship of the Ring", "A quest to destroy the One Ring begins.");
await addMovie(2012, "The Avengers", "Earth’s mightiest heroes unite to stop Loki.");
await addMovie(2019, "Parasite", "A poor family infiltrates a wealthy household.");
await addMovie(1995, "Toy Story", "The first full-length computer-animated film.");
await addMovie(2018, "Black Panther", "The king of Wakanda must protect his nation.");
await addMovie(2017, "Get Out", "A psychological thriller about race and identity.");
await addMovie(2010, "The Social Network", "The story behind the creation of Facebook.");
await addMovie(1980, "The Shining", "A haunted hotel drives a man into madness.");
await addMovie(2016, "La La Land", "A love story set in Los Angeles with music and dreams.");

  // READ
  await getAllMovies();
  // await getMoviesByYear(2010);

  // UPDATE
  // await updateMovieDescription(2010, "Inception", "Updated description: Nolan masterpiece!");

  // DELETE
  // await deleteMovie(2014, "Interstellar");
})();


// Export functions for external usage
module.exports = { 
  createTable, 
  addMovie, 
  updateMovieDescription, 
  deleteMovie, 
  getAllMovies, 
  getMoviesByYear 
};
