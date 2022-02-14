const { week } = require('./periods');
const { HOUR } = require('./durations');


const topPipeline = (minimumRank = 5) => {
    const field = week.granularity.field;
    const values = week.granularity.values;
    return [
        {
            '$match': {
                'timestamp': {
                    '$gt': Date.now() - HOUR
                }
            }
        }, {
            '$match': {
                'rank': {
                    '$lte': minimumRank
                }
            }
        }, {
            '$lookup': {
                'from': 'hotlist',
                'let': {
                    'program_id': '$program_id'
                },
                'pipeline': [
                    {
                        '$match': {
                            '$expr': {
                                '$eq': [
                                    '$program_id', '$$program_id'
                                ]
                            }
                        }
                    }, {
                        '$addFields': {
                            [field]: {
                                ['$' + field]: {
                                    '$toDate': '$timestamp'
                                }
                            }
                        }
                    }
                ],
                'as': 'programs'
            }
        }, {
            '$addFields': {
                'first': {
                    '$first': '$programs'
                },
                'last': {
                    '$last': '$programs'
                },
                'count': {
                    '$size': '$programs'
                }
            }
        }, {
            '$project': {
                'program_id': 1,
                'programs': {
                    '$filter': {
                        'input': '$programs',
                        'as': 'program',
                        'cond': {
                            '$or': [
                                {
                                    '$in': [
                                        '$$program.' + field, values
                                    ]
                                }, {
                                    '$eq': [
                                        '$$program', '$$CURRENT.first'
                                    ]
                                }, {
                                    '$eq': [
                                        '$$program', '$$CURRENT.last'
                                    ]
                                }
                            ]
                        }
                    }
                }
            }
        }
    ];
};

const programPipeline = (programID) => [
    {
        '$match': {
            'program_id': programID
        }
    }, {
        '$group': {
            '_id': '$program_id',
            'programs': {
                '$push': '$$ROOT'
            }
        }
    }
];


module.exports = {
    topPipeline,
    programPipeline
};
