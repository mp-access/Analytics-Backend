const {submissionsRepository} = require('../db');

initSubmissionsRoutes = (db, router) => {

    router.get('/submissions', async (req, res) => {
        try {
            const submissions = await submissionsRepository.findAllSubmissions(db);
            res.status(200).send(submissions);
        } catch (error) {
            console.error(error);
            res.status(400).send(error)
        }
    });

    router.get('/submissions/exercises/:exerciseId', async (req, res) => {
        try {
            const {exerciseId} = req.params;

            let result = await submissionsRepository.getGradeDistributionByExercise(exerciseId, db);
            let gradedSubmissions = await submissionsRepository.countGradedSubmissionsByExerciseId(exerciseId, db);
            let totalSubmissions = await submissionsRepository.countTotalSubmissionsByExerciseId(exerciseId, db);
            const distributions = {};
            let maxScore = 0;
            result.map(evaluation => {
                const points = evaluation.correct || 0;
                const count = distributions[points] || 0;
                distributions[points] = count + 1;
                maxScore = evaluation.max;
            });
            res.status(200).send({
                distributions,
                maxScore,
                gradedSubmissions,
                totalSubmissions
            });
        } catch (error) {

        }
    });

    router.get('/users', async (req, res) => {
        try {
            const submissions = await submissionsRepository.countUsersActiveInTheLastHour(db);
            res.status(200).send({submissionCount: submissions.length});
        } catch (error) {
            console.error(error);
            res.status(400).send(error)
        }
    });
};

module.exports = initSubmissionsRoutes;