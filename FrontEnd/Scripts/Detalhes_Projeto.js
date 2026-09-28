
// Feito por: Vitor Kenzo Pina Takemasa
// RA: 26007167

async function LoadDialog() {
    const response = await fetch("Detalhes_Projeto.html");

    const html = await response.text();

    document.body.insertAdjacentHTML("beforeend", html);

    const dialog = document.getElementById("DialogBox");
    dialog.addEventListener("click", function (event) {
        if (event.target === dialog) {
            HideDialog();
        }
    });
}

function ShowDialog(projeto) {
    const dialog = document.getElementById("DialogBox");

    // Pegar os dados do projeto
    const title = projeto.querySelector("h3").textContent;
    const leader = projeto.querySelector(".lider-gen").textContent;
    const status = projeto.querySelector(".status-gen").textContent;
    const demandas = projeto.querySelector(".demandas-gen").textContent;
    const createDate = projeto.querySelector(".DTcriacao-gen").textContent;
    const description = projeto.querySelector(".descricao-gen").textContent;

    //Colocar as informações no popup
    document.getElementById("DialogTitle").textContent = title;
    document.getElementById("DialogLeader").textContent = leader;
    document.getElementById("DialogStatus").textContent = status;
    document.getElementById("DialogDemandas").textContent = demandas;
    document.getElementById("DialogCreate").textContent = createDate;
    document.getElementById("DialogDescription").textContent = description;


    dialog.classList.remove("closing");
    //PriorityColorDialog(dialogPriority.parentElement);
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

function StatusColorDialog(p) {
    if (!p) {
        return;
    }

    const status = p.textContent.toLowerCase();

    p.classList.remove( //remover classe
        "status-ativo",
        "status-andamento",
        "status-concluido",
        "status-cancelado"
    );

    if (prioridade.includes("ativo")) { //adicionar baseado no texto
        p.classList.add("status-ativo");
    } else if (prioridade.includes("andamento")) {
        p.classList.add("status-andamento");
    } else if (prioridade.includes("concluido")) {
        p.classList.add("status-concluido");
    } else if (prioridade.includes("cancelado")) {
        p.classList.add("status-cancelado");
    }
}


function Edit(demanda){

}