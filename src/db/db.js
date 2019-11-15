const MongoClient = require('mongodb').MongoClient;

const dbUrl = process.env.MONGODB_URL;
const dbUsername = process.env.MONGO_DB_USERNAME;
const dbPassword = process.env.MONGO_DB_PASSWORD;

const initDb = async (isDev) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(dbUrl, (err, client) => {
            if (err) {
                reject(err);
            }

            if (isDev) {
                const db = client.db('dev');
                resolve(db);
            } else {
                const db = client.db('access');
                db.authenticate(dbUsername, dbPassword, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(db);
                    }
                })
            }
        })
    });
};

module.exports = {initDb};
