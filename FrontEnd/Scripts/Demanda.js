/*
    Feito por: Kauã Gaiofato Santana Lima de Jesus
    RA: 26000195
*/
import {ListarComentarios, CadastrarComentario, ListarUsuarioApi} from "./Api.js"
let demanda = {}; // Demanda que está sendo mostrada nesta aba
let comentarios = []; // Comentários da demanda


// Pega a demanda: primeiro a que esta aba já guardou, senão a que a listagem salvou
function CarregarDemanda() {
    let salva = localStorage.getItem("DemandaAtual");
    sessionStorage.setItem("DemandaAtual", salva); // Guarda na aba, assim se abrir outra demanda em outra aba, esta nao muda
    demanda = JSON.parse(salva);
}

async function CarregarComentarios() {
    comentarios = await ListarComentarios(demanda.id_demanda)
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

    else if (stat.includes("revisao") || stat.includes("revisão")) {
        p.classList.add("status-revisao");
    }

    else if (stat.includes("concluido") || stat.includes("concluída")) {
        p.classList.add("status-concluido");
    }

    else if (stat.includes("cancelado") || stat.includes("cancelada")) {
        p.classList.add("status-cancelado");
    }
}


// Coloca as informações da demanda na tela
function ShowDemanda() {
    document.title = demanda.titulo + " - Demanda";
    console.log(demanda)
    document.getElementById("dem-nome").textContent = demanda.titulo;
    document.getElementById("dem-tipo").textContent = demanda.tipo;
    document.getElementById("dem-prioridade").textContent = demanda.prioridade;
    document.getElementById("dem-status").textContent = demanda.statusDemanda;
    document.getElementById("dem-projeto").textContent = demanda.projeto;
    document.getElementById("dem-responsavel").textContent = demanda.responsavel;
    document.getElementById("dem-criacao").textContent = demanda.dataCriacao;
    document.getElementById("dem-prazo").textContent = demanda.prazoFinalizacao;

    demanda.descricao = demanda.descricao ? demanda.descricao : "Sem descrição"; // Se não houver descrição, exibe "Sem descrição"
    document.getElementById("dem-descricao").textContent = demanda.descricao;

    PriorityColor(document.getElementById("dem-prioridade"));
    StatusColor(document.getElementById("dem-status"));
}


// Cria um comentário na tela
async function CreateComentario(info) {
    const auto = await ListarUsuarioApi(info.id_autor); //autor
    const Com_Cr = document.createElement('li'); // Comentário Criado
    Com_Cr.classList.add("dem-coment");

    const avatar = document.createElement('div');
    avatar.classList.add("dem-avatar");
    avatar.appendChild(document.createTextNode(auto.usuario.nome.charAt(0).toUpperCase())); // Primeira letra do nome
    Com_Cr.appendChild(avatar);

    const caixa = document.createElement('div');
    caixa.classList.add("dem-caixa");

    const cab = document.createElement('div');
    cab.classList.add("dem-caixa-cab");

    const autor = document.createElement('span');
    autor.appendChild(document.createTextNode(auto.usuario.nome + " comentou em " + FormatarData(info.dataHora)));
    cab.appendChild(autor);


    caixa.appendChild(cab);

    const texto = document.createElement('p');
    texto.classList.add("dem-caixa-corpo");
    texto.appendChild(document.createTextNode(info.conteudo));
    caixa.appendChild(texto);

    Com_Cr.appendChild(caixa);

    document.getElementById("dem-lista").appendChild(Com_Cr);
}

function FormatarData(data) {
    return new Date(data).toLocaleString("pt-BR");
}

// Apaga a lista da tela e cria todos os comentários de novo
function ShowComentarios() {
    document.getElementById("dem-lista").innerHTML = "";
    for (let i = 0; i < comentarios.length; i++) {
        CreateComentario(comentarios[i]);
    }

    document.getElementById("dem-contador").textContent = comentarios.length;

    // Só mostra o aviso de "nenhum comentário" se a lista estiver vazia
    document.getElementById("dem-sem-coment").hidden = comentarios.length > 0;
}

// Habilita o botão de comentar só quando o nome e o comentário estiverem preenchidos
function ValidarComentario() {
    const texto = document.getElementById("dem-texto").value.trim();
    document.getElementById("dem-enviar").disabled = texto.length === 0;
}

async function AddComentario(event) {
    event.preventDefault(); // Não deixa o formulário recarregar a página

    const autor = document.getElementById("dem-autor");
    const texto = document.getElementById("dem-texto");

    if (!autor.value.trim() || !texto.value.trim()) {
        console.log("Valores invalidos")
        return;
    }

    const comentario = {
        id_autor: JSON.parse(localStorage.getItem("UsuarioLogado")).id_usuario,
        conteudo: texto.value
    }
    console.log(comentario)
    const response = await CadastrarComentario(demanda.id_demanda, comentario )
    console.log(response)

    await CarregarComentarios();
    ShowComentarios();
    texto.value = ""; // Limpa o campo
}

// O cadastro lê a DemandaAtual do localStorage, então salva a desta aba antes de ir para lá
function Edit() {
    localStorage.setItem("DemandaAtual", JSON.stringify(demanda));
    open("Cadastro_Demanda.html", "_self");
}


CarregarDemanda();

if (!demanda.titulo) { // Abriu a página sem clicar em uma demanda
    document.getElementById("dem-vazio").hidden = false;
}
else {
    document.getElementById("dem-conteudo").hidden = false;

    ShowDemanda();

    await CarregarComentarios();
    ShowComentarios();
    document.getElementById("dem-autor").value = JSON.parse(localStorage.getItem("UsuarioLogado")).nome;
    ValidarComentario();

    document.getElementById("dem-texto").addEventListener("input", ValidarComentario);
    document.getElementById("dem-form").addEventListener("submit", AddComentario);
    document.getElementById("dem-editar").addEventListener("click", Edit);
    document.getElementById("dem-historico").addEventListener("click", () => {
    console.log("Clicou no botão de historicoo!");
    window.location.href = "historico.html";
});


}