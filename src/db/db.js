const MongoClient = require('mongodb').MongoClient;

let dbUrl = process.env.MONGODB_URL;
const dbUsername = process.env.MONGO_DB_USERNAME;
const dbPassword = process.env.MONGO_DB_PASSWORD;

const initDb = async (isDev) => {
    return new Promise((resolve, reject) => {

        if (!isDev) {
            const parts = dbUrl.split("://");
            dbUrl = parts.join(`://${dbUsername}:${dbPassword}@`);
            console.log("Added authentication to mongodb connection string")
        }

        MongoClient.connect(dbUrl, (err, client) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                const db = client.db('dev');
                resolve(db);
            }
        })
    });
};

module.exports = {initDb};
