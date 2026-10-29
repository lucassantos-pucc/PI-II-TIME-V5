/*
    Feito por: Kauã Gaiofato Santana Lima de Jesus
    RA: 26000195
*/

let demanda = {}; // Demanda que está sendo mostrada nesta aba
let comentarios = []; // Comentários da demanda


// Pega a demanda: primeiro a que esta aba já guardou, senão a que a listagem salvou
function CarregarDemanda() {
    let salva = sessionStorage.getItem("DemandaAtual");
    console.log(salva)
    if (!salva) { // Primeira vez que a aba abre
        salva = localStorage.getItem("DemandaAtual");
        if (salva) {
            sessionStorage.setItem("DemandaAtual", salva); // Guarda na aba, assim se abrir outra demanda em outra aba, esta nao muda
        }
    }

    if (salva) {
        demanda = JSON.parse(salva);
    }
}

// Cada demanda tem a sua lista de comentários no localStorage
function ChaveComentarios() {
    return "comentarios:" + demanda.nome + "|" + demanda.projeto + "|" + demanda.DTcriacao;
}

function CarregarComentarios() {
    if (localStorage.getItem(ChaveComentarios())) {
        comentarios = JSON.parse(localStorage.getItem(ChaveComentarios()));
    }
}

function SalvarComentarios() {
    localStorage.setItem(ChaveComentarios(), JSON.stringify(comentarios));
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
function CreateComentario(info, posicao) {
    const Com_Cr = document.createElement('li'); // Comentário Criado
    Com_Cr.classList.add("dem-coment");

    const avatar = document.createElement('div');
    avatar.classList.add("dem-avatar");
    avatar.appendChild(document.createTextNode(info.autor.charAt(0).toUpperCase())); // Primeira letra do nome
    Com_Cr.appendChild(avatar);

    const caixa = document.createElement('div');
    caixa.classList.add("dem-caixa");

    const cab = document.createElement('div');
    cab.classList.add("dem-caixa-cab");

    const autor = document.createElement('span');
    autor.appendChild(document.createTextNode(info.autor + " comentou em " + FormatarData(info.data)));
    cab.appendChild(autor);


    caixa.appendChild(cab);

    const texto = document.createElement('p');
    texto.classList.add("dem-caixa-corpo");
    texto.appendChild(document.createTextNode(info.texto));
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
        CreateComentario(comentarios[i], i);
    }

    document.getElementById("dem-contador").textContent = comentarios.length;

    // Só mostra o aviso de "nenhum comentário" se a lista estiver vazia
    document.getElementById("dem-sem-coment").hidden = comentarios.length > 0;
}

// Habilita o botão de comentar só quando o nome e o comentário estiverem preenchidos
function ValidarComentario() {
    const autor = document.getElementById("dem-autor").value.trim();
    const texto = document.getElementById("dem-texto").value.trim();

    document.getElementById("dem-enviar").disabled = !(autor && texto);
}

function AddComentario(event) {
    event.preventDefault(); // Não deixa o formulário recarregar a página

    const autor = document.getElementById("dem-autor");
    const texto = document.getElementById("dem-texto");

    if (!autor.value.trim() || !texto.value.trim()) {
        return;
    }

    localStorage.setItem("ComentarioAutor", autor.value.trim()); // Lembra o nome para os próximos comentários

    comentarios.push({
        autor: autor.value.trim(),
        texto: texto.value.trim(),
        data: new Date().toISOString()
    });

    SalvarComentarios();
    ShowComentarios();

    texto.value = ""; // Limpa o campo
    ValidarComentario();
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

    CarregarComentarios();
    ShowComentarios();

    document.getElementById("dem-autor").value = localStorage.getItem("ComentarioAutor") || "";
    ValidarComentario();

    document.getElementById("dem-autor").addEventListener("input", ValidarComentario);
    document.getElementById("dem-texto").addEventListener("input", ValidarComentario);
    document.getElementById("dem-texto").addEventListener("keydown", AtalhoComentario);
    document.getElementById("dem-form").addEventListener("submit", AddComentario);
    document.getElementById("dem-editar").addEventListener("click", Edit);
}