
// Feito por: Vitor Kenzo Pina Takemasa
// RA: 26007167

import { ListarDemandasApi, ListarProjetoApi, ListarUsuarioApi} from "./Api.js";

localStorage.setItem("DemandaAtual", JSON.stringify({})); // Para limpar o campo de demanda atual por preucação

async function CreateDemanda(info) {
    //console.log("Criando demanda:", info);
    const [projeto] = await ListarProjetoApi(localStorage.getItem("Projeto"));
    const responsavel = await ListarUsuarioApi(projeto.id_lider);
    let criação = correctDate(new Date(info.dataCriacao));
    let prazo = correctDate(new Date(info.prazoFinalizacao));
    const Dem_Cr = document.createElement('button'); // Demanda Criada
    Dem_Cr.classList.add("demanda-card");

    const h3 = document.createElement('h3');
    h3.appendChild(document.createTextNode(info.titulo));
    Dem_Cr.appendChild(h3);

    Dem_Cr.appendChild(document.createElement('hr'));

    const box = document.createElement('div');
    box.classList.add("caixa");

    box.appendChild(DemandaContent("tipo-gen", "Tipo: " + info.tipo));
    box.appendChild(DemandaContent("prioridade-gen", "Prioridade: " + info.prioridade));
    box.appendChild(DemandaContent("status-gen", "Status: " + info.statusDemanda));
    box.appendChild(DemandaContent("projeto-gen", "Projeto: " + projeto.titulo)); // Em teoria é pra ser o nome mas deixa assim por enquanto
    box.appendChild(DemandaContent("responsavel-gen", "Responsável: " + responsavel.usuario.nome));
    box.appendChild(DemandaContent("DTcriacao-gen", "Data de criacao: " + criação));
    box.appendChild(DemandaContent("prazo-gen", "Prazo: " + prazo));

    Dem_Cr.appendChild(box);
    const demanda = {
        id_demanda: info.id,
        titulo: info.titulo,
        tipo: info.tipo,
        prioridade: info.prioridade,
        statusDemanda: info.statusDemanda,
        projeto: projeto.titulo,
        responsavel: responsavel.usuario.nome,
        dataCriacao: criação,
        prazoFinalizacao: prazo,
        descricao: info.descricao
    }
    info.descricao = info.descricao ? info.descricao : "Sem descrição"; // Se não houver descrição, exibe "Sem descrição"
    Dem_Cr.addEventListener("click", () => {
        localStorage.setItem("DemandaAtual", JSON.stringify(demanda));
        window.open("Demanda.html", "_blank");
    });

    document.getElementById("secao-demanda").appendChild(Dem_Cr);
}

function DemandaContent(classe, texto) {
    const content = document.createElement('div');
    content.classList.add("gen");
    content.classList.add(classe);

    const p = document.createElement('p');
    p.appendChild(document.createTextNode(texto));

    content.appendChild(p);
    
    return content;
}

function PriorityColor(p) {
    if (!p) { //So coloquei isso para evitar problema de estar vazio
        return;
    }

    const prio = p.textContent.toLowerCase(); // Variável de simplificação da sintaxe
    
    // Aplica as cores de fundo respectivas
    if (prio.includes("baixa")) {
        p.classList.add("prioridade-b-gen");
    }
        
    else if (prio.includes("média")) {
        p.classList.add("prioridade-m-gen");
    }
        
    else if (prio.includes("alta")) {
        p.classList.add("prioridade-a-gen");
    }
        
    else if (prio.includes("crítica")) {
        p.classList.add("prioridade-c-gen");
    }
}

function StatusColor(p) {
    if (!p) { //So coloquei isso para evitar problema de estar vazio
        return;
    }

    const stat = p.textContent.toLowerCase(); // Variável de simplificação da sintaxe
    
    // Aplica as cores de fundo respectivas
    if (stat.includes("aberta")) {
        p.classList.add("status-aberta");
    }
        
    else if (stat.includes("andamento")) {
        p.classList.add("status-andamento");
    }
    
    else if (stat.includes("em revisão")) {
        p.classList.add("status-revisao");
    }
        
    else if (stat.includes("concluido")) {
        p.classList.add("status-concluido");
    }
        
    else if (stat.includes("cancelado")) {
        p.classList.add("status-cancelado");
    }
}


function correctDate(date){
    const dia = date.getDate();
    const mes = date.getMonth() + 1;
    date = (dia < 10 ? "0" + dia : dia) + "/" +
        (mes < 10 ? "0" + mes : mes) + "/" +
        date.getFullYear();
    return date;
}

const id = localStorage.getItem("Projeto");
const jsondemandas = await ListarDemandasApi(id); console.log(jsondemandas[0]);

for (const demanda of jsondemandas) { //Criar demandas padrões
    await CreateDemanda(demanda);
}


// Obtém os elementos de prioridade com base na classe geral de prioridade
const ElementosPrioridade = document.getElementsByClassName("prioridade-gen");
// Itera por todos as prioridades
for (const prioridade of ElementosPrioridade) {
    PriorityColor(prioridade);
}

// Obtém os elementos de status com base na classe geral de status
const ElementosStatus = document.getElementsByClassName("status-gen");
    
// Itera por todos os status
for (const status of ElementosStatus) {
    StatusColor(status);
}