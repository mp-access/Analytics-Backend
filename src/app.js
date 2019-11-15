const express = require('express');
const {initDb} = require('./db');

const port = process.env.PORT;
const isDev = process.env.NODE_ENV === 'dev';

const app = express();

initDb(isDev).then(db => {
    app.use(express.json());

    const initRouter = require('./controller');
    const router = initRouter(db, isDev);

    app.use(router);

    app.listen(port, () => {
        console.log(`Server running on port ${port}`)
    })

});