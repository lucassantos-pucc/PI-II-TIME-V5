/*
Autores: 

    Feito por:
        Lucas de Oliveira Santos - RA: 26887166
    Modificado por:
        Arthur Cardoso Martin - RA: 26006506

*/
//CRIAR HISTORICO NO FRONT

import { CarregarHistoricoApi, RegistrarHistoricoApi, BuscarDemandasApi, BuscarProjetoApi,  } from "./Api.js";

// parte grafica
async function CriarHistorico(info){
    
    const Historico_cr = document.createElement('li');
    Historico_cr.classList.add("historico-item"); //adiciona a classe

    const span = document.createElement('span'); 
    span.classList.add('historico-texto'); 

    const strong = document.createElement("strong"); 
    strong.textContent = info.nome;

    span.appendChild(strong);
    for (const linha in info.descricao.split("; ")){
        span.appendChild(document.createElement("br"))
        span.appendChild(document.createTextNode(info.descricao.split("; ")[linha]));
    }

    Historico_cr.appendChild(span);

    // Criar data do histórico
    const data = document.createElement("span");
    data.classList.add("historico-data");

    const dataHora = new Date(info.dataHora);
    data.textContent = dataHora.toLocaleString("pt-BR");
    
    Historico_cr.appendChild(data);

    // Adicionar o histórico na lista do HTML
    document.querySelector("ul").appendChild(Historico_cr);
}

async function MostrarHistorico(){
    //localStorage.setItem("DemandaAtual", 1)
    const demandaAtual = JSON.parse(localStorage.getItem("DemandaAtual"));

    if(!demandaAtual.id_demanda){
        console.log("nenhuma demanda selecionada.");
        return;
    }

    try{
        const historicos = await CarregarHistoricoApi(demandaAtual.id_demanda);
        let tamanho = historicos.length;
        let historico = 0
        while(historico < tamanho){
            CriarHistorico(historicos[historico])
            historico++;
        }
    }

    catch (erro) {
    console.log("Erro ao carregar histórico:", erro);
    }
}

// Deixa o valor legível e no mesmo formato nos dois lados da comparação
function ValorParaHistorico(chave, valor) {
    if (valor === null || valor === undefined || String(valor).trim() === "") {
        return "(vazio)"; // caso nao exista o valor
    }
    // arrumar o prazo 
    // do select vem yyyy/mm/dd e do localstorage vem como dd/mm/yyyy
    if (chave === "prazoFinalizacao" && /^\d{4}-\d{2}-\d{2}/.test(valor)) { //Usa regex para ver sé é uma data valida
        const [a, m, d] = valor.slice(0, 10).split("-"); // pega o valor e separa em y y y y - m m - d d e separa nas '-' nas variaveis
        return `${d}/${m}/${a}`; // retorna formatado como dd/mm/yyyy
    }
    return String(valor).trim(); // caso nao seja nenhum dos casos acima, retorna o valor como string
}

export async function RegistrarHistorico(demandaAtual, demandaAntiga) {
    const CAMPOS_HISTORICO = [
        ["titulo", "Título"],
        ["tipo", "Tipo"],
        ["prioridade", "Prioridade"],
        ["statusDemanda", "Status"],
        ["prazoFinalizacao", "Prazo"],
        ["responsavel", "Responsável"],
        ["descricao", "Descrição"],
    ];
    const autor = JSON.parse(localStorage.getItem("UsuarioLogado")).id_usuario;
    const mudancas = [];

    for (const [chave, nome] of CAMPOS_HISTORICO) { // para cada campo que pode ser alterado, pega o valor antes e depois da alteração e compara
        const valorAntes = ValorParaHistorico(chave, demandaAntiga[chave]);
        const valorDepois = ValorParaHistorico(chave, demandaAtual[chave]);

        // Nome do responsável: "Mariana" e "mariana" são o mesmo usuário, usa operador ternario
        const igual = chave === "responsavel"
            ? valorAntes.toLowerCase() === valorDepois.toLowerCase()
            : valorAntes === valorDepois;
        if (igual) continue;

        if (chave === "descricao") {
            mudancas.push("Descrição alterada"); // o texto pode ser longo, entao no historico apenas registra que houve alteração
        } else {
            mudancas.push(`${nome} alterado de "${valorAntes}" para "${valorDepois}"`);
        }
    }
    const descricao = mudancas.join("; ");
    //verificar os campos que mudaram
    // Verificar se é uma demanda nova
    if (descricao === "") {
        console.log("Nenhuma alteração realizada.");
        return;
    }
    try {
        const historico ={
            id_demanda: demandaAtual.id_demanda,
            id_autor: autor,
            descricao: descricao
        }
        console.log(historico)
        await RegistrarHistoricoApi(historico);
    } catch (e) {
        console.error("Falha ao registrar o histórico:", e);
    }
}
if (window.location.pathname.endsWith("/historico.html")) {
    MostrarHistorico();
}