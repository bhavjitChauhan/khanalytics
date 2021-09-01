const { Router } = require('express');

require('module-alias/register');
const cache = require('@middlewares/cache');
const { find } = require('../lib/mongo');


const MIN_PROGRAM_RANK = 3;
const router = Router();

router.get('/snapshot', cache, async (_req, res) => {
    const data = await find('hotlist', { rank: { $lte: MIN_PROGRAM_RANK } });
    res.send(data);
});

router.get('/max', cache, async (_req, res) => {
    const data = await find('hotlist', { rank: { $lte: MIN_PROGRAM_RANK } });
    res.send(data);
});

router.get('/before/:latest', cache, async (req, res) => {
    const { earliest } = req.params;
    const data = await find('hotlist', { $lte: earliest, rank: { $lte: MIN_PROGRAM_RANK } });
    res.send(data);
});

router.get('/after/:earliest', cache, async (req, res) => {
    const { earliest } = req.params;
    const data = await find('hotlist', { $gt: earliest, rank: { $lte: MIN_PROGRAM_RANK } });
    res.send(data);
});

router.get('/year', cache, async (_req, res) => {
    const data = await find('hotlist', { timestamp: { $gt: Date.now() - 1000 * 60 * 60 * 24 * 365 }, rank: { $lte: MIN_PROGRAM_RANK } });
    res.send(data);
});

router.get('/years/:years', cache, async (req, res) => {
    const { years } = req.params;
    const data = await find('hotlist', { timestamp: { $gt: Date.now() - 1000 * 60 * 60 * 24 * 365 * years }, rank: { $lte: MIN_PROGRAM_RANK } });
    res.send(data);
});

router.get('/month', cache, async (_req, res) => {
    const data = await find('hotlist', { timestamp: { $gt: Date.now() - 1000 * 60 * 60 * 24 * 30 }, rank: { $lte: MIN_PROGRAM_RANK } });
    res.send(data);
});

router.get('/months/:months', cache, async (req, res) => {
    const { months } = req.params;
    const data = await find('hotlist', { timestamp: { $gt: Date.now() - 1000 * 60 * 60 * 24 * 30 * months }, rank: { $lte: MIN_PROGRAM_RANK } });
    res.send(data);
});

router.get('/week', cache, async (_req, res) => {
    const data = await find('hotlist', { timestamp: { $gt: Date.now() - 1000 * 60 * 60 * 24 * 7 }, rank: { $lte: MIN_PROGRAM_RANK } });
    res.send(data);
});

router.get('/weeks/:weeks', cache, async (req, res) => {
    const { weeks } = req.params;
    const data = await find('hotlist', { timestamp: { $gt: Date.now() - 1000 * 60 * 60 * 24 * 7 * weeks }, rank: { $lte: MIN_PROGRAM_RANK } });
    res.send(data);
});

router.get('/day', cache, async (_req, res) => {
    const data = await find('hotlist', { timestamp: { $gt: Date.now() - 1000 * 60 * 60 * 24 }, rank: { $lte: MIN_PROGRAM_RANK } });
    res.send(data);
});

router.get('/days/:days', cache, async (req, res) => {
    const { days } = req.params;
    const data = await find('hotlist', { timestamp: { $gt: Date.now() - 1000 * 60 * 60 * 24 * days }, rank: { $lte: MIN_PROGRAM_RANK } });
    res.send(data);
});

router.get('/hour', cache, async (_req, res) => {
    const data = await find('hotlist', { timestamp: { $gt: Date.now() - 1000 * 60 * 60 }, rank: { $lte: MIN_PROGRAM_RANK } });
    res.send(data);
});

router.get('/hours/:hours', cache, async (req, res) => {
    const { hours } = req.params;
    const data = await find('hotlist', { timestamp: { $gt: Date.now() - 1000 * 60 * 60 * hours }, rank: { $lte: MIN_PROGRAM_RANK } });
    res.send(data);
});


module.exports = router;
