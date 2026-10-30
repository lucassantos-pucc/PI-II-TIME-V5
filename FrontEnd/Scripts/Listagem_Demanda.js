// Feito por: Vitor Kenzo Pina Takemasa
// RA: 26007167

import { ListarDemandasApi, BuscarProjetoApi, ListarUsuarioApi } from "./Api.js";
localStorage.setItem("DemandaAtual", JSON.stringify({}));
sessionStorage.setItem("DemandaAtual", "");

function FormatarPrazo(valor) {
    if (!valor) return "";
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(valor);
    return m ? `${m[3]}/${m[2]}/${m[1]}` : "";
}

function FormatarCriacao(valor) {
    const d = new Date(valor);
    return isNaN(d) ? "" : d.toLocaleDateString("pt-BR");
}

const cacheUsuarios = {};
async function NomeUsuario(id) {
    if (id == null) return "";
    cacheUsuarios[id] ??= ListarUsuarioApi(id).then(r => r.usuario.nome);
    return cacheUsuarios[id];
}

function DemandaContent(classe, texto) {
    const content = document.createElement("div");
    content.classList.add("gen", classe);
    const p = document.createElement("p");
    p.textContent = texto;
    content.appendChild(p);
    return content;
}

async function CreateDemanda(info, projeto) {
    const nomeResp = info.nome_responsavel ?? await NomeUsuario(info.id_responsavel);
    const criacao = FormatarCriacao(info.dataCriacao);
    const prazo = FormatarPrazo(info.prazoFinalizacao);

    const card = document.createElement("button");
    card.classList.add("demanda-card");

    const h3 = document.createElement("h3");
    h3.textContent = info.titulo;
    card.appendChild(h3);
    card.appendChild(document.createElement("hr"));

    const box = document.createElement("div");
    box.classList.add("caixa");
    box.appendChild(DemandaContent("tipo-gen", "Tipo: " + info.tipo));
    box.appendChild(DemandaContent("prioridade-gen", "Prioridade: " + info.prioridade));
    box.appendChild(DemandaContent("status-gen", "Status: " + info.statusDemanda));
    box.appendChild(DemandaContent("projeto-gen", "Projeto: " + projeto.titulo));
    box.appendChild(DemandaContent("responsavel-gen", "Responsável: " + (nomeResp || "Não definido")));
    box.appendChild(DemandaContent("DTcriacao-gen", "Data de criação: " + criacao));
    box.appendChild(DemandaContent("prazo-gen", "Prazo: " + (prazo || "Não definido")));
    card.appendChild(box);

    const demanda = {
        id_demanda: info.id_demanda,
        titulo: info.titulo,
        tipo: info.tipo,
        prioridade: info.prioridade,
        statusDemanda: info.statusDemanda,
        id_projeto: info.id_projeto,
        projeto: projeto.titulo,
        id_responsavel: info.id_responsavel,
        responsavel: nomeResp,            
        dataCriacao: criacao,
        prazoFinalizacao: prazo,          
        descricao: info.descricao ?? ""   
    };

    card.addEventListener("click", () => {
        localStorage.setItem("DemandaAtual", JSON.stringify(demanda));
        window.open("Demanda.html", "_self");
    });

    document.getElementById("secao-demanda").appendChild(card);
}


function PriorityColor(p) {
    const prio = p.textContent.toLowerCase();
    if (prio.includes("baixa")) p.classList.add("prioridade-b-gen");
    else if (prio.includes("média")) p.classList.add("prioridade-m-gen");
    else if (prio.includes("alta")) p.classList.add("prioridade-a-gen");
    else if (prio.includes("crítica")) p.classList.add("prioridade-c-gen");
}

function StatusColor(p) {
    const stat = p.textContent.toLowerCase();
    if (stat.includes("aberta")) p.classList.add("status-aberta");
    else if (stat.includes("andamento")) p.classList.add("status-andamento");
    else if (stat.includes("revisão")) p.classList.add("status-revisao");
    else if (stat.includes("concluída")) p.classList.add("status-concluido");
}
const id_projeto = (localStorage.getItem("Projeto"));
const usuario = JSON.parse(localStorage.getItem("UsuarioLogado") || "null");
let projeto; 

async function CarregarDemandas(filtros = {}) {
    const projetos = await BuscarProjetoApi(id_projeto);
    const projeto = projetos[0];
    const { tipo = "", prioridade = "", status = "", responsavel = "" } = filtros;
    const secao = document.getElementById("secao-demanda");
    secao.innerHTML = "";
     
    const idFiltro = usuario.papel === "Membro da equipe" ? usuario.id_usuario : -1;
    const jsondemandas = await ListarDemandasApi(id_projeto, idFiltro, tipo, prioridade, status, responsavel);

    if (jsondemandas.length === 0) {
        secao.textContent = (tipo || prioridade || status || responsavel)
            ? "Nenhuma demanda corresponde aos filtros."
            : "Nenhuma demanda encontrada.";
        return;
    }

    for (const demanda of jsondemandas) {
        await CreateDemanda(demanda, projeto);
    }

    // Aplica as cores de prioridade e de status
    document.querySelectorAll(".prioridade-gen").forEach(PriorityColor);
    document.querySelectorAll(".status-gen").forEach(StatusColor);
}

document.getElementById("btn-filtrar")?.addEventListener("click", async () => {
    let tipo, prioridade, status, responsavel;
    try { tipo = document.getElementById("filtro_tipo").value; }
    catch { tipo = ""; }
    try { prioridade = document.getElementById("filtro_prioridade").value; }
    catch { prioridade = ""; }
    try { status = document.getElementById("filtro_status").value; }
    catch { status = ""; }
    try { responsavel = document.getElementById("filtro_responsavel").value.trim(); }
    catch { responsavel = ""; }
    try {
        await CarregarDemandas({ tipo, prioridade, status, responsavel });
    } catch (e) {
        console.error(e);
        document.getElementById("secao-demanda").textContent = "Não foi possível carregar as demandas.";
    }
});

if (usuario.papel === "Membro da equipe"){
    document.getElementById("footer").hidden = true;
}
if (!usuario || !id_projeto) {
    console.log("usuario ou projeto faltando");
} else {
    try {
        await CarregarDemandas();
    } catch (e) {
        console.error(e);
        document.getElementById("secao-demanda").textContent = "Não foi possível carregar as demandas.";
    }
}