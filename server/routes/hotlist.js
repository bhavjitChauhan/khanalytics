const { Router } = require('express');

require('module-alias/register');
const cache = require('@middlewares/cache');
const { aggregate, find } = require('@lib/mongo');
const { calculateVotesVolume, calculateForksVolume, calculateUniquePrograms } = require('@lib/statistics');
const createWorker = require('@util/createWorker');
const periods = require('@util/periods');

const COLLECTION_NAME = 'hotlist';
const MINIMUM_PEAK = 1;

const router = Router();

const handleRequest = async (res, data) => {
    res.write(JSON.stringify({ data }) + '\n');
    data = JSON.stringify(data);
    // const uniqueProgramsWorker = createWorker(calculateUniquePrograms, data),
    //     votesVolumeWorker = createWorker(calculateVotesVolume, data),
    //     forksVolumeWorker = createWorker(calculateForksVolume, data);
    // await Promise.all([
    //     new Promise(resolve => uniqueProgramsWorker.on('exit', () => {
    //         res.write(JSON.stringify({ uniquePrograms: process.env.calculateUniquePrograms }) + '\n');
    //         resolve();
    //     })),
    //     new Promise(resolve => votesVolumeWorker.on('exit', () => {
    //         res.write(JSON.stringify({ votesVolume: process.env.calculateVotesVolume }) + '\n');
    //         resolve();
    //     })),
    //     new Promise(resolve => forksVolumeWorker.on('exit', () => {
    //         res.write(JSON.stringify({ forksVolume: process.env.calculateForksVolume }) + '\n');
    //         resolve();
    //     }))
    // ]);
    res.write(JSON.stringify({ uniquePrograms: 0 }) + '\n');
    res.write(JSON.stringify({ votesVolume: 0 }) + '\n');
    res.write(JSON.stringify({ forksVolume: 0 }) + '\n');
    res.end();
};

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
