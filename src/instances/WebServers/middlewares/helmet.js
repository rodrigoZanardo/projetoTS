const helmet = require("helmet");
const { config } = require('../../container.js')();

const options = {
    expectCt: false
}

module.exports = (config.webServer.enableHelmet)? helmet(options) : [];
