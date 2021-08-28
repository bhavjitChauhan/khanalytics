const NodeCache = require("node-cache");


const Cache = new NodeCache();

const handler = (req, res, next) => {
    const key = `__express__${req.originalUrl || req.url}`;
    const body = Cache.get(key);
    if (body) {
        res.send(body);
        return;
    } else {
        res.sendResponse = res.send;
        res.send = body => {
            Cache.set(key, body, (60 - (new Date()).getMinutes()) * 60 * 1000);
            res.sendResponse(body);
        }
        next();
    }
}


module.exports = handler;
