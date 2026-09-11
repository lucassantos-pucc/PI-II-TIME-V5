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
    const type = demanda.querySelector(".tipo-gen p").textContent;
    const priority = demanda.querySelector('[class*="prioridade-"] p').textContent;
    const status = demanda.querySelector(".status-gen p").textContent;
    const project = demanda.querySelector(".projeto-gen p").textContent;
    const responsible = demanda.querySelector(".responsavel-gen p").textContent;
    const createDate = demanda.querySelector(".DTcriacao-gen p").textContent;
    const deadline = demanda.querySelector(".prazo-gen p").textContent;
    
    //Por enquanto vai ser vazia visto que nao tem banco para consultar e nao aparece na listagem
    const description = "     "
    
    //Colocar as informações no popup
    document.getElementById("DialogTitle").textContent = title;
    document.getElementById("DialogType").textContent = type;
    document.getElementById("DialogPriority").textContent = `Prioridade: ${priority}`;
    document.getElementById("DialogStatus").textContent = status;
    document.getElementById("DialogProject").textContent = project;
    document.getElementById("DialogResponsible").textContent = `Responsável: ${responsible}`;
    document.getElementById("DialogCreate").textContent = `Criação: ${createDate}`;
    document.getElementById("DialogDeadline").textContent = `Prazo: ${deadline}`;
    document.getElementById("DialogDescription").textContent = description;


    dialog.classList.remove("closing");

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