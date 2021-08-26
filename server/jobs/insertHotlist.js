const { performance } = require('perf_hooks');

const { scheduleJob } = require('node-schedule');

const { getHotlist } = require('../lib/api');
const { insertMany } = require('../lib/mongo');
const sleep = require('../util/sleep');


const RECURRENCE_RULE = '0 * * * *';

scheduleJob(RECURRENCE_RULE, async () => {
    await sleep(60e3);
    const startTime = performance.now();
    console.log('Inserting hotlist programs...');
    const programs = Array.from(await getHotlist())
        .map((program, index) => ({
            program_id: program.url.split('/')[5],
            timestamp: Date.now(),
            rank: index + 1,
            votes: program.sumVotesIncremented,
            forks: program.spinoffCount
        }));
    await insertMany('hotlist', programs);
    console.log(`Inserted hotlist programs in ${(performance.now() - startTime).toFixed()}ms`);
});
console.log(`Scheduled job with recurrence rule '${RECURRENCE_RULE}'`);
