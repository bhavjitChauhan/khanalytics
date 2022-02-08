const { Router } = require('express');

const cache = require('../middlewares/cache');
const { aggregate } = require('../lib/mongo');
const { performanceTop } = require('../util/pipelines');


const router = Router({ strict: true });

router.get(`/top/:minimumRank`, cache, async (req, res) => {
    const { minimumRank } = req.params;
    const agg = performanceTop(parseInt(minimumRank, 10));
    let data = await aggregate('hotlist', agg);
    res.send(data);
});


module.exports = router;
