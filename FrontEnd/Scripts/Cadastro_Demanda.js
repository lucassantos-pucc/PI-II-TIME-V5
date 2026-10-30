/*
    Feito por Arthur Cardoso Martin
    RA: 26006506
*/

import { CadastrarDemandasApi, ListarUsuariosApi, EditarDemandasApi, BuscarFeriadoNacional, RegistrarHistoricoApi } from "./Api.js";
const usuarioLogado = JSON.parse(localStorage.getItem("UsuarioLogado") || "null");

const ehMembro = usuarioLogado?.papel === "Membro da Equipe";

const TRANSICOES_MEMBRO = {
    "Aberta":       ["Em andamento"],
    "Em andamento": ["Em revisão"]
};

const TRANSICOES = { 
    "Aberta":       ["Em andamento", "Cancelado"],
    "Em andamento": ["Em revisão", "Cancelado"],          
    "Em revisão":   ["Concluída", "Em andamento", "Cancelado"],
    "Concluída":    [],                                    
    "Cancelado":    []
};
function StatusPermitidos(statusAtual) {
    const tabela = ehMembro ? TRANSICOES_MEMBRO : TRANSICOES;
    return [statusAtual, ...(tabela[statusAtual] ?? [])];
}

function AplicarRegrasDeStatus(statusAtual) {
    const select = document.getElementById("status_id");
    const permitidos = StatusPermitidos(statusAtual);

    for (const opcao of select.options) {
        opcao.disabled = !permitidos.includes(opcao.value);
    }
    select.value = statusAtual;

    if (permitidos.length <= 1) {
        select.disabled = true;
        if (ehMembro) document.getElementById("botaoCriar_id").disabled = true;
    }
}

function TravarCamposParaMembro() {
    const campos = [titulo, prazo, responsavel, descricao,
                    document.getElementById("tipos_id"),
                    document.getElementById("prioridade_id")];
    for (const campo of campos) campo.disabled = true;
}
let statusOriginal = "";
// O da direita são os campos na direita é o valor dele
const CAMPOS_HISTORICO = [
    ["titulo", "Título"],
    ["tipo", "Tipo"],
    ["prioridade", "Prioridade"],
    ["statusDemanda", "Status"],
    ["prazoFinalizacao", "Prazo"],
    ["responsavel", "Responsável"],
    ["descricao", "Descrição"],
];

// Deixa o valor legível e no mesmo formato nos dois lados da comparação
function ValorParaHistorico(chave, valor) {
    if (valor === null || valor === undefined || String(valor).trim() === "") {
        return "(vazio)"; // caso nao exista o valor
    }
    // arrumar o prazo 
    // do select vem yyyy/mm/dd e do localstorage vem como dd/mm/yyyy
    if (chave === "prazoFinalizacao" && /^\d{4}-\d{2}-\d{2}/.test(valor)) { //Usa regex para ver sé é uma data valida
        const [a, m, d] = valor.slice(0, 10).split("-"); // pega o valor como um array e separa em y y y y - m m - d d e separa nas '-'
        return `${d}/${m}/${a}`;
    }
    return String(valor).trim(); // padronizar o valor
}

function GerarDescricaoHistorico(antes, depois) {
    const mudancas = [];

    for (const [chave, nome] of CAMPOS_HISTORICO) {
        const valorAntes = ValorParaHistorico(chave, antes[chave]);
        const valorDepois = ValorParaHistorico(chave, depois[chave]);

        // Nome do responsável: "Mariana" e "mariana" são o mesmo usuário
        const igual = chave === "responsavel"
            ? valorAntes.toLowerCase() === valorDepois.toLowerCase()
            : valorAntes === valorDepois;
        if (igual) continue;

        if (chave === "descricao") {
            mudancas.push("Descrição alterada"); // o texto pode ser longo, não vai inteiro
        } else {
            mudancas.push(`${nome} alterado de "${valorAntes}" para "${valorDepois}"`);
        }
    }

    return mudancas.join("; ");
}
const form = document.querySelector("form");

const titulo = document.getElementById("titulo_id");
const prazo = document.getElementById("prazo_id");
const responsavel = document.getElementById("Responsavel_id");
const descricao = document.getElementById("descricao_id");
const usuarios = await ListarUsuariosApi();
let id_responsavel, id_demanda;
let editar = 0;
let prazoOriginal = "";

