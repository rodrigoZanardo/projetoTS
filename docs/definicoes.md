# Definições:

## Status:
- [DRAFT] Draft: quando queremos apenas deixar algo anotado, não envia ata;
- [OK] Qualificado: aprovado para produção;
- [NOK] Não Qualificado: passou por call de qualificação, mas tem algo errado ou alguma pendência a ser validada (ex falta de informação). Isto deve ser anotado nas notas públicas para o envio de ata;

Notas:
- Deve ser criado um checkbox (off by default) com label `Requer aprovação manual`, que deve ser usado nos casos onde um proxy é aprovado, mas nós queremos fazer alguma validação antes dele entrar em produção, como por exemplo ver se alguma condição paralela foi atendida;
- O proxy não pode voltar a ser DRAFT após ter virado OK/NOK.


## Envio de ata:
- Se o status for draft, não pode enviar ata;
- Se está deixando de ser draft, o envio de ata é obrigatório;

> Em outras palavras:  
> Draft não gera ata, e envio de ata é opcional exceto se estiver deixando de ser draft.  
> Isto permite que façamos alterações de anotações sem envio de nova ata, e ao mesmo tempo obriga que uma ata seja enviada sempre que algo for qualificado.  
> Caso o analista queira validar algo com SIT antes do envio da ata, ele marca como draft e depois volta e marca como qualificado.  


## Pendências:
As pendências servem para acompanhamento _pós-produção_, ou seja, toda API marcada como Qualificada está aprovada para produção, independente de pendências.  
Desta forma decisão de aprovação de esteira fica 100% com decisão humana.


## Histórico:
O histórico será uma tabela (documentada no `log.jsonc`) contendo alterações de proxies, pedidos de validação CICD, e resultados do log de auditoria do Apigee (por hora apenas new proxy ou nova associação de app à produto).

Página do proxy:
- Deve chamar os dados do proxy, e os logs separadamente, pra garantir que a interface carregue rápido (e api limpa); FIXME: Atualizar
- A aba Histórico vai conter, de forma intercalada tanto os cards de qualificação, como notas pequenas com logs de auditoria e cicd, dessa forma no histórico vamos poder ver se essa API já foi aprovada, ou saber o motivo que o SA3 reprovou a mesma;
- Exibir todos os resultados no histórico, sem paginação por enquanto.

Página de log:
- Dump completo de toda a tabela de histórico;
- Reutilizar o mesmo card da página de proxies, mas exibir também o nome do proxy;
- Exibir todos os resultados no histórico, sem paginação por enquanto.


## Grupos de usuários:
- Maintainer
    - pode apagar proxy
- Analyst
    - todas as operações de proxy menos apagar
    - pode ver auditoria do Apigee
- ReadOnly
    - Para time pentest, consultores, time de prod, coee (em ordem de prioridade)
    - não pode ver lista de usuários
    - não pode ver log do apigee
    - não pode ver notas internas
    - não pode ver destinatário das atas, apenas nome do LT e Consultor
    - não pode editar proxy

## Líder Técnico:
As APIs não tem mais líder técnico, apenas mudanças contém um.
Desta forma, não mostrar mais LT na página de proxies, apenas no histórico de um proxy específico e em atas.


## Artefatos:
Por hora remover a opção de salvamento de artefatos, inclusive swagger.


# MVP
- Logs de ações e de requisições de deploy
- Funções de Auth&Auth, assim como logout (com rate limiting)
- Listagem de proxies (visão one note)
- Cadastro de proxy
    - Todas as regras de negócios e todos os dados de entendimento
    - Status
- Toda lógica de status, e de aprovação manual
- Aprovação de CICD via apenas nome do proxy (validando com status)
- Todos os requisitos de segurança. Atentar ao CORS e HttpOnly, e CSRF
- Pentest completo
- Estar disponível na internet, com SSL e nginx com rate limiting
- Autenticação com MSAL

- Não precisa:
    - Geração de texto para ata.
    - Conexão com o Jira
    - Envio de email
    - Pendências
    - Rodar em docker 
    - CICD de deploy do SA3



## Volumetria emails
Destinatários comuns: contas Claro, GlobalHitss e poucos parceiros (ex sysmap)
Não é necessário que as pessoas consigam responder ao email, mas é de se esperar que alguns vão "Responder a Todos".

Volumetria máxima estimada:
- 15 emails por dia de semana
- 15 destinatários por email
- 100kb de html

Volumetria média:
- 5 emails por dia
- 8 destinatários por email
- 20kb de html



## Auth consumidor
Cliente: select box simples:
- key
- oauth
- basic
- netflix

Usuário: select box simples:
- idmtoken
- employeeidmtoken
- netsmsoperator (marcar de vermelho)
- claroid (marcar de vermelho)

Adicionais: select box múltiplo:
- allowedips
- captcha
- responsefields (marcar azul)
- allowedvalues (marcar azul)
- "sf-authorizationv1-config configurado" o label, valor pode ser apenas "sfauthorization"


Allowed Verbs: select box multiplo:
- desabilitado (default, da override nos demais)
- GET
- POST
- PUT
- DELETE
- PATCH

> Usar https://codesandbox.io/s/c7v5oj?file=/demo.js para select box "Adicionais"
