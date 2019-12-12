const express = require('express');
const auth = require('../middleware/auth');
const initSubmissionsRoutes = require('./Submission');
const initUsersRoutes = require('./Users');

const initRouter = (db, isDev) => {
    const router = express.Router();

    router.use(auth);

    router.get('/', async (req, res) => {
        res.send({hello: 'there'})
    });

    initSubmissionsRoutes(db, router);
    initUsersRoutes(db, router);

    router.get('*', function (req, res) {
        res.status(404).send({path: req.path})
    });

    return router;
};

module.exports = initRouter;
