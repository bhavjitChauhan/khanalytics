const axios = require('axios').default;


const instance = axios.create({
    baseURL: `http://khanacademy.org/api/labs/`
});

/**
 * Gets data from the Khan Academy API.
 * 
 * @param {string} path 
 * @param {Object} [params={}]
 * @returns {Promise}
 * 
 * @example
 * await get('scratchpads/top', {
 *     sort: 3,
 *     limit: 10,
 *     projection: ['scratchpads']
 * });
 */
const get = async (path, params = {}) => {
    let url = path;
    const searchParams = new URLSearchParams();
    for (const param in params) {
        if (param == 'projection') {
            const obj = {};
            for (const element of params[param]) {
                obj[element] = 1;
            }
            searchParams.append('projection', JSON.stringify(obj));
        } else {
            searchParams.append(param, params[param]);
        }
    }
    url += `?${searchParams}`;
    const response = await instance.get(url);
    return response.data;
};

/**
 * Gets hotlist scratchpads.
 * 
 * @param {number} [limit=100] 
 * 
 * @returns {Promise}
 */
const getHotlist = async (limit = 100) =>
    (await get('scratchpads/top', {
        sort: 3,
        limit: limit,
        projection: ['scratchpads']
    })).scratchpads;


module.exports = {
    get: get,
    getHotlist: getHotlist
};
