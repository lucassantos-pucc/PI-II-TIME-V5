
//Feito por: Lucas de Oliveira Santos
//RA: 26887166

const express = require("express");

const app = express();

app.get("/", (req, res) => { //retorno do servidor 
    res.send("Olá! Meu servidor está funcionando!");
});

app.listen(3000, () => { //porta em que o server esta sendo rodado
    console.log("Servidor rodando em http://localhost:3000");
});