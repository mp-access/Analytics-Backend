const findAllSubmissions = async (db) => {
    try {
        return db.collection('studentSubmissions').find().limit(100).toArray();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const countGradedSubmissionsByExerciseId = async (exerciseId, db) => {
    try {
        return db.collection('studentSubmissions').count({exerciseId, isGraded: true});
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const countTotalSubmissionsByExerciseId = async (exerciseId, db) => {
    try {
        return db.collection('studentSubmissions').count({exerciseId});
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const countUsersActiveInTheLastHour = async (db) => {
    return db.collection('studentSubmissions')
        .distinct('userId', {'timestamp': {'$gt': new Date(new Date() - 3600 * 1000)}});
};

const getGradeDistributionByExercise = async (exerciseId, db) => {
    const pipeline = [
        {
            '$match': {
                'exerciseId': exerciseId,
                'isGraded': true
            }
        }, {
            '$sort': {
                'timestamp': -1
            }
        }, {
            '$group': {
                '_id': '$userId',
                'submissions': {
                    '$push': '$$ROOT'
                }
            }
        }, {
            '$replaceRoot': {
                'newRoot': {
                    '$arrayElemAt': [
                        '$submissions', 0
                    ]
                }
            }
        }, {
            '$project': {
                'correct': '$result.points.correct',
                'max': '$result.points.max',
                'percentage': {
                    '$divide': [
                        '$result.points.correct', '$result.points.max'
                    ]
                }
            }
        }, {
            '$sort': {
                'correct': 1
            }
        }
    ];

    return db.collection('studentSubmissions').aggregate(pipeline).toArray();
};

module.exports = {findAllSubmissions, countTotalSubmissionsByExerciseId, countGradedSubmissionsByExerciseId, countUsersActiveInTheLastHour, getGradeDistributionByExercise};