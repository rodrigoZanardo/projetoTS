# Pages


## Dashboard
- TODO: estatísticas genéricas de quantidade de qualificações e etc


## Proxy List (Visão OneNote) (temporariamente a Home)
- Busca fusiforme em todos os proxies;
    - Pegar lista do nome de todos os proxies;
    - Buscar neles usando Fuse.js;
- Lista paginada dos proxies (25 por página)
    - Busca pode ser filtrada por:
        - status DRAFT/OK/NOK (selectbox)
        - código do projeto (ex `DP-123`)
    - Busca pode ser ordenada por Data Criação, Data Modificação e Nome Asc ou Desc (2 select boxes)
- Cada proxy:
    - será mostrado com a "visão one note"
    - deve ser possível copiar seu texto para o clipboard mantendo formatação (usar ul, li e mark)
    - deve mostrar o status do proxy
    - bonus: mostrar data de modificação
    - quando clicar no nome do proxy você vai ser redirecionado pra página dedicada dele onde é possível ler/editar os dados


## Proxy Page
Esta página contém todas as informações de um proxy, exceto histórico.
- Título: Nome do proxy || "novo proxy"
- Botão de remover (exibição condicional por permissão)
- Botão "histórico" que vai abrir link da página de histórico
- Requisito: não deixar concluir uma qualificação se tiver erros do schema Joi

Ela se aproxima de um fluxo de uma qualificação, com as etapas sendo:
- Identificação
    - Coletar nome do proxy
    - Coletar ID do projeto (código Jira)
- Entendimento
    - Consumidores
    - Backends
    - Métodos
- Pendências
    - Lista de pendências
    - Form de criação de pendência:
        - Data de início:
            - Agora (na api enviar timestamp atual)
            - Selecionar data (calendário ou input type date)
            - Aguardar prod (na api setar como `wait_prod`)
        - remover o campo "projeto"
        - Descrição
- Interno
    - Notas SIT
    - Notas Pentest
- Conclusão
    - Status (manter como está)
    - Remover botão enviar ata, isso fica implícito por ter ou não emails como destinatário
    - Destinatários
        - disabled se selecionar status DRAFT
        - required se o status era DRAFT e não é mais
        - criar "email chips" (ex https://codesandbox.io/embed/ypyxr11109)
    - remover botão "gerar ata"
- Em todas as etapas mostrar o campo "Notas Públicas"



## Histórico
Exibir registros do nosso log, sendo filtrados ou paginados.
Tipos de logs:
- Qualificação (gerados ao qualificar uma API)
- Logs de deploy (tentativas/sucessos) (gerados no sa3 quando uma api bate nos `/cicd/validate/apigee/xxx`)
- Auditoria de deploy (capturados nos Apigees)
- Auditoria de new consumer (capturados nos Apigees)

> copiar e alterar cards do @dev/src/components/proxy/Historico.js

- Exibir opções de filtro
    - por proxy name (wildcard pode ser usado)
    - por proxy id
- Paginado
- Página do proxy pode abrir um link pra essa página que já vem filtrada (ex via querystring ou hashstring)


## Pendências
- Linha do tempo mostrando acima as pendências mais antigas
- Em vermelho pendências que já expiraram
- Amarelo as pendências que vão expirar em menos de duas semanas
- Acima de duas semanas não precisam ter cor (cinza?)


## Usuários
- tabela com
    - nome
    - email
    - groups
