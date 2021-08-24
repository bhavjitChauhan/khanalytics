require('dotenv').config({ path: '../.env' });
const { MongoClient } = require('mongodb');


const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.qj3rg.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

/**
 * Alias for `collection.insertMany`.
 * 
 * @param {string} name collection name
 * @param {Array.<Object>} docs 
 */
const insertMany = async (name, docs) => {
    const connection = await client.connect();
    const db = await connection.db(process.env.MONGODB_DATABASE);
    const collection = await db.collection(name);
    await collection.insertMany(docs);
};


module.exports = {
    client: client,
    insertMany: insertMany
};
