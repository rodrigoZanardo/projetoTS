//Requires
const { logger, MongoDBClient } = require('../instances/container.js')();


/**
 * Module responsible for sending the minute emails
 */
module.exports = class EmailSender {
    constructor(config = {}) {
        this.config = config;

        //Cron functions
        setInterval(() => {
            this.retryEmails();
        }, 120 * 1000);
    }


    /**
     * blablablablablablablablablabla
     */
    async retryEmails() {
        try {
            // query mongo
            // retry to send emails
            // mark as completed in mongo
        } catch (error) {
            // ???
        }
    }


    /**
     * blablablablablablablablablabla
     */
    async tempSaveToDatabase(protocol, html) {
        try {
            const collection = await MongoDBClient.getCollection('minutes');
            const op = await collection.insertOne({protocol, html});
            return op.insertedId.toString();
        } catch (error) {
            console.dir(error);
        }
    }


    /**
     * blablablablablablablablablabla
     */
    queueEmail(protocol, from, to, title, html) {
        console.log('mock email queue add: ', {from, to, title});

        //FIXME: temporary!
        this.tempSaveToDatabase(protocol, html).catch(()=>{});

        // add mail to mongo
        // try to send email
        // mark as completed in mongo
    }
} //Fim EmailSender()
