//Requires
const { logger } = require('../container.js')();
const express = require('express');
const middlewares = require('./middlewares');
const helmet = require('helmet');

//NOTE: logger "finish" event is firing before the log file is written, that's why I'm using setTimeout
const handleListenError = (source, error) => {
  logger.error(`${source} server failed to start with error: ${error.message}`);
  setTimeout(() => {
    process.exit(1);
  }, 250);
};

/**
 * Sets up API and File web servers
 */
module.exports = getWebServer = (config) => {
  // Starting API Server
  const apiServer = express();

  apiServer.use(helmet.noSniff());

  apiServer.use(helmet.contentSecurityPolicy({}));

  apiServer.set('trust proxy', config.trustProxy);

  const apiMiddlewares = [
    middlewares.logger,
    middlewares.ctxUtils,
    middlewares.cors,
    middlewares.helmet,
    middlewares.parser,
    middlewares.router,
    middlewares.notFound,
    middlewares.erroHandling,
  ];

  apiServer.use(apiMiddlewares.flat());

  apiServer
    .listen(config.port, '0.0.0.0', () => logger.info(`SA3 API listening on port ${config.port}!`))
    .on('error', handleListenError.bind(null, 'api'));

  return apiServer;
};
