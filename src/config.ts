//Requires
const fs = require('fs');
const defaultsDeep = require('lodash/defaultsDeep');

/*
    NOTE:
    - If env=prod:
        - requires config/prod.json
        - try to load SA3_CONFIG_FILE:
            - process.exit(1) se falhar
            - apply to prod
    - Else:
        - requires config/dev.json
        - try to load SA3_CONFIG_FILE || config/local.json and apply to the dev

    DEBUG:
    NODE_ENV=production node src/app.js
    NODE_ENV=production SA3_CONFIG_FILE=xxx node src/app.js
    NODE_ENV=production SA3_CONFIG_FILE="C:\\Users\\Tabarra\\Desktop\\PROGRAMMING\\sit-sa3\\sa3\\deletar.json" node src/app.js
    SA3_CONFIG_FILE="C:\\Users\\Tabarra\\Desktop\\PROGRAMMING\\sit-sa3\\sa3\\deletar.json" node src/app.js

    console.dir([process.env.NODE_ENV, process.env.SA3_CONFIG_FILE])
*/

// Checking environment
let defaultConfig, cfgSrc;
if (process.env.NODE_ENV === 'production') {
    console.log('loading production config');
    defaultConfig = require('../config/prod.json');
    cfgSrc = process.env.SA3_CONFIG_FILE
} else {
    console.log('loading development config');
    defaultConfig = require('../config/dev.json');
    // cfgSrc = process.env.SA3_CONFIG_FILE ?? './config/local.json'
}

// Loading config
let config;
try {
    if(cfgSrc){
        const imported = fs.readFileSync(cfgSrc, 'utf8');
        const parsed = JSON.parse(imported);
        config = defaultsDeep(parsed, defaultConfig);
        console.log(`loaded '${cfgSrc}'`);
    }else{
        config = defaultConfig;
    }
    
} catch (error) {
    console.error(`Failed to load '${cfgSrc}' with error: ${error.message}`);
    process.exit(1);
}

module.exports = config;
