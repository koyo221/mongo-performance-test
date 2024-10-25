const { MongoClient } = require('mongodb');
const fs = require('fs');

async function main() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('testdb');
    const collection = database.collection('testcollection');

    // 1,000,000 insertion to empty collection
    let startTime = Date.now();
    for (let i = 0; i < 1000000; i++) {
      await collection.insertOne({ name: `User${i}`, age: Math.floor(Math.random() * 100), country: `Country${i}`, favorites: [`Favorite${i}`] });
    }
    let endTime = Date.now();
    let duration = endTime - startTime;
    let result = `1,000,000 insertion to empty collection: ${duration}ms\n`;
    fs.appendFileSync('insertResult.txt', result);

    // 1,000,000 bulk insertion to empty collection
    await collection.deleteMany({});
    startTime = Date.now();
    let bulk = collection.initializeUnorderedBulkOp();
    for (let i = 0; i < 1000000; i++) {
      bulk.insert({ name: `User${i}`, age: Math.floor(Math.random() * 100), country: `Country${i}`, favorites: [`Favorite${i}`] });
    }
    await bulk.execute();
    endTime = Date.now();
    duration = endTime - startTime;
    result = `1,000,000 bulk insertion to empty collection: ${duration}ms\n`;
    fs.appendFileSync('insertResult.txt', result);

    // 1,000,000 insertion, create index, then 1,000,000 insert
    await collection.deleteMany({});
    startTime = Date.now();
    for (let i = 0; i < 1000000; i++) {
      await collection.insertOne({ name: `User${i}`, age: Math.floor(Math.random() * 100), country: `Country${i}`, favorites: [`Favorite${i}`] });
    }
    await collection.createIndex({ name: 1 });
    for (let i = 0; i < 1000000; i++) {
      await collection.insertOne({ name: `User${i}`, age: Math.floor(Math.random() * 100), country: `Country${i}`, favorites: [`Favorite${i}`] });
    }
    endTime = Date.now();
    duration = endTime - startTime;
    result = `1,000,000 insertion, create index, then 1,000,000 insert: ${duration}ms\n`;
    fs.appendFileSync('insertResult.txt', result);

    // 1,000,000 insertion, create index, then 1,000,000 insert with explain
    await collection.deleteMany({});
    startTime = Date.now();
    for (let i = 0; i < 1000000; i++) {
      await collection.insertOne({ name: `User${i}`, age: Math.floor(Math.random() * 100), country: `Country${i}`, favorites: [`Favorite${i}`] });
    }
    await collection.createIndex({ name: 1 });
    for (let i = 0; i < 1000000; i++) {
      await collection.insertOne({ name: `User${i}`, age: Math.floor(Math.random() * 100), country: `Country${i}`, favorites: [`Favorite${i}`] });
    }
    const explainResult = await collection.find({}).explain('executionStats');
    endTime = Date.now();
    duration = endTime - startTime;
    result = `1,000,000 insertion, create index, then 1,000,000 insert with explain: ${duration}ms\nExecution stats: ${JSON.stringify(explainResult.executionStats)}\n`;
    fs.appendFileSync('insertResult.txt', result);

  } finally {
    await client.close();
  }
}

main().catch(console.error);
