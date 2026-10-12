
//Feito por: Lucas de Oliveira Santos
//RA: 26887166

// !! Pra rodar localmente na máquina de vocês, 
// dem right click na pasta do backend, em open integrated terminal
// Executar:  'npm install express'  ,  'npx tsc'  e  'npm i tsc-watch -D' , vai criar as pastas do node_modules e lib
// Por fim, 'npm start' pra rodar o servidor

import { Request, Response } from "express";
//import RouterLogin from "./login";
import RouterDashboard from "./dashboard";
import RouterListagem from "./listagem";
//import RouterGerenciamento from "./gerenciamento";
import RouterDetalhes from "./detalhes";

// Importando as rotas
import demandasRotas from "./rotas/demandas";
import projetosRotas from "./rotas/projetos";

const express = require("express");

const app = express();
app.use(express.json());

app.use(express.json());

app.get("/", (req: Request, res: Response) => { //retorno do servidor 
    res.send("Olá! Meu servidor está funcionando (agora em typescript)!");
});

// Conectando as rotas
app.use("/demandas", demandasRotas);
app.use("/projetos", projetosRotas);

app.listen(3000, () => { //porta em que o server esta sendo rodado
    console.log("Servidor rodando em http://localhost:3000");
});

//app.use(RouterLogin);
app.use(RouterDashboard);
app.use(RouterListagem);
//app.use(RouterGerenciamento);
app.use(RouterDetalhes);