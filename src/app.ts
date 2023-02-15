// MOTD
if (process.env.NODE_ENV !== 'production') {
    const title = 'SA3 Server';
    process.stdout.write(`\x1B]0;${title}\x07`); //set title
    process.stdout.write(`\x1B[2J\x1B[H`); //wipe tty
}
console.log('SA3 is starting...');


// Setting up container and configs


const { container } = require('./instances/container.js')();

import * as configTs from './config.ts';


container.set('config', configTs.config);


// Setting up instances (workers)
const logger = require('./instances/logger')(configTs.config.logger);
container.set('logger', logger);

const MongoDBClient = require('./instances/MongoDBClient');
container.set('MongoDBClient', new MongoDBClient(configTs.config.mongodb));

const AuthProvider = require('./instances/AuthProvider');
container.set('AuthProvider', new AuthProvider(configTs.config.authenticator));

const EmailSender = require('./instances/EmailSender');
container.set('EmailSender', new EmailSender(configTs.config.email));

const apiServer = require('./instances/WebServers')(configTs.config.webServer);
container.set('apiServer', apiServer);

// const ApigeeAuditor = require('./instances/ApigeeAuditor');
// container.set('ApigeeAuditor', new ApigeeAuditor(config.apigee));
