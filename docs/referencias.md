# Referências e links

## Code:
https://derickbailey.com/2016/03/09/creating-a-true-singleton-in-node-js-with-es6-symbols/

https://scoutapm.com/blog/nodejs-architecture-and-12-best-practices-for-nodejs-development
https://www.coreycleary.me/project-structure-for-an-express-rest-api-when-there-is-no-standard-way
https://softwareontheroad.com/ideal-nodejs-project-structure/
https://github.com/goldbergyoni/nodebestpractices

### MongoDB
https://docs.mongodb.com/drivers/node/current/
https://mongodb.github.io/node-mongodb-native/4.3/
https://docs.mongodb.com/manual/core/transactions/
https://developer.mongodb.com/article/mongoose-versus-nodejs-driver


### Security
https://dev.to/santypk4/you-don-t-need-passport-js-guide-to-node-js-authentication-26ig
https://expressjs.com/en/advanced/best-practice-security.html
joi + celebrate?!


## Devops:
https://www.nginx.com/blog/rate-limiting-nginx/
https://expressjs.com/en/advanced/best-practice-performance.html
http://strong-pm.io/compare/
https://hub.docker.com/_/mongo
https://vsupalov.com/docker-arg-env-variable-guide/


## Logging:
https://www.twilio.com/blog/guide-node-js-logging
    https://www.npmjs.com/package/winston
    https://www.npmjs.com/package/pino

https://ibm-cloud-architecture.github.io/b2m-nodejs/logging/
https://www.elastic.co/guide/en/apm/agent/nodejs/current/express.html

```bash
docker pull elasticsearch:7.10.1
docker pull kibana:7.10.1
docker network create elkstack

docker run \
  --name "elastic" \
  --net "elkstack" \
  --net-alias "elasticsearch" \
  -p 9200:9200 \
  -p 9300:9300 \
  -e "discovery.type=single-node" \
  elasticsearch:7.10.1

docker run \
  --name "kibana" \
  --net "elkstack" \
  -p 5601:5601 \
  kibana:7.10.1
```
> https://www.npmjs.com/package/winston-elasticsearch
