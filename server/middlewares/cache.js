const NodeCache = require("node-cache");

const { HOUR, DAY } = require('../util/durations');

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
            let ttl;
            switch (req.baseUrl) {
                case '/khan':
                    // ttl = (MINUTE * 10) - (Date.now() % (MINUTE * 10));
                    ttl = DAY;
                    break;
                case '/hotlist':
                    ttl = HOUR - (Date.now() % HOUR);
                    break;
                case '/statistics':
                    ttl = DAY - (Date.now() % DAY);
                    break;
                case '/performance':
                    ttl = HOUR - (Date.now() % HOUR);
                    break;
                default:
                    ttl = HOUR;
                    break;
            }
            if (Object.keys(body).length != 0) Cache.set(key, body, ttl);
            res.sendResponse(body);
        }
        next();
    }
}


module.exports = handler;
