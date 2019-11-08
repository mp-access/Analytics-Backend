const MongoClient = require('mongodb').MongoClient;

const dbUrl = process.env.MONGODB_URL;

const initDb = async () => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(dbUrl, (err, client) => {
            if (err) {
                reject(err);
            }
            const db = client.db('dev');
            resolve(db);
        })
    });
};

module.exports = {initDb};
