//Requires
const { logger } = require('../instances/container.js')();


module.exports = class ApigeeAuditor {
    constructor(config) {
        this.config = config;

        //Setting up
        // logOk('Started');
        
        //Cron functions
        setInterval(async () => {
            try {
                await this.blabla();
            } catch (error) {
                //blablaaa
            }
        }, 60*1000);
    }


    /**
     * blablablablablablablablablabla
     */
    blabla(){
        //blablablablablabla
    }
} //Fim ApigeeAuditor()
