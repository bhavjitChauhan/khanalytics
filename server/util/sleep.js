/**
 * Sleeps for a given duration.
 * 
 * @param {number} ms 
 * @returns {Promise}
 */
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = sleep;
