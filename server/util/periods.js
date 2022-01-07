const { HOUR, DAY, WEEK, MONTH, YEAR } = require('./durations');

const periods = {};

/**
 * Create a period.
 * 
 * @param {string} name name of the period
 * @param {number} duration duration of the period
 * @param {string} field field to be used in the aggregation pipeline
 * @param  {...number} values acceptable values for the field
 */
const createPeriod = (name, duration, field, ...values) => {
    const granularity = field ? { field, values } : null;
    periods[name] = {
        duration,
        granularity
    };
};

createPeriod('hour', HOUR);
createPeriod('day', DAY);
createPeriod('week', WEEK, 'hour', 0, 3, 6, 9, 12, 15, 18, 21);
createPeriod('month', MONTH, 'hour', 0, 12);


module.exports = periods;
