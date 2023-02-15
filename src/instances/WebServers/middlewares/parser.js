const bodyParser = require('body-parser');

module.exports = [
    bodyParser.json(), //Defaults: 100kb max, strict, verify content type
    bodyParser.urlencoded({ 
        extended: false //helps preventing HPP
    }),
];
