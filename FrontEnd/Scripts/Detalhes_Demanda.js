/*
    Feito por Arthur Cardoso Martin
    RA: 26006506
*/

async function LoadDialog() {
    const response = await fetch("Detalhes_Demanda.html");

    const html = await response.text();

    document.body.insertAdjacentHTML("beforeend", html);

    const dialog = document.getElementById("DialogBox");
    dialog.addEventListener("click", function (event) {
        if (event.target === dialog) {
            HideDialog();
        }
    });
}

function ShowDialog(info) {
    const dialog = document.getElementById("DialogBox");
    
    
    const dialogPriority = document.getElementById("DialogPriority");
    dialogPriority.textContent = "Prioridade: " + info.prioridade;

    //Colocar as informações no popup
    document.getElementById("DialogTitle").textContent = info.nome;
    document.getElementById("DialogType").textContent = "Tipo: " + info.tipo;
    document.getElementById("DialogStatus").textContent = "Status: " + info.status;
    document.getElementById("DialogProject").textContent = "Projeto: " + info.projeto;
    document.getElementById("DialogResponsible").textContent = "Responsável: " + info.responsavel;
    document.getElementById("DialogCreate").textContent = "Data de Criação: " + info.DTcriacao;
    document.getElementById("DialogDeadline").textContent = "Prazo: " + info.prazo;
    document.getElementById("DialogDescription").textContent = info.descricao;


    dialog.classList.remove("closing");
    PriorityColorDialog(dialogPriority.parentElement);
    //localStorage.setItem("DemandaAtual", JSON.parse())
    // !! Comentei por enquanto por conflitos com o popup,
    dialog.showModal();

    localStorage.setItem("DemandaAtual", JSON.stringify({
        nome: info.nome,
        tipo: info.tipo,
        prioridade: info.prioridade,
        status: info.status,
        projeto: info.projeto,
        responsavel: info.responsavel,
        DTcriacao: info.DTcriacao,
        prazo: info.prazo,
        descricao: info.descricao
    }));
}

function HideDialog() {
    localStorage.setItem("DemandaAtual", JSON.stringify({}));
    const dialog = document.getElementById("DialogBox");

    dialog.classList.add("closing");

    setTimeout(() => {
        dialog.close();
        dialog.classList.remove("closing");
    }, 400);
}

LoadDialog();

function PriorityColorDialog(p) {
    if (!p) {
        return;
    }

    const prioridade = p.textContent.toLowerCase();

    p.classList.remove( //remover classe
        "prioridade-b-gen",
        "prioridade-m-gen",
        "prioridade-a-gen",
        "prioridade-c-gen"
    );

    if (prioridade.includes("baixa")) { //adicionar baseado no texto
        p.classList.add("prioridade-b-gen");
    } else if (prioridade.includes("média")) {
        p.classList.add("prioridade-m-gen");
    } else if (prioridade.includes("alta")) {
        p.classList.add("prioridade-a-gen");
    } else if (prioridade.includes("crítica")) {
        p.classList.add("prioridade-c-gen");
    }
}


function Edit(demanda){
    open("Gerenciamento_Demandas.html", "_self");
}