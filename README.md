# neocortex_teste_tecnico

Mineração de dados da Câmara Municipal de Chapecó com o objetivo de extrair os dados dos projetos de lei da câmara municipal de Chapecó, através da URL a seguir:

[https://www.legislador.com.br/LegisladorWEB.ASP?WCI=ProjetoTramite&ID=20&dsVerbete=transporte](https://www.legislador.com.br/LegisladorWEB.ASP?WCI=ProjetoTramite&ID=20&dsVerbete=transporte)

# Como testar:

1.  Clone este repositório.
2.  Garanta que o Visual Studio Code e o Docker estejam devidamente instalados.
3.  Abra o Visual Studio Code, instale a extensão [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) .
4.  Reabra o projeto em um devcontainer.
5.  Após a inicialização do contêiner, execute o comando `npm run test:ci` para garantir que tudo ira funcionar.
6.  Faça o build da aplicação com `npm run build`.
7.  Rode a aplicação com `npm start`.

# Observações :

- Todas a linhas estao cobertas com testes, mas para integracao a cobertura esta desativada, pois, `jest --coverage` não funciona bem com puppeteer ( [Issue#7962](https://github.com/facebook/jest/issues/7962) ).
- Os testes não funcionarão fora do devcontainer.
