#  api Caixa Virtual

Projeto backend node, um aplicativo para caixa de loja virtual.

## Getting Started

Essas instruções fornecerão uma cópia do projeto em execução na sua máquina local para fins de desenvolvimento e teste.

### Pre-requisitos

Você primeiro precisa instalar a última versão do MongoDB Community Edtion. 

```
[MongoDB](https://www.mongodb.com/try/download/community)

```

### Intalação

Depois, na pasta no projeto, instale as dependências

```
npm install 

```

## Rodando os testes

Rode os testes e tenha certeza que está tudo funcionando.

npm test

## Iniciando o servidor

npm start

# Uso da API & Endpoints

## Registrar uma loja [POST /api/lojas]

- Request: Adiciona uma nova loja

  - Headers
        Content-type: application/json

  - Body

            {
              "nome": "",
              "email": "",
              "senha": ""
            }

- Response: 200 (application/json)

  - Body

          {
            "_id": "",
            "nome": "",
            "email": ""
          }

## Login com uma Loja [POST /api/authorization]

- Request: Login com as credenciais para receber JSON web token

  - Headers
        Content-type: application/json

  - Body

            {
              "email": "",
              "senha": ""
            }

- Response: 200 (application/json)

  - Body

          {
            "JSON web token"
          }

## Criar uma Categoria [POST /api/categorias]

- Request: Adiciona uma nova categoria

  - Headers
        x-auth-token: JWT
        Content-type: application/json

  - Body

            {
              "nome": ""
            }

- Response: 200 (application/json)

  - Body

          {
              "_id": "",
              "loja": "",
              "nome": ""
          }

## Criar um Caixa [POST /api/categorias]

- Request: Adiciona uma caixa para a loja

  - Headers
        x-auth-token: JWT
        Content-type: application/json

  - Body

            {
              "saldoTotal": ""
            }

- Response: 200 (application/json)

  - Body

          {
              "_id": "",
              "loja": "",
              "saldoTotal": ""
          }

## Criar um Caixa [POST /api/caixa/movimentos]

- Request: Adiciona uma movimentação para o caixa

  - Headers
        x-auth-token: JWT
        Content-type: application/json

  - Body

            {
              "categoriaId": "",
              "tipo":"Saida|Entrada",
              "valor": ,
              "descricao": ""
}

- Response: 200 (application/json)

  - Body

          {
            "_id": "",
            "caixa": "",
            "categoria": {
                "_id": "",
                "nome": ""
              },
            "tipo": "",
            "valor":,
            "descricao": "",
            "data": ""
          }

## Resumo de Caixa [GET /api/caixas]

- Request: Resumo com a movimentação do caixa

  - Headers
        x-auth-token: JWT

- Response: 200 (application/json)

  - Body

          {
            "saldoTotal": "484.98",
            "movimentacoes": [
            {
              "_id": "",
              "categoria": {
                  "_id": "",
                  "nome": ""
                },
              "tipo": "",
              "valor": ,
              "descricao": "",
              "data": ""
            }
          ]
        }

## Variáveis de ambiente

Se você olhar na pasta config/default.json, irá ver uma propriedade jwtPrivateKey. Esta key essa chave é usada para encryptar JSON web tokens. Para produção, você deve armazenar a chave como uma variável de ambiente.


## Construido com

* [Mongo Community Server](https://www.mongodb.com/try/download/community) - Banco de dados para aplicações modernas.
* [Node](https://nodejs.org/en/) - É um ambiente de execução javascript baseado motor V8 JavaScript do Chrome.
* [Jest](https://jestjs.io/) - Jest é um poderoso Framework de Testes em JavaScript com um foco na simplicidade.

## Autor

* **Rafael Yamauchi** - *Initial work* - [Linkedin](https://www.linkedin.com/in/rafaelyamauchi/)

## Licença

Este projeto é licenciado sobre MIT Licença - veja em [LICENSE.md](LICENSE.md) para mais detalhes.
