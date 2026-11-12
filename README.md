# PI-II-TIME-V5

**Sistema de Acompanhamento de Demandas de Desenvolvimento**, feito para o componente curricular *Projeto Integrador II* na Puc-Campinas no curso de **Engenharia de Software** no segundo semestre do ano de 2026. Com o Professor *Fernando Luiz de Almeida Silveira* como orientador. 

## Membros

- Arthur Cardoso Martin
- Kauã Gaiofato Santana Lima de Jesus
- Luca de Oliveira Santos
- Lucas Studach Kaid Ludemann
- Vitor Kenzo Pina Takemasa

## Instruções

- Executar na pasta BackEnd: 'npm i' e 'npx tsc' , vai criar as pastas do node_modules e lib
- Criar uma instância local do mysql workbench em sua máquina local e criar uma banco chamado PI2
- Criar um arquivo na raiz do repositório chamado .env, e inserir o seguinte conteúdo:
    DB_HOST=localhost
    DB_USER={nome de usuario do mysql workbench}
    DB_PASSWORD={senha do mysql workbench}
    DB_NAME=PI2
    DB_PORT=3306
- Por fim, 'npm start' pra rodar o servidor
- Caso existam inconsistências no banco, alterar a linha 77 do arquivo BackEnd/src/dados/database.ts para true, e depois retornar a false reiniciará o banco com dados pré definidos.