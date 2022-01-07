const { Router } = require('express');

const cache = require('../middlewares/cache');
const { aggregate, find } = require('../lib/mongo');
const { DAY, WEEK } = require('../util/durations');


const COLLECTION_NAME = 'statistics';

const router = Router();

router.get(`/`, cache, async (_req, res) => {
    let data = await find(COLLECTION_NAME, {
        'timestamp': {
            '$gte': Date.now() - WEEK,
        }
    });
    res.send(data);
});


module.exports = router;
