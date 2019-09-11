// next.config.js
const withSass = require('@zeit/next-sass');
const withCSS = require('@zeit/next-css');
module.exports = withSass(
    withCSS({
        /* config options here */
        webpack(config, options) {
            // Further custom configuration here
            return config;
        }
    })
);
