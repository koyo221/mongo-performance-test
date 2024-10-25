const { MongoClient } = require("mongodb");
const fs = require("fs");

const USER_COUNT = 1000000;

async function main() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("testdb");
    const collection = database.collection("testcollection");

    // Insert test data
    await collection.deleteMany({});
    let bulk = collection.initializeUnorderedBulkOp();
    for (let i = 0; i < USER_COUNT; i++) {
      bulk.insert({
        name: `User${i}`,
        age: Math.floor(Math.random() * 100),
        country: Math.random() > 0.5 ? "Japan" : "USA",
        favorites: [`Favorite${i}`],
      });
    }
    await bulk.execute();

    // Remove index before each test
    await collection.dropIndexes();

    // Find users where age is 30 without index
    let result = await collection.find({ age: 30 }).explain("executionStats");
    fs.appendFileSync(
      "findResult.txt",
      `Find users where age is 30 without index: ${JSON.stringify(
        result.executionStats
      )}\n`
    );

    // Remove index before each test
    await collection.dropIndexes();

    // Find users where age is 30 with index
    await collection.createIndex({ age: 1 });
    result = await collection.find({ age: 30 }).explain("executionStats");
    fs.appendFileSync(
      "findResult.txt",
      `Find users where age is 30 with index: ${JSON.stringify(
        result.executionStats
      )}\n`
    );

    // Remove index before each test
    await collection.dropIndexes();

    // Find users where age = 30 AND country = 'Japan' without index
    result = await collection
      .find({ age: 30, country: "Japan" })
      .explain("executionStats");
    fs.appendFileSync(
      "findResult.txt",
      `Find users where age = 30 AND country = 'Japan' without index: ${JSON.stringify(
        result.executionStats
      )}\n`
    );

    // Remove index before each test
    await collection.dropIndexes();

    // Find users where age = 30 AND country = 'Japan' with single index on age
    await collection.createIndex({ age: 1 });
    result = await collection
      .find({ age: 30, country: "Japan" })
      .explain("executionStats");
    fs.appendFileSync(
      "findResult.txt",
      `Find users where age = 30 AND country = 'Japan' with single index (age): ${JSON.stringify(
        result.executionStats
      )}\n`
    );

    // Remove index before each test
    await collection.dropIndexes();

    // Find users where age = 30 AND country = 'Japan' with compound index (age, country)
    await collection.createIndex({ country: 1 });
    result = await collection
      .find({ age: 30, country: "Japan" })
      .explain("executionStats");
    fs.appendFileSync(
      "findResult.txt",
      `Find users where age = 30 AND country = 'Japan' with single index (country): ${JSON.stringify(
        result.executionStats
      )}\n`
    );

    // Remove index before each test
    await collection.dropIndexes();

    // Find users where age = 30 AND country = 'Japan' with compound index (age, country)
    await collection.createIndex({ age: 1, country: 1 });
    result = await collection
      .find({ age: 30, country: "Japan" })
      .explain("executionStats");
    fs.appendFileSync(
      "findResult.txt",
      `Find users where age = 30 AND country = 'Japan' with compound index (age, country): ${JSON.stringify(
        result.executionStats
      )}\n`
    );

    // Remove index before each test
    await collection.dropIndexes();

    // Find users where 20 <= age <= 30 without index
    result = await collection
      .find({ age: { $gte: 20, $lte: 30 } })
      .explain("executionStats");
    fs.appendFileSync(
      "findResult.txt",
      `Find users where 20 <= age <= 30 without index: ${JSON.stringify(
        result.executionStats
      )}\n`
    );

    // Remove index before each test
    await collection.dropIndexes();

    // Find users where 20 <= age <= 30 with index
    await collection.createIndex({ age: 1 });
    result = await collection
      .find({ age: { $gte: 20, $lte: 30 } })
      .explain("executionStats");
    fs.appendFileSync(
      "findResult.txt",
      `Find users where 20 <= age <= 30 with index on age: ${JSON.stringify(
        result.executionStats
      )}\n`
    );

    // Remove index before each test
    await collection.dropIndexes();

    // Find users where 20 <= age <= 30 ORDER BY country
    result = await collection
      .find({ age: { $gte: 20, $lte: 30 } })
      .sort({ country: 1 })
      .explain("executionStats");
    fs.appendFileSync(
      "findResult.txt",
      `Find users where 20 <= age <= 30 ORDER BY country: ${JSON.stringify(
        result.executionStats
      )}\n`
    );

    await collection.dropIndexes();

    // Find users where 20 <= age <= 30 ORDER BY country
    await collection.createIndex({ country: 1 });
    result = await collection
      .find({ age: { $gte: 20, $lte: 30 } })
      .sort({ country: 1 })
      .explain("executionStats");
    fs.appendFileSync(
      "findResult.txt",
      `Find users where 20 <= age <= 30 ORDER BY country with index (country): ${JSON.stringify(
        result.executionStats
      )}\n`
    );
    await collection.dropIndexes();

    // Find users where 20 <= age <= 30 ORDER BY country
    await collection.createIndex({ age: 1 });
    result = await collection
      .find({ age: { $gte: 20, $lte: 30 } })
      .sort({ country: 1 })
      .explain("executionStats");
    fs.appendFileSync(
      "findResult.txt",
      `Find users where 20 <= age <= 30 ORDER BY country with index (age): ${JSON.stringify(
        result.executionStats
      )}\n`
    );
    await collection.dropIndexes();

    // Find users where 20 <= age <= 30 ORDER BY country
    await collection.createIndex({ age: 1, country: 1 });
    result = await collection
      .find({ age: { $gte: 20, $lte: 30 } })
      .sort({ country: 1 })
      .explain("executionStats");
    fs.appendFileSync(
      "findResult.txt",
      `Find users where 20 <= age <= 30 ORDER BY country with index (age, country): ${JSON.stringify(
        result.executionStats
      )}\n`
    );
    await collection.dropIndexes();
  } finally {
    await client.close();
  }
}

main().catch(console.error);
