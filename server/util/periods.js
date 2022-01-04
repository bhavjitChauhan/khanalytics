const HOUR = 1000 * 60 * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = DAY * 30;
const YEAR = DAY * 365;

const periods = {};

/**
 * Create a period.
 * 
 * @param {string} name name of the period
 * @param {number} duration duration of the period
 * @param {string} field field to be used in the aggregation pipeline
 * @param  {...any} values acceptable values for the field
 */
const createPeriod = (name, duration, field, ...values) => {
    const granularity = field ? { field, values } : null;
    periods[name] = {
        duration,
        granularity
    };
};

createPeriod('hour', HOUR);
createPeriod('week', WEEK, 'hour', 0, 6, 12, 18);
createPeriod('month', MONTH, 'hour', 0);


module.exports = periods;
