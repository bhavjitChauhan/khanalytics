require = require('esm')(module);
const { routes } = require('./src/router/routes.js');

module.exports = {
    outputDir: '../server/dist',
    pluginOptions: {
        sitemap: {
            baseURL: 'https://khanalytics.bhavjit.com',
            routes,
        }
    }
}
