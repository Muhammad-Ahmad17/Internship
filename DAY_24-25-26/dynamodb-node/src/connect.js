const { DynamoDBClient, ListTablesCommand } = require('@aws-sdk/client-dynamodb');

// Create a client 

// this is a direct remote connection to aws dynamo-db and you might be charged so use local
// const client = new DynamoDBClient({ region: 'us-east-1' }); 

const client = new DynamoDBClient({
  region: 'local',
  endpoint: 'http://localhost:8000'
});


async function listTables() {
  try {
    const command = new ListTablesCommand({});
    const response = await client.send(command);
    console.log('Tables:', response.TableNames);
  } catch (error) {
    console.error('Error listing tables:', error.message);
  }
}

listTables();