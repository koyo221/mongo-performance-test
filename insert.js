const { MongoClient } = require("mongodb");
const fs = require("fs");

const INSERTION_COUNT = 100000;

async function main() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("testdb");
    const collection = database.collection("testcollection");
    await collection.deleteMany({});

    // insert to empty collection
    let startTime = Date.now();
    for (let i = 0; i < INSERTION_COUNT; i++) {
      await collection.insertOne({
        name: `User${i}`,
        age: Math.floor(Math.random() * 100),
        country: `Country${i}`,
        favorites: [`Favorite${i}`],
      });
    }
    let endTime = Date.now();
    let duration = endTime - startTime;
    let result = `100,000 insertion to empty collection: ${duration}ms\n`;
    fs.appendFileSync("insertResult.txt", result);

    await collection.deleteMany({});

    // bulk insert to empty collection
    startTime = Date.now();
    let bulk = collection.initializeUnorderedBulkOp();
    for (let i = 0; i < INSERTION_COUNT; i++) {
      bulk.insert({
        name: `User${i}`,
        age: Math.floor(Math.random() * 100),
        country: `Country${i}`,
        favorites: [`Favorite${i}`],
      });
    }
    await bulk.execute();
    endTime = Date.now();
    duration = endTime - startTime;
    result = `100,000 bulk insertion to empty collection: ${duration}ms\n`;
    fs.appendFileSync("insertResult.txt", result);

    await collection.deleteMany({});

    // insert to collection with 1,000,000 documents with index
    startTime = Date.now();
    for (let i = 0; i < INSERTION_COUNT; i++) {
      await collection.insertOne({
        name: `User${i}`,
        age: Math.floor(Math.random() * 100),
        country: `Country${i}`,
        favorites: [`Favorite${i}`],
      });
    }
    await collection.createIndex({ name: 1 });
    for (let i = 0; i < INSERTION_COUNT; i++) {
      await collection.insertOne({
        name: `User${i}`,
        age: Math.floor(Math.random() * 100),
        country: `Country${i}`,
        favorites: [`Favorite${i}`],
      });
    }
    endTime = Date.now();
    duration = endTime - startTime;
    result = `100,000 insertion, create index, then 1,000,000 insert: ${duration}ms\n`;
    fs.appendFileSync("insertResult.txt", result);

    await collection.deleteMany({});
  } finally {
    await client.close();
  }
}

main().catch(console.error);
