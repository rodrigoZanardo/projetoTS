//Requires
const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");
const { createRemoteJWKSet, jwtVerify } = require('jose');
const LRU = require("lru-cache")
const { logger } = require('../container.js')();
const groupPerms = require('./groupPerms.js');

//Helper
class SafeTokenError extends Error {
    constructor(message) {
        super(message);
        this.safe = true;
    }
}


/**
 * Module responsible to authenticate user tokens.
 * SA3 itself does not hold any users, it will come
 * directly from Azure AS.
 */
module.exports = class AuthProvider {
    config;
    remoteJWKSet;
    cachedTokens;
    cicdUsers;

    constructor(config = {}) {
        this.config = config;
        this.remoteJWKSet = createRemoteJWKSet(new URL(this.config.jwksUrl));
        this.cachedTokens = new LRU({
            max: 1024,
            maxAge: 60 * 60 * 1e3, //1 hour of inactivity
            updateAgeOnGet: true, //reset number above
        });
        this.getCicdConfig();
    }


    /**
     * Gets the cicd users from the aws parameter store
     */
    async getCicdConfig() {
        if (this.config.awsCicdCredsParameter) {
            try {
                const ssm = new SSMClient();
                const paramValue = await ssm.send(new GetParameterCommand(
                    { Name: this.config.awsCicdCredsParameter, WithDecryption: true })
                );
                const creds = JSON.parse(paramValue?.Parameter?.Value);
                if (!Array.isArray(creds)) {
                    throw new Error(`invalid cicd credentials data from parameter store`);
                }

                this.cicdUsers = creds;
            } catch (error) {
                logger.error(`Failed to retrieve CICD credentials from SSM Parameter Store:`, error);
                setTimeout(() => process.exit(1), 250);
                return;
            }
            logger.info(`Retrieved cicd creds from parameter store.`);
        } else {
            this.cicdUsers = this.config.ccidCreds;
            logger.info(`Retrieved cicd creds from loaded local config.`);
        }
    }


    /**
     * Gets a cicd user by it's token
     * @param {String} token
     */
    async getCicdUserByToken(token) {
        const found = this.cicdUsers.find(u => u.token === token);
        if (found) {
            return found
        } else {
            throw new SafeTokenError(`invalid_cicd_token`);
        }
    }


    /**
     * Validates the token and returns an User has valid Azure RBAC. 
     * This method uses the token signature cache to not need to re-validate it every time.
     * @param {String} token
     */
    async getUserByToken(token) {
        //Attempt to get token from cache
        const signature = token.split('.', 3)[2];
        if (!signature) throw new SafeTokenError(`invalid_token_parts`);
        const fromCache = this.cachedTokens.get(token);
        if (fromCache) {
            if (fromCache.expiration < Date.now()) {
                throw new SafeTokenError(`cached_token_expired`);
            }
            logger.silly(`${fromCache.user.email} authenticated from cache.`);
            return fromCache.user;
        }

        //Decode new token
        let userData;
        try {
            const decoded = await jwtVerify(
                token,
                this.remoteJWKSet,
                {
                    algorithms: ['RS256'],
                    issuer: `https://login.microsoftonline.com/${this.config.tennantId}/v2.0`,
                    audience: this.config.clientId,
                }
            );
            userData = decoded.payload;
        } catch (error) {
            throw new SafeTokenError(error.code || 'getUserByToken_undefined_error');
        }

        //Validate internal user
        if (!userData?.exp) throw new SafeTokenError(`token_exp_not_found`);
        if (!userData?.email) throw new SafeTokenError(`token_email_not_found`);
        if (!userData?.name) throw new SafeTokenError(`token_name_not_found`);
        if (!userData?.roles) throw new SafeTokenError(`token_roles_not_array`);
        if (!Array.isArray(userData.roles)) throw new SafeTokenError(`user_not_allowed`);

        const filteredRoles = userData?.roles.filter(x => groupPerms[x]);
        if (!filteredRoles.length) throw new SafeTokenError(`user_not_allowed`);

        //Create user object
        const userObject = {
            email: userData.email,
            name: userData.name,
            roles: filteredRoles,
            groups: new Set(),
            perms: new Set(),
        }
        filteredRoles.forEach((group) => {
            userObject.groups.add(group);
            groupPerms[group].forEach((perm) => {
                userObject.perms.add(perm);
            });
        });
        Object.freeze(userObject);

        //Saving signature to cache
        this.cachedTokens.set(token, {
            user: userObject,
            expiration: userData.exp * 1000,
        });
        logger.info(`User ${userObject.email} added to auth cache.`);

        return userObject;
    }
}
