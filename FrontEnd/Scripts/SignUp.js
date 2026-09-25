const form = document.querySelector("form");
const campoUsuario = document.querySelector("#usuario");
const campoSenha = document.querySelector("#senha");
const campoConf_senha = document.querySelector("#conf_senha");
const erroUsuario = document.querySelector("#erroUsuario");
const erroSenha = document.querySelector("#erroSenha");
const erroConf_Senha = document.querySelector("#erroConf_Senha");

const camposComErro = [
    campoUsuario,
    campoSenha,
    campoConf_senha
];

const mensagensDeErro = [
    erroUsuario,
    erroSenha,
    erroConf_Senha
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
    const conf_senha = campoConf_senha.value.trim();

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
    } else if (!possuiEspecial) {
        ErroValidation(campoSenha, erroSenha, "A senha deve conter caractere especial (_@!?).");
        Validation = false;
    } else if (!possuiMaiuscula) {
        ErroValidation(campoSenha, erroSenha, "A senha deve conter letra maiúscula.");
        Validation = false;
    } else if (!possuiMinuscula) {
        ErroValidation(campoSenha, erroSenha, "A senha deve conter letra minúscula.");
        Validation = false;
    } else if (!possuiNumero) {
        ErroValidation(campoSenha, erroSenha, "A senha deve conter número.");
        Validation = false;
    }

    // Confirmar senha
    if (conf_senha === "") {

        ErroValidation(campoConf_senha, erroConf_Senha, "A confirmação de senha é obrigatória.");
        Validation = false;
    } else if (conf_senha !== senha) {
        ErroValidation(campoConf_senha, erroConf_Senha, "As senhas não coincidem.");
        Validation = false;
    }

    // Se houver algum erro, interrompe a execução
    if (!Validation) {
        return;
    }

    const login = { usuario, senha };
    console.log("Dados enviados:", login);
});