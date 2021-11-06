const { Router } = require('express');

require('module-alias/register');
const cache = require('@middlewares/cache');
const { find } = require('@lib/mongo');
const { calculateVotesVolume, calculateForksVolume, calculateUniquePrograms } = require('@lib/statistics');
const createWorker = require('@util/createWorker');
const { HOUR, DAY, WEEK, MONTH, YEAR } = require('@util/durations');


const router = Router();

const periods = {
    'hour': HOUR,
    'day': DAY,
    'week': WEEK,
    'month': MONTH,
    'year': YEAR
}

const handleRequest = async (res, data) => {
    res.write(JSON.stringify({ data }) + '\n');
    data = JSON.stringify(data);
    const uniqueProgramsWorker = createWorker(calculateUniquePrograms, data),
        votesVolumeWorker = createWorker(calculateVotesVolume, data),
        forksVolumeWorker = createWorker(calculateForksVolume, data);
    await Promise.all([
        new Promise(resolve => uniqueProgramsWorker.on('exit', () => {
            res.write(JSON.stringify({ uniquePrograms: process.env.calculateUniquePrograms }) + '\n');
            resolve();
        })),
        new Promise(resolve => votesVolumeWorker.on('exit', () => {
            res.write(JSON.stringify({ votesVolume: process.env.calculateVotesVolume }) + '\n');
            resolve();
        })),
        new Promise(resolve => forksVolumeWorker.on('exit', () => {
            res.write(JSON.stringify({ forksVolume: process.env.calculateForksVolume }) + '\n');
            resolve();
        }))
    ]);
    res.end();
};

for (const period in periods) {
    router.get(`/${period}`, cache, async (_req, res) => {
        let data = await find('hotlist', { timestamp: { $gt: Date.now() - periods[period] } });
        console.log(data)
        await handleRequest(res, data);
    });
    router.get(`/${period}s/:quantity`, cache, async (req, res) => {
        const { quantity } = req.params;
        let data = await find('hotlist', { timestamp: { $gt: Date.now() - periods[period] * quantity } });
        await handleRequest(res, data);
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
