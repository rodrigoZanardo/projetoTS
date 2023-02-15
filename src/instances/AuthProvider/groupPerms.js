/*
 ## Grupos de usuários:
 - Maintainer
     - pode apagar proxy
 - Analyst
     - todas as operações de proxy menos apagar
     - pode ver auditoria do Apigee
 - GeneralReadOnly
     - Para time pentest, consultores, time de prod, coee (em ordem de prioridade)
     - não pode ver lista de usuários
     - não pode ver log do apigee
     - não pode ver notas internas
     - não pode editar proxy
*/
module.exports = {
    Maintainer: [
        'proxy.delete',
        'proxy.write',
        'proxy.notes.sit',
        'proxy.notes.test',
        'history.audit.read',
        'users.read',
        'pending_actions.list',
        'proxy.read',
        'history.qualification.read',
        'history.cicd_deploy.read',
    ],
    ApiAnalyst: [
        'proxy.delete',
        'proxy.write',
        'proxy.notes.sit',
        'proxy.notes.test',
        'history.audit.read',
        'users.read',
        'pending_actions.list',
        'proxy.read',
        'history.qualification.read',
        'history.cicd_deploy.read',
    ],
    GeneralReadOnly: [
        'proxy.read',
        'history.qualification.read',
        'history.cicd_deploy.read',
    ]
}
