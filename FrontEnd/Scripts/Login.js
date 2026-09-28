const form = document.querySelector("form");
const campoUsuario = document.querySelector("#usuario");
const campoSenha = document.querySelector("#senha");
const erroUsuario = document.querySelector("#erroUsuario");
const erroSenha = document.querySelector("#erroSenha");

const camposComErro = [
    campoUsuario,
    campoSenha
];

const mensagensDeErro = [
    erroUsuario,
    erroSenha
];

// Função para mostrar erro e mudar estilo do campo
function ErroValidation(campo, elementoErro, mensagem) {
    campo.classList.add("is-invalid");
    elementoErro.innerText = mensagem;
}

// Função para limpar erros de validações anteriores
function limparErros() {
    camposComErro.forEach(function (campo) {
        campo.classList.remove("is-invalid");
    });

    mensagensDeErro.forEach(function (elementoErro) {
        elementoErro.innerText = "";
    });
}

form.addEventListener("submit", function(event) {
    // 1. Evita que a página recarregue ao clicar em enviar
    event.preventDefault();

    // 2. Limpa os erros do envio anterior
    limparErros();

    let Validation = true;

    const usuario = campoUsuario.value.trim();
    const senha = campoSenha.value.trim();

    // Validar e-mail
    if (usuario === "") {
        ErroValidation(campoUsuario, erroUsuario, "O E-mail é obrigatório.");
        Validation = false;
    } else if (!usuario.includes("@")) {
        ErroValidation(campoUsuario, erroUsuario, "O E-mail é inválido.");
        Validation = false;
    }

    // Validar senha
    const possuiMaiuscula = /[A-Z]/.test(senha);
    const possuiMinuscula = /[a-z]/.test(senha);
    const possuiNumero = /[0-9]/.test(senha);
    const possuiEspecial = /[_@!?]/.test(senha);
    if (senha === "") {
        ErroValidation(campoSenha, erroSenha, "A senha é obrigatória.");
        Validation = false;
    } else if (!possuiEspecial || !possuiNumero || !possuiMaiuscula || !possuiMinuscula) {
        ErroValidation(campoSenha, erroSenha, "A senha invalida.");
        Validation = false;
    }

    // Se houver algum erro, interrompe a execução
    if (!Validation) {
        return;
    }

    const login = {
        usuario: campoUsuario.value,
        senha: campoSenha.value
    };


    if (localStorage.getItem("Usuarios")) { // Ver usuarios cadastrados no localStorage
        const usuarios = JSON.parse(localStorage.getItem("Usuarios"));
        const usuarioEncontrado = usuarios.find((u) => u.usuario === login.usuario && u.senha === login.senha);
        if (usuarioEncontrado) {
            localStorage.setItem("UsuarioLogado", JSON.stringify(usuarioEncontrado));
            open("Dashboard_Demandas.html", "_self");
        } else {
            ErroValidation(campoUsuario, erroUsuario, "Usuário ou senha inválidos.");
            ErroValidation(campoSenha, erroSenha, "Usuário ou senha inválidos.");
        }
    }

    console.log("Dados enviados:", JSON.stringify(login, null, 2));
});
 //!!VALIDAÇAO POR BANCO DE DADOS QUANDO O BANCO DE DADOS FOR IMPLEMENTADO!!