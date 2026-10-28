/*
    Feito por: Lucas de Oliveira Santos
    RA: 26887166
    Modificado por: Arthur Cardoso Martin
    RA: 26006506
*/

// !! Pra rodar localmente na máquina de vocês, 
// dem right click na pasta do backend, em open integrated terminal
// Executar:  'npm i' e 'npx tsc' , vai criar as pastas do node_modules e lib
// Por fim, 'npm start' pra rodar o servidor

import { Request, Response } from "express";
//import RouterLogin from "./login";
//import RouterGerenciamento from "./gerenciamento";

// Importando as rotas
import demandasRotas from "./rotas/demandas";
import projetosRotas from "./rotas/projetos";
import dashboardRotas from "./rotas/dashboard";
import comentariosRotas from "./rotas/comentarios";
import usuariosRotas from "./rotas/usuarios";
import historicoRotas from "./rotas/historico";

const express = require("express");

const app = express();
app.use(express.json());


// Conectando as rotas
app.use("/demandas", demandasRotas);
app.use("/projetos", projetosRotas);

app.use("/historico", historicoRotas);

app.use("/dashboard", dashboardRotas);
app.use("/demandas/:id/comentarios", comentariosRotas);

app.use("/usuarios", usuariosRotas);


app.listen(3000, () => { //porta em que o server esta sendo rodado
    console.log("Servidor rodando em http://localhost:3000");
});

app.get("/", (req: Request, res: Response) => { //retorno do servidor 
    res.send("Olá! Meu servidor está funcionando (agora em typescript)!");
});