const countCodeExecs = async (db) => {
    try {
        return db.collection('studentSubmissions').find({_class: "code"}).count();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const countSubmissionsGraded = async (db) => {
    try {
        return db.collection('studentSubmissions').find({isGraded: true, _class: "code"}).count();
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

const countTotalUsers = async (db) => {
    return db.collection('studentSubmissions').distinct('userId');
};

const countUsersActiveInTheLastHour = async (db) => {
    return db.collection('studentSubmissions')
        .distinct('userId', {'timestamp': {'$gt': new Date(new Date() - 3600 * 1000)}});
};

const countHowManyUsersSubmittedByExercise = async (exerciseId, db) => {
    return db.collection('studentSubmissions')
        .distinct('userId', {exerciseId})
};

const countHowManyUsersSubmittedGradedByExercise = async (exerciseId, db) => {
    return db.collection('studentSubmissions')
        .distinct('userId', {exerciseId, isGraded: true})
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
                    '$cond': [
                        {
                            '$eq': ["$result.points.max", 0]
                        },
                        "0",
                        {
                            '$divide': [
                                '$result.points.correct', '$result.points.max'
                            ]
                        }
                    ]
                }
            }
        }, {
            '$sort': {
                'correct': 1
            }
        },
    ];

    return db.collection('studentSubmissions').aggregate(pipeline, {allowDiskUse: true}).toArray();
};

module.exports = {
    countCodeExecs,
    countSubmissionsGraded,
    countHowManyUsersSubmittedByExercise,
    countHowManyUsersSubmittedGradedByExercise,
    countTotalSubmissionsByExerciseId,
    countGradedSubmissionsByExerciseId,
    countTotalUsers,
    countUsersActiveInTheLastHour,
    getGradeDistributionByExercise,
};