const { Router } = require('express');

const cache = require('../middlewares/cache');
const { aggregate } = require('../lib/mongo');
const { topPipeline, programPipeline } = require('../util/pipelines');


const router = Router({ strict: true });

router.get('/:id', cache, async (req, res) => {
    const { id } = req.params;
    const agg = programPipeline(id);

    try {
        const response = await aggregate('hotlist', agg);
        const data = (response)[0].programs;
        res.send(data);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get(`/top/:min`, cache, async (req, res) => {
    const { min } = req.params;
    const agg = topPipeline(parseInt(min, 10));

    try {
        const data = await aggregate('hotlist', agg);
        res.send(data);
    } catch (err) {
        res.status(500).send(err);
    }
});


module.exports = router;
