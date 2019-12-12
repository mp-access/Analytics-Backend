const {submissionsRepository} = require('../db');

initUsersRoutes = (db, router) => {

    router.get('/users', async (req, res) => {
        try {
            const users = await submissionsRepository.countTotalUsers(db);
            res.status(200).send({users: users.length});
        } catch (error) {
            console.error(error);
            res.status(400).send(error)
        }
    });

    router.get('/users/active', async (req, res) => {
        try {
            const submissions = await submissionsRepository.countUsersActiveInTheLastHour(db);
            res.status(200).send({usersActiveLast24Hrs: submissions.length});
        } catch (error) {
            console.error(error);
            res.status(400).send(error)
        }
    });
};

module.exports = initUsersRoutes;