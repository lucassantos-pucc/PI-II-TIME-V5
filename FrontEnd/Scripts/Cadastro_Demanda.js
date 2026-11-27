/*
Autores: 

    Feito por:
        Arthur Cardoso Martin - RA: 26006506

    Modificado por: 
        Lucas Studach Kaid Ludemann - RA: 26006454 

    */

import { CadastrarDemandasApi, ListarUsuariosApi, EditarDemandasApi, BuscarFeriadoNacional, RegistrarHistoricoApi, BuscarVinculadosProjeto } from "./Api.js";
import { RegistrarHistorico } from "./Historico.js";
const usuarioLogado = JSON.parse(localStorage.getItem("UsuarioLogado") || "null");
const Projeto = JSON.parse(localStorage.getItem("Projeto") || "null");

// Verifica se o usuário logado é membro de equipe e separa o campo de id do usuário e do projeto
const ehMembro = usuarioLogado?.papel === "Membro da equipe";
const id_usuario = usuarioLogado ? usuarioLogado.id_usuario: null;
const id_projeto = Projeto? Projeto:null;

// Dicionarios com as transições de status permitidas para membros e não membros
const TRANSICOES_MEMBRO = {
    "Aberta":       ["Em andamento"],
    "Em andamento": ["Em revisão"]
};

const TRANSICOES = { 
    "Aberta":       ["Em andamento", "Cancelada"],
    "Em andamento": ["Em revisão", "Cancelada"],          
    "Em revisão":   ["Concluída", "Em andamento", "Cancelada"],
    "Concluída":    [],                                    
    "Cancelada":    []
};

function StatusPermitidos(statusAtual) { // pega o status atual e retorna os status permitidos para o usuário logado
    const tabela = ehMembro ? TRANSICOES_MEMBRO : TRANSICOES;
    return [statusAtual, ...(tabela[statusAtual] ?? [])];
}

function AplicarRegrasDeStatus(statusAtual) {
    const select = document.getElementById("status_id");
    const permitidos = StatusPermitidos(statusAtual);
    // Desabilita as opções que não são permitidas
    for (const opcao of select.options) {
        opcao.disabled = !permitidos.includes(opcao.value);
    }
    select.value = statusAtual;

    if (permitidos.length <= 1) {
        select.disabled = true;
        if (ehMembro) document.getElementById("botaoCriar_id").disabled = true;
    }
}

function TravarCamposParaMembro() { // Travar os campos de criação/editar para membros de equipe
    const campos = [titulo, prazo, responsavel, descricao,
                    document.getElementById("tipos_id"),
                    document.getElementById("prioridade_id")];
    for (const campo of campos) campo.disabled = true;
}
let statusOriginal = "";
// Campos que podem ser alterados e que devem ser registrados no histórico
// Esquerda é o campo e na direita é o valor

// Um dropdown para escolher um responsavel da demanda dentre os usuários do projeto
async function DropdownResponsavel(id_projeto)
{
    const projeto = await BuscarVinculadosProjeto(id_usuario, id_projeto);

    projeto.forEach(item => {
        const escolha = document.createElement('option');
        escolha.value = item.id_usuario;
        escolha.innerHTML = item.nome;
        responsavel.appendChild(escolha);
        console.log(item);
    });
}

const form = document.querySelector("form");

const titulo = document.getElementById("titulo_id");
const prazo = document.getElementById("prazo_id");
const responsavel = document.getElementById("responsavel_id");
const descricao = document.getElementById("descricao_id");
const usuarios = await ListarUsuariosApi();
let id_responsavel, id_demanda;
let editar = 0;
let prazoOriginal = "";

//Criacao do dropdown
await DropdownResponsavel(id_projeto);

// Pega os valores armazenados no localStorage e coloca nos inputs
// Apenas caso seja para editar a demanda, caso contrario os campos ficam em branco
if (localStorage.getItem("DemandaAtual") && localStorage.getItem("DemandaAtual") !== "{}") { 
    const demandaAtual = JSON.parse(localStorage.getItem("DemandaAtual"));
    titulo.value = demandaAtual.titulo;
    prazo.value = demandaAtual.prazoFinalizacao
        ? demandaAtual.prazoFinalizacao.split("/").reverse().join("-")
        : "";
    prazoOriginal = prazo.value;
    document.getElementById("cadastro").innerHTML = "Editar Demanda";
    document.getElementById("botaoCriar_id").innerText = "Editar";
    document.getElementById("prioridade_id").value = demandaAtual.prioridade;
    document.getElementById("status_id").value = demandaAtual.statusDemanda;
    document.getElementById("tipos_id").value = demandaAtual.tipo;
    responsavel.value = demandaAtual.id_responsavel;
    descricao.value = demandaAtual.descricao;
    editar =1
    id_demanda = demandaAtual.id_demanda;
    statusOriginal = demandaAtual.statusDemanda;
    AplicarRegrasDeStatus(statusOriginal);
    if (ehMembro) { TravarCamposParaMembro(); }
    
}
if (editar === 0 && ehMembro) {
    alert("Apenas Administrador e Líder de Projeto podem criar demandas.");
    open("Listagem_Demanda.html", "_self");
}


form.addEventListener("submit",async function (event) {
    event.preventDefault();
    // verifica se o responsavel selecionado existe no projeto e salva o seu id e seu nome
    id_responsavel = responsavel.value !== "" ? Number(responsavel.value) : null;
    const nomeResp = responsavel.value !== ""
        ? responsavel.selectedOptions[0]?.textContent ?? ""
        : "";
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

    try {
        if (editar === 0) {
            console.log(await CadastrarDemandasApi({...demanda, id_criador: id_usuario}));
            open("Listagem_Demanda.html", "_self");
        }
        
        else {        
            const antiga = JSON.parse(localStorage.getItem("DemandaAtual") || "{}"); // armazena a demanda original em uma variavel para comparar com a nova demanda e gerar o historico
            // usa como novo valor o que foi digitado no form mais o nome do responsavel alem do id 
            // nao armazena o nome do responsavel no banco, apenas o id, mas para gerar o historico precisa do nome
            console.log(await EditarDemandasApi(id_demanda, demanda));
            await RegistrarHistorico(
                {
                    ...demanda,
                    responsavel: nomeResp || "Nenhum"
                },
                {
                    ...antiga,
                    responsavel: antiga.responsavel || "Nenhum"
                }
            );
            // atualiza a demanda no localStorage e sessionStorage para que a página de demanda seja atualizada com os novos valores
            //herda os valores antigos da demanda e atualiza com os novos valores, para que não perca nenhum valor que não foi alterado no form            
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
    }

    catch (e) {
        alert(e.message)
    }
});