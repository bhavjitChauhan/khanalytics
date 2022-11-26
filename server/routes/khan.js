const { Router } = require('express');

const { get, post } = require('../lib/api');


const router = Router({ strict: true });

router.get('/*', async (req, res) => {
    try {
        const data = await get(req.url.slice(1));
        res.send(data);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post('/*', async (req, res) => {
    try {
        const data = await post(req.url.slice(1), req.body);
        res.send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

module.exports = router;
