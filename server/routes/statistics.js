const { Router } = require('express');

const cache = require('../middlewares/cache');
const { aggregate, find } = require('../lib/mongo');
const { DAY, WEEK } = require('../util/durations');


const HOTLIST_COLLECTION_NAME = 'hotlist';
const STATISTICS_COLLECTION_NAME = 'statistics';

const router = Router();

router.get('/', cache, async (_req, res) => {
    const data = await find(STATISTICS_COLLECTION_NAME, {
        'timestamp': {
            '$gte': Date.now() - WEEK,
        }
    });
    res.send(data);
});

router.get('/top', cache, async (_req, res) => {
    const agg = [
        {
            '$match': {
                'timestamp': {
                    '$gt': Date.now() - WEEK
                },
                'rank': 1
            }
        }
    ];
    const data = await aggregate(HOTLIST_COLLECTION_NAME, agg);
    res.send(data);
});


module.exports = router;
