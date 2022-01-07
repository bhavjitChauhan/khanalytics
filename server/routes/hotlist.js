const { Router } = require('express');

const cache = require('../middlewares/cache');
const { aggregate, find } = require('../lib/mongo');
const periods = require('../util/periods');


const COLLECTION_NAME = 'hotlist';
const MINIMUM_PEAK = 1;

const router = Router();

for (const period in periods) {
    const pipeline = [];
    if (periods[period].granularity) {
        const field = periods[period].granularity.field;
        const values = periods[period].granularity.values.length == 1
            ? { [field]: periods[period].granularity.values[0] }
            : { '$or': periods[period].granularity.values.map(value => ({ [field]: value })) }
        pipeline.push(
            {
                '$addFields': {
                    'date': {
                        '$toDate': '$timestamp'
                    }
                }
            },
            {
                '$addFields': {
                    [field]: {
                        ['$' + field]: '$date'
                    }
                }
            },
            {
                '$match': values
            }
        );
    }
    pipeline.push(
        {
            '$group': {
                '_id': '$program_id',
                'peak': {
                    '$min': '$rank'
                },
                'programs': {
                    '$push': '$$ROOT'
                }
            }
        },
        {
            '$match': {
                'peak': {
                    '$lte': MINIMUM_PEAK
                }
            }
        }
    );
    router.get(`/${period}`, cache, async (_req, res) => {
        const agg = pipeline.slice();
        agg.unshift({
            '$match': {
                'timestamp': {
                    '$gt': Date.now() - periods[period].duration
                }
            }
        });
        let data = await aggregate(COLLECTION_NAME, agg);
        res.send(data);
    });
    router.get(`/${period}s/:quantity`, cache, async (req, res) => {
        const { quantity } = req.params;
        const agg = pipeline.slice();
        agg.unshift({
            '$match': {
                'timestamp': {
                    '$gt': Date.now() - periods[period].duration * quantity
                }
            }
        });
        let data = await aggregate(COLLECTION_NAME, agg);
        res.send(data);
    });
}

// router.get('/before/:latest', cache, async (req, res) => {
//     const { latest } = req.params;
//     const data = await find('hotlist', { timestamp: { $lte: latest } });
//     await handleRequest(res, data);
// });

// router.get('/after/:earliest', cache, async (req, res) => {
//     const { earliest } = req.params;
//     const data = await find('hotlist', { timestamp: { $gte: earliest } });
//     await handleRequest(res, data);
// });

// router.get('/max', cache, async (_req, res) => {
//     const data = await find('hotlist');
//     await handleRequest(res, data);
// });


module.exports = router;
