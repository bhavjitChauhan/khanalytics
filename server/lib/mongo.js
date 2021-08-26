require('dotenv').config({ path: '../.env' });
const { MongoClient } = require('mongodb');


const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.qj3rg.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

/**
 * Alias for `collection.insertMany`.
 * 
 * @param {string} name collection name
 * @param {Array.<Object>} docs 
 * 
 * @returns {Promise}
 */
const insertMany = async (name, docs) => {
    const connection = await client.connect();
    const db = await connection.db(process.env.MONGODB_DATABASE);
    const collection = await db.collection(name);
    await collection.insertMany(docs);
    await client.close();
};

/**
 * Alias for `connection.find`.
 * 
 * @param {string} name collection name
 * @param {Object} filter 
 * 
 * @returns {Promise<Object>}
 */
const find = async (name, filter = {}) => {
    const connection = await client.connect();
    const db = await connection.db(process.env.MONGODB_DATABASE);
    let data;
    try {
        const collection = await db.collection(name);
        const cursor = await collection.find(filter);
        data = await cursor.toArray();
        data = data.sort((a, b) => a.timestamp - b.timestamp);
    } catch (err) {
        data = err;
    }
    await client.close();
    return data;
};


module.exports = {
    client: client,
    insertMany: insertMany,
    find: find
};
