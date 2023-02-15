# Specs CICD:

## /cicd/validate/apigee/proxy

Rota utilizada para validação de proxies antes do deploy dos mesmos.
Autenticação é via o header Authorization (Bearer) e dados devem ser enviados via content-type `multipart/form-data`.
A autentica

### Variáveis esperadas:

-   projectName: CI_PROJECT_NAME
-   sourceBranch: DEPLOY_BRANCH_SOURCE
-   pipelineUrl: CI_PIPELINE_URL
-   jobAuthorLogin: GITLAB_USER_LOGIN
-   jobAuthorEmail: GITLAB_USER_EMAIL
-   commitAuthorEmail: DEPLOY_EMAIL
-   commitAuthorName: DEPLOY_RESPONSIBLE_COMMIT
-   commitDateTime: DEPLOY_DATETIME_COMMIT
-   commitHash: DEPLOY_COMMIT_HASH
-   commitMessage: commit_message=$(git log -1 --pretty=format:%s)
-   targetApigees: DEPLOY_DCS_TO_DEPLOY
-   repositoryData: zip do repositório (`zip -v -r -p ${DEPLOY_APINAME}.zip * -x **node_modules/*`)

### Exemplo de chamada:

```bash
    curl    -H 'Host: sa3api.portalsit.com.br' \
        -H "Authorization: Bearer ${PROTECTED_SECRET}" \
        -F "repositoryData=@${DEPLOY_APINAME}.zip" \
        -F "projectName=${CI_PROJECT_NAME}" \
        -F "sourceBranch=${DEPLOY_BRANCH_SOURCE}" \
        -F "pipelineUrl=${CI_PIPELINE_URL}" \
        -F "jobAuthorLogin=${GITLAB_USER_LOGIN}" \
        -F "jobAuthorEmail=${GITLAB_USER_EMAIL}" \
        -F "commitAuthorEmail=${DEPLOY_EMAIL}" \
        -F "commitAuthorName=${DEPLOY_RESPONSIBLE_COMMIT}" \
        -F "commitDateTime=${DEPLOY_DATETIME_COMMIT}" \
        -F "commitHash=${DEPLOY_COMMIT_HASH}" \
        -F "commitMessage=${commit_message}" \
        -F "targetApigees=${DEPLOY_DCS_TO_DEPLOY}" \
        https://sa3api.portalsit.com.br/cicd/validate/apigee/proxy \
        > ./result.json
```

### Exemplos de respostas:

```jsonc
//proxy não foi qualificado.
{
    "status": "DENY",
    "message": "[PROXYNAME] proxy não foi qualificado."
}

//Proxy não aprovado na qualificação.
{
    "status": "DENY",
    "message": "[PROXYNAME] Proxy não aprovado na qualificação."
}

//Manual: continuar esteira, mas requer aprovação manual de SIT no step de aprovações.
{
    "status": "MANUAL",
    "message": ""
}

//Aprovada: segue sem necessidade de aprovação manual de SIT.
{
    "status": "ALLOW",
    "message": ""
}

//Erro: printar a mensagem e continuar esteira, mas requer aprovação manual de SIT no step de aprovações.
{
    "status": "ERROR",
    "message": "Ocorreu um erro ao validar o proxy XXXXXXXXXXXXXX"
}
```

### Validações a serem feitas:

-   MVP: `projectName` deve estar qualificado com o status OK;
-   Pós MVP:
    -   `projectName` deve dar match em:
        -   `specs/${projectName}.json`
            -   paths devem ser métodos cadastrados no SA3;
        -   `apiproxy/${projectName}.xml`
            -   APIProxy name
            -   APIProxy > DisplayName
        -   `apiproxy/proxies/default.xml`
            -   todos os flows devem ter o nome cadastrado no SA3 como um método?
