# Controllers
- `POST /cicd/validate/apigee/xxx`
    > xxx = proxy, product, app, etc
    - TODO: permissioning 
    - Rotas para validação de CICD;


- `GET  /users` DONE
    - Check perms
    - UserVault.getUsers()
    - return [{name, email, groups}]

- `GET  /users/self` DONE
    - return {name, email, groups, perms}


- `GET  /proxies` - getList DONE
    - TODO check perms
    - ProxyService.getList(...pagination stuff)
    - ProxyHelper.redactData(user.perms, proxyData)

- `GET /proxies/names` DONE
    - TODO check perms
    - ProxyService.getList(sort, project)
    - map the nameHistory
    - return [{id, name, nameHistory?}]

- `GET /proxies/pendencies` DONE
    - TODO check perms
    - ProxyService.getPendencies(getAll)
    - return [pendencies]

- `DELETE   /proxies/:id` - deleteOne DONE
    - TODO check perms
    - ProxyService.remove(id)

- `GET  /proxies/:id` - getOne DONE
    - TODO check perms
    - ProxyHelper.idRegex.test(req.params.id)
    - ProxyService.getOne('id', id)
    - ProxyHelper.redactData(user.perms, proxyData)

- `POST /proxies/` - register DONE
    - TODO check perms
    > daqui pra baixo igual ao PUT, exceto register
    - ProxyService.**register**(...)
    - EmailHelper.shouldSendEmail(false, status, sendMinuteCheckbox)
    - EmailHelper.parseEmails()
    - check if emailRecipientsParsed > 0 if shouldSendEmail
    - HistoryService.registerQualification(...)
    - ProxyHelper.generateMinute(proxyData, proxyId, apiProducer, analyst, protocol)
    - EmailSender.sendEmail(...)
    - return {protocol, emailRecipientsParsed}

- `PUT  /proxies/:id` - update DONE
    - TODO check perms
    - check if lastVersionTimestamp was provided
    - ProxyHelper.idRegex.test(req.params.id)
    > daqui pra baixo igual ao POST, exceto update
    - ProxyHelper.validate(proxyData)
    - ProxyService.**update**(...)
    - EmailHelper.shouldSendEmail(oldStatus, newStatus, sendMinuteCheckbox)
    - EmailHelper.parseEmails()
    - check if emailRecipientsParsed > 0 if shouldSendEmail
    - HistoryService.registerQualification(...)
    - ProxyHelper.generateMinute(proxyData, proxyId, apiProducer, analyst, protocol)
    - EmailSender.sendEmail(...)
    - return {protocol, emailRecipientsParsed}


- `GET /history` TODO:
    - TODO check perms
    - TODO: validar com joi
    - Build filter from:
        - proxyid
        - proxyname
        - date
    - HistoryService.getList(...mongo query params)
    - {removedCount, history} = HistoryHelper.redactData(user.perms, logArray)
    - return {removedCount > 0, history}









ProxyController
    - ProxyHelper.validate()
    - HistoryHelper.validate()
    - ProxyService.register()
    - HistoryService.registerQuali()















# Services
## ProxyService
- getNames() //pt
- getList(filter = null) //pt
- getOne(filterType, match) //pt
- deleteOne(id) //pt

- register(proxyData) 
    - ProxyHelper.validate(proxyData)
    - ProxyDAL.getOne('name', name): if match throw error
    - set lastModified = new Date()
    - set nameHistory = []
    - ProxyDAL.insert(proxyData)
    - return {id, status}

- update(proxyID, lastVersionTimestamp, proxyData) 
    - ProxyDAL.getOne('id', id || 'name', name): if matches !== 1 throw error
    - compare reference timestamp
    - compare name & add to nameHistory[]
    - validate status change (new.status == 'DRAFT' && old.status !== 'DRAFT'): error
    - ProxyDAL.update(id, proxyData)
    - return {oldStatus, newStatus}

- getPendencies(getAll = false)
    - ProxyDAL.getList(...)
    - flatten to pendency array
    - sort based on expiration date
    - return [pendencies]


## HistoryService 
- getList(...) //pt

- registerQualification(proxyID, proxyStatus, analyst, apiProducer, emailRecipients, reason) 
    - construct object
    - HistoryDAL.insert(historyData)
    - return protocol

- registerDeploy(proxyID, response, reason) 
    - construct object
    - HistoryDAL.insert(historyData)
    - return protocol

- registerAudit()
    > TBD












# Helpers
## ProxyHelper
- CONST idRegex
- validate(proxyData)
- generateMinute(proxyData, proxyId, apiProducer, analyst, protocol)
- redactData(userGroup, proxyData) DONE

## EmailHelper (solto na pasta?)
- isEmailRequired(oldStatus, newStatus) DONE
- parseEmails(emailRecipientsRaw)

## HistoryHelper
- redactData(user.group, logArray)

# Utils
## requestAuth(req, res, next) 
- cicdAuth
    > TBD
- userAuth DONE
    - decode header
    - req.user = UserVault.getUserByToken(token)
    - if req.user
    - return next()


# Data Access Layer
## ProxyDAL
- getNames() TODO:
- getList(filter = null) TODO:
- getOne(filterType, match) DONE
- deleteOne(id) DONE
- insert(proxyData) TODO:
- update(id, proxyData) TODO:

## HistoryDAL
- insert(historyData) TODO:
    - mongo.insertOne
    - return last id
- getList(...) TODO:
    - montar query