if (localStorage.getItem("DemandaAtual") && localStorage.getItem("DemandaAtual") !== "{}") { // Pega os valores armazenados no localStorage e coloca nos inputs
    const demandaAtual = JSON.parse(localStorage.getItem("DemandaAtual"));
    titulo.value = demandaAtual.titulo;
    console.log(demandaAtual.prazoFinalizacao)
    prazo.value = demandaAtual.prazoFinalizacao
        ? demandaAtual.prazoFinalizacao.split("/").reverse().join("-")
        : "";
    prazoOriginal = prazo.value;
    document.getElementById("cadastro").innerHTML = "Editar Demanda"
    document.getElementById("prioridade_id").value = demandaAtual.prioridade;
    document.getElementById("status_id").value = demandaAtual.statusDemanda;
    document.getElementById("tipos_id").value = demandaAtual.tipo;
    responsavel.value = demandaAtual.responsavel;
    descricao.value = demandaAtual.descricao;
    editar =1
    id_demanda = demandaAtual.id_demanda;
    statusOriginal = demandaAtual.statusDemanda;
    AplicarRegrasDeStatus(statusOriginal);
    if (ehMembro) TravarCamposParaMembro();
    
}
if (editar === 0 && ehMembro) {
    alert("Apenas Administrador e Líder de Projeto podem criar demandas.");
    open("Listagem_Demanda.html", "_self");
}


form.addEventListener("submit",async function (event) {
    event.preventDefault();
    const nomeResp = responsavel.value.trim();
    id_responsavel = undefined;
    for (const usuario of usuarios.usuarios){
        if (nomeResp.toLowerCase() === usuario.nome.toLowerCase()) {
            id_responsavel = usuario.id_usuario;
        }

    }

    const erros = [];
    if (titulo.value.trim().length < 3) {
        erros.push("O título deve ter pelo menos 3 caracteres.");
    }
    else if(titulo.value.trim().length > 30){
        erros.push("O título não deve ter mais de 30 caracteres.")
    }
    if (prazo.value) {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const [a, m, d] = prazo.value.split("-").map(Number);
        if (new Date(a, m - 1, d) <= hoje) {
            erros.push("O prazo deve ser uma data futura.");
        }
    }
    if(responsavel.value !== "" && id_responsavel === undefined){
        erros.push("O Responsavel não existe.");

    }
    if (erros.length > 0) {
        alert(erros.join("\n")); 
        return;
    }

    if (prazo.value && prazo.value !== prazoOriginal) {
        try {
            const feriado = await BuscarFeriadoNacional(prazo.value);
            if (feriado) {
                alert(`O prazo não pode ser um feriado nacional: ${feriado.name} (${prazo.value.split("-").reverse().join("/")}).`);
                return;
            }
        } catch (e) {
            alert("Não foi possível verificar se a data é feriado. Tente novamente.");
            return;
        }
    }

    const demanda = { //Preparar a estrutura para json
        id_demanda: id_demanda,
        titulo: titulo.value.trim(),
        tipo: document.getElementById("tipos_id").value,
        prioridade: document.getElementById("prioridade_id").value,
        prazoFinalizacao: prazo.value || null,
        statusDemanda: document.getElementById("status_id").value,
        descricao: descricao.value.trim(),
        id_projeto: Number(localStorage.getItem("Projeto")),
        id_responsavel: responsavel.value !== "" ? id_responsavel : null ,
    };

    try{
        if (editar ===0){
            console.log(await CadastrarDemandasApi(demanda));
            open("Listagem_Demanda.html", "_self");
        }else{        
            const antiga = JSON.parse(localStorage.getItem("DemandaAtual") || "{}");
            const descricaoHistorico = GerarDescricaoHistorico(antiga, {
                ...demanda,
                responsavel: nomeResp
            });

            await EditarDemandasApi(id_demanda, demanda);

            if (descricaoHistorico && usuarioLogado) {
                try {
                    const historico ={
                        id_demanda: id_demanda,
                        id_autor: usuarioLogado.id_usuario,
                        descricao: descricaoHistorico
                    }
                    console.log(historico)
                    await RegistrarHistoricoApi(historico);
                } catch (e) {
                    console.error("Falha ao registrar o histórico:", e);
                }
            }

            const json = JSON.stringify({
                ...antiga,
                ...demanda,
                prazoFinalizacao: prazo.value ? prazo.value.split("-").reverse().join("/") : "",
                responsavel: nomeResp
            });
            localStorage.setItem("DemandaAtual", json);
            sessionStorage.setItem("DemandaAtual", json);
            open("Demanda.html", "_self");
        }
    }catch (e){
        alert(e.message)
    }
});