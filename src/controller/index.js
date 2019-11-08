const express = require('express');
const auth = require('../middleware/auth');
const initSubmissionsRoutes = require('./Submission');

const initRouter = (db, isDev) => {
    const router = express.Router();
    if (!isDev) {
        router.use(auth);
    }

    router.get('/', async (req, res) => {
        res.send({hello: 'there'})
    });

    initSubmissionsRoutes(db, router);

    return router;
};

module.exports = initRouter;
