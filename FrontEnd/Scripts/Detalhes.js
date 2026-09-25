/*
    Feito por Arthur Cardoso Martin
    RA: 26006506
*/

async function LoadDialog() {
    const response = await fetch("Detalhes.html");

    const html = await response.text();

    document.body.insertAdjacentHTML("beforeend", html);

    const dialog = document.getElementById("DialogBox");
    dialog.addEventListener("click", function (event) {
        if (event.target === dialog) {
            HideDialog();
        }
    });
}

function ShowDialog(demanda) {
    const dialog = document.getElementById("DialogBox");

    // Pegar os dados da demanda
    const title = demanda.querySelector("h3").textContent;
    const type = demanda.querySelector(".tipo-gen").textContent;
    const priority = demanda.querySelector(".prioridade-gen").textContent;
    const status = demanda.querySelector(".status-gen").textContent;
    const project = demanda.querySelector(".projeto-gen").textContent;
    const responsible = demanda.querySelector(".responsavel-gen").textContent;
    const createDate = demanda.querySelector(".DTcriacao-gen").textContent;
    const deadline = demanda.querySelector(".prazo-gen").textContent;
    const dialogPriority = document.getElementById("DialogPriority");

    //Por enquanto vai ser vazia visto que nao tem banco para consultar e nao aparece na listagem
    const description = "     "

    //Colocar as informações no popup
    document.getElementById("DialogTitle").textContent = title;
    document.getElementById("DialogType").textContent = type;
    dialogPriority.textContent = priority;
    document.getElementById("DialogStatus").textContent = status;
    document.getElementById("DialogProject").textContent = project;
    document.getElementById("DialogResponsible").textContent = responsible;
    document.getElementById("DialogCreate").textContent = createDate;
    document.getElementById("DialogDeadline").textContent = deadline;
    document.getElementById("DialogDescription").textContent = description;


    dialog.classList.remove("closing");
    PriorityColorDialog(dialogPriority.parentElement);
    //localStorage.setItem("DemandaAtual", JSON.parse())
    // !! Comentei por enquanto por conflitos com o popup,
    dialog.showModal();
}

function HideDialog() {
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

}