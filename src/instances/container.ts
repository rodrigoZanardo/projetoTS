/*
    NOTE: 
    Esse é um hack pra não ter que fazer dependency injection em todo o projeto
    Estamos retornando um container inspirado no design pattern de Singleton para
    conter instancias e propriedades que vamos compartilhar em todo o código.
    Estamos usando um Symbol pra garantir que essa variável global não vai interferir 
    com nada fora do nosso escopo, incluindo bibliotecas;
    
    Vantagens:
        - Fácil jogar em toda codebase
        - Pode ser scoped
        - Syntatic sugar
    Desvantagens: 
        - Seus colegas de trabalho podem te respeitar menos por estar usando 
          variáveis globais, mesmo considerando que este pattern (usando Symbol)
          não fere nenhuma das principais críticas de se usar variáveis Globais.
  
   https://derickbailey.com/2016/03/09/creating-a-true-singleton-in-node-js-with-es6-symbols/
*/
module.exports = (scope: string) => {
    // create a unique, global symbol name
    const CONTAINER_KEY = Symbol.for(scope ?? `container:${__dirname}`);

    // instantiate it as a new map
    if (!Object.getOwnPropertySymbols(globalThis).includes(CONTAINER_KEY)) {
        globalThis[CONTAINER_KEY] = new Map();
    }

    // return container + contained
    const out = Object.fromEntries(globalThis[CONTAINER_KEY].entries());
    out.container = globalThis[CONTAINER_KEY];
    Object.freeze(out);
    return out;
};
