const { Router } = require('express');

const { find } = require('../lib/mongo');


const router = Router();

router.get('/snapshot', async (_req, res) => {
    const data = await find('hotlist', {});
    res.send(data);
});

router.get('/max', async (_req, res) => {
    const data = await find('hotlist', {});
    res.send(data);
});

router.get('/before/:latest', async (req, res) => {
    const { earliest } = req.params;
    const data = await find('hotlist', { $lt: earliest });
    res.send(data);
});

router.get('/after/:earliest', async (req, res) => {
    const { earliest } = req.params;
    const data = await find('hotlist', { $gt: earliest });
    res.send(data);
});

router.get('/year', async (_req, res) => {
    const data = await find('hotlist', { timestamp: { $gt: Date.now() - 1000 * 60 * 60 * 24 * 365 } });
    res.send(data);
});

router.get('/years/:years', async (req, res) => {
    const { years } = req.params;
    const data = await find('hotlist', { timestamp: { $gt: Date.now() - 1000 * 60 * 60 * 24 * 365 * years } });
    res.send(data);
});

router.get('/month', async (_req, res) => {
    const data = await find('hotlist', { timestamp: { $gt: Date.now() - 1000 * 60 * 60 * 24 * 30 } });
    res.send(data);
});

router.get('/months/:months', async (req, res) => {
    const { months } = req.params;
    const data = await find('hotlist', { timestamp: { $gt: Date.now() - 1000 * 60 * 60 * 24 * 30 * months } });
    res.send(data);
});

router.get('/week', async (_req, res) => {
    const data = await find('hotlist', { timestamp: { $gt: Date.now() - 1000 * 60 * 60 * 24 * 7 } });
    res.send(data);
});

router.get('/weeks/:weeks', async (req, res) => {
    const { weeks } = req.params;
    const data = await find('hotlist', { timestamp: { $gt: Date.now() - 1000 * 60 * 60 * 24 * 7 * weeks } });
    res.send(data);
});

router.get('/day', async (_req, res) => {
    const data = await find('hotlist', { timestamp: { $gt: Date.now() - 1000 * 60 * 60 * 24 } });
    res.send(data);
});

router.get('/days/:days', async (req, res) => {
    const { days } = req.params;
    const data = await find('hotlist', { timestamp: { $gt: Date.now() - 1000 * 60 * 60 * 24 * days } });
    res.send(data);
});

router.get('/hour', async (_req, res) => {
    const data = await find('hotlist', { timestamp: { $gt: Date.now() - 1000 * 60 * 60 } });
    res.send(data);
});

router.get('/hours/:hours', async (req, res) => {
    const { hours } = req.params;
    const data = await find('hotlist', { timestamp: { $gt: Date.now() - 1000 * 60 * 60 * hours } });
    res.send(data);
});


module.exports = router;
