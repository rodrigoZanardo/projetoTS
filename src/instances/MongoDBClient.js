//Requires
const { SSMClient, GetParameterCommand } = require('@aws-sdk/client-ssm');
const { MongoClient } = require('mongodb');
const { logger } = require('../instances/container.js')();
const mongoose = require('mongoose');

module.exports = class MongoDBClient {
  constructor(config) {
    this.config = config;
    this.client = false;
    this.db = false;
    this.setup();
  }

  /**
   * Sets up an mongodb client
   * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ssm/classes/getparametercommand.html
   */
  async setup() {
    //Getting config
    let serverConfig;
    if (this.config.awsCredsParameter) {
      try {
        const ssm = new SSMClient();
        const paramValue = await ssm.send(
          new GetParameterCommand({ Name: this.config.awsCredsParameter, WithDecryption: true }),
        );
        serverConfig = JSON.parse(paramValue?.Parameter?.Value);
        if (typeof serverConfig.host !== 'string' || typeof serverConfig.database !== 'string') {
          throw new Error(`invalid config data from parameter store`);
        }
      } catch (error) {
        logger.error(`Failed to retrieve MongoDB credentials from SSM Parameter Store:`, error);
        setTimeout(() => process.exit(1), 250);
        return;
      }
      logger.info(`Retrieved db server config from parameter store.`);
    } else {
      serverConfig = {
        host: this.config.host,
        database: this.config.database,
        authSource: this.config.authSource,
        username: this.config.username,
        password: this.config.password,
      };
      logger.info(`Retrieved db server config from loaded local config.`);
    }

    //Connecting
    let url = '';
    let url_mongoose = '';

    if (this.config.uri) {
      url = this.config.uri;
      url_mongoose = this.config.uri;
    } else if (serverConfig.authSource) {
      url = `mongodb://${serverConfig.username}:${serverConfig.password}@${serverConfig.host}/?authSource=${serverConfig.authSource}`;
      url_mongoose = `mongodb://${serverConfig.username}:${serverConfig.password}@${serverConfig.host}/${serverConfig.database}?authSource=${serverConfig.authSource}`;
    } else {
      url = `mongodb://${serverConfig.host}`;
      url_mongoose = `mongodb://${serverConfig.host}`;
    }

    try {
      this.client = await MongoClient.connect(url, { useUnifiedTopology: true });
      this.db = await this.client.db(serverConfig.database);

      await mongoose.connect(url_mongoose);

      logger.info(`MongoDB connected to ${serverConfig.host}`);
    } catch (error) {
      logger.error(`MongoDB failed to connect with error:`, error);
      setTimeout(() => process.exit(1), 250);
      return;
    }

    //Preparing structures
    try {
      const allCollections = await this.db.listCollections().toArray();
      const existingCollections = allCollections.map((c) => c.name);

      if (!existingCollections.includes('proxies')) {
        await this.db.createCollection('proxies');
        await this.db.collection('proxies').createIndex({ name: 1 }, { unique: true });
        logger.info('Created table proxies');
      }

      if (!existingCollections.includes('history')) {
        await this.db.createCollection('history', {
          timeseries: {
            timeField: 'ts',
            metaField: 'meta',
            granularity: 'minutes',
          },
        });
        await this.db.collection('history').createIndex({ 'meta.proxy': 1 });
        logger.info('Created table history');
      }

      //FIXME: Temporary?
      if (!existingCollections.includes('minutes')) {
        await this.db.createCollection('minutes');
        await this.db.collection('minutes').createIndex({ protocol: 1 }, { unique: true });
        logger.info('Created table minutes');
      }

      if (!existingCollections.includes('logsApis')) {
        await this.db.createCollection('logsApis');
        logger.info('Created table logsApis');
      }
    } catch (error) {
      logger.error(`MongoDB failed to migrate with error:`, error);
      setTimeout(() => process.exit(1), 250);
      return;
    }
  }

  /**
   * Returns a collection
   */
  async getCollection(collection) {
    if (!collection) throw new Error(`undefined collection`);
    if (!this.db) throw new Error(`not connected`);
    return this.db.collection(collection);
  }
}; //Fim MongoDBClient()
