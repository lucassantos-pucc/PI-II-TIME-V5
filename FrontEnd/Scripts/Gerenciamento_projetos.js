const formulario = document.querySelector("#formulario");

const campoTitulo = document.querySelector("#titulo_id");
const campoLider = document.querySelector("#lider_id");
const campoMembros = document.querySelector("#membros_id");

const campoErroTitulo = document.querySelector("#erroTitulo");
const campoErroLider = document.querySelector("#erroLider");
const campoErroMembros = document.querySelector("#erroMembros");

const sucesso = document.querySelector("#sucesso");


function mostrarErro(campo, elementoErro, mensagem) {
    campo.classList.add("campoErro");
    elementoErro.innerText = mensagem;
    elementoErro.style.display = "block";
}

function limparErro(campo, elementoErro) {
    campo.classList.remove("campoErro");
    elementoErro.innerText = "";
    elementoErro.style.display = "none";
}


formulario.addEventListener("submit", function (event) {

    event.preventDefault();

    // Limpando erros anteriores
    limparErro(campoTitulo, campoErroTitulo);
    limparErro(campoLider, campoErroLider);
    limparErro(campoMembros, campoErroMembros);

    // Esconde mensagem de sucesso
    sucesso.style.display = "none";

    let formularioValido = true;

    // Validando Título
    const titulo = campoTitulo.value.trim();

    if (titulo === "") {

        mostrarErro(campoTitulo,campoErroTitulo,"O campo de Título é obrigatório.");
        formularioValido = false;
    }


    // Validando Líder
    const lider = campoLider.value.trim();

    if (lider === "") {

        mostrarErro(campoLider, campoErroLider, "O campo de Líder do Projeto é obrigatório.");
        formularioValido = false;
    }

    // Validando Membros
    const membros = campoMembros.value.trim();

    if (membros === "") {

        mostrarErro(campoMembros, campoErroMembros, "O campo de Membros é obrigatório.");
        formularioValido = false;
    }


    // Se o formulário estiver válido
    if (formularioValido) {
        const projeto = {
            titulo: campoTitulo.value,
            lider: campoLider.value,
            membros: campoMembros.value
        };
        console.log(JSON.stringify(projeto, null, 2));
        // Mensagem de sucesso
        sucesso.style.display = "block";

        campoTitulo.value = "";
        campoLider.value = "";
        campoMembros.value = "";
    }
});