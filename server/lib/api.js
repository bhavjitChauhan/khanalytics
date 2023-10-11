const axios = require('axios').default;
const { getLatestQuery, getLatestMutation } = require('@bhavjit/khan-api');
const { AxiosError } = require('axios');


const instance = axios.create({
    baseURL: `https://www.khanacademy.org/api/`
});

/**
 * Gets data from the Khan Academy API.
 * 
 * @param {string} path 
 * @param {Object} [params]
 * @returns {Promise}
 * 
 * @example
 * await get('scratchpads/top', {
 *     sort: 3,
 *     limit: 10,
 *     projection: ['scratchpads']
 * });
 */
const get = async (path, params) => {
    let url = path;
    if (params) {
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
    }
    const response = await instance.get(url);
    return response.data;
};

/**
 * Sends a POST request to the Khan Academy API.
 * 
 * @param {string} path 
 * @param {Object} data 
 * @returns {Promise}
 */
const post = async (path, data) => {
    try {
        const response = await instance.post(path, data)
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError && err.response.status === 403) {
            const { query } = data;
            const isQuery = query.startsWith('query'),
                operationName = query.match(/^(?:query|mutation) (\w+)/)?.[1]

            if (!operationName)
                throw new Error(`An unknown query is no longer in the safelist`)

            console.warn(
                `The query for operation "${operationName}" is no longer in the safelist. Attempting to fetch the latest version from the safelist...`
            )
            const latestQuery = isQuery
                ? await getLatestQuery(operationName)
                : await getLatestMutation(operationName)

            if (!latestQuery)
                throw new Error(
                    `The query for operation "${operationName}" was not found in the safelist`
                )

            const newData = {
                ...data,
                query: latestQuery,
            }

            const response = await instance.post(path, newData)
            return response.data
        } else throw err;
    }
};

/**
 * Gets hotlist scratchpads.
 * 
 * @param {number} [limit=100] 
 * 
 * @returns {Promise}
 */
const getHotlist = async (limit = 100) =>
    (await get('labs/scratchpads/top', {
        sort: 3,
        limit: limit,
        projection: ['scratchpads']
    })).scratchpads;


module.exports = {
    get,
    post,
    getHotlist
};
