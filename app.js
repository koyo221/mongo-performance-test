const { MongoClient } = require('mongodb');

async function main() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('testdb');
    const collection = database.collection('testcollection');

    const randomDocument = { value: Math.random() };
    const result = await collection.insertOne(randomDocument);

    console.log(`Document inserted with _id: ${result.insertedId}`);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
