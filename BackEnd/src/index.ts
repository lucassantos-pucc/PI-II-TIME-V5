
//Feito por: Lucas de Oliveira Santos
//RA: 26887166

// !! Pra rodar localmente na máquina de vocês, 
// dem right click na pasta do backend, em open integrated terminal
// Executar:  'node install express'  ,  'npx tsc'  e  'npm i tsc-watch -D' , vai criar as pastas do node_modules e lib
// Por fim, 'npm start' pra rodar o servidor

const express = require("express");

const app = express();

app.get("/", (req: any, res: any) => { //retorno do servidor 
    res.send("Olá! Meu servidor está funcionando (agora em typescript)!");
});

app.listen(3000, () => { //porta em que o server esta sendo rodado
    console.log("Servidor rodando em http://localhost:3000");
});