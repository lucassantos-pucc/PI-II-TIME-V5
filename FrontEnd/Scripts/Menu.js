/*
    Feito por: Kauã Gaiofato Santana Lima de Jesus
    RA: 26000195
    Editado por: Vitor Kenzo Pina Takemasa
    RA: 26007167
*/

/* 
    Editado por: Lucas Studach Kaid Ludemann
    RA: 26006454
*/

const usuarioLogado = JSON.parse(localStorage.getItem("UsuarioLogado") || "null");
const tipoUsuario = usuarioLogado ? usuarioLogado.tipo: null;
console.log(tipoUsuario);


const menuAdm = [
    { texto: 'Dashboard de Demandas', href: 'Dashboard_Demanda.html' },
    { texto: 'Listagem de Demandas',  href: 'Listagem_Demanda.html' },
    { texto: 'Histórico',             href: 'historico.html' },
    { texto: 'Dashboard de Projetos', href: 'Dashboard_Projeto.html' },
    { texto: 'Listagem de Projetos',  href: 'Listagem_Projeto.html' },
    { texto: 'Usuários',              href: 'Listagem_Usuario.html' },
    { texto: 'Sair',                  href: 'Login.html', btnsair: 'sair' }
];

const menuMembro = [
    { texto: 'Listagem de Demandas',  href: 'Listagem_Demanda.html' },
    { texto: 'Listagem de Projetos',  href: 'Listagem_Projeto.html' },
    { texto: 'Histórico',             href: 'historico.html' },
    { texto: 'Sair',                  href: 'Login.html', btnsair: 'sair' }
];

const menuLider = [
    { texto: 'Listagem de Demandas',  href: 'Listagem_Demanda.html' },
    { texto: 'Listagem de Projetos',  href: 'Listagem_Projeto.html' },
    { texto: 'Histórico',             href: 'historico.html' },
    { texto: 'Sair',                  href: 'Login.html', btnsair: 'sair' }
]

const menusPorTipo = {
    "Administrador": menuAdm,
    "Lider de Projeto": menuLider,
    "Membro de equipe": menuMembro
};

// Carrega o Menu.html e coloca o conteúdo dentro da página atual

function criarMenu() {
        const linksMenu = menusPorTipo[tipoUsuario];
        if (!linksMenu) return null;

        const nav = document.createElement('nav');
        nav.className = 'MenuLinks';

        //Construção dos menus para Administrador,
        //Lider de Projeto e Membro de Equipe
        linksMenu.forEach(item => {
            const a = document.createElement('a');
            a.className = 'btn';
            if (item.btnsair) {
                a.classList.add(item.btnsair);
            }
            a.href = item.href;
            a.textContent = item.texto;
            nav.appendChild(a);
        });

        return nav;
    }

 
// Carrega o Menu.html e coloca o conteúdo dentro da página atual
async function LoadMenu() {
    const nav = criarMenu();
    if (!nav) {
        window.location.href = 'Login.html'; // sem usuário logado
        return;
    }
    // Busca o Menu.html e coloca no body
    const response = await fetch("Menu.html");
    if (!response.ok) {
        console.error("Não foi possível carregar o Menu.html:", response.status);
        return;
    }

    const html = await response.text();

    document.body.insertAdjacentHTML("beforeend", html);

    // Insere o menu específico dentro da Box
    document.getElementById("MenuLinksBox").appendChild(nav);

    // O botão que abre o menu foi inserido no body, mas precisa ficar dentro do header
    // ("body > header" ignora o <header> que existe dentro do popup de detalhes)
    const header = document.querySelector("body > header");
    header.appendChild(document.getElementById("MenuButton"));
 
    // Fecha o menu ao clicar fora dele (no fundo escuro)
    // Quando clica no fundo, o alvo do clique é o próprio <dialog>
    const dialog = document.getElementById("MenuBox");
    dialog.addEventListener("click", function (event) {
        if (event.target === dialog) {
            HideMenu();
        }
    });
 
    // Destaca o botão da página em que o usuário está
    MarkCurrentPage();
}
 
// Abre o menu (chamada pelo botão ☰ através do onclick no Menu.html)
function ShowMenu() {
    const dialog = document.getElementById("MenuBox");
 
    // Remove a classe da animação de saída, caso o menu tenha sido fechado antes
    dialog.classList.remove("closing");
 
    // Abre o dialog em modo modal: escurece o fundo e o Esc fecha o menu
    dialog.showModal();
}
 
// Fecha o menu (chamada pelo botão "Fechar Menu" e pelo clique no fundo)
function HideMenu() {
    const dialog = document.getElementById("MenuBox");
 
    // Ativa a animação de saída (definida no Menu.css)
    dialog.classList.add("closing");
 
    // Espera a animação terminar (400ms) para fechar de verdade
    setTimeout(() => {
        dialog.close();
        dialog.classList.remove("closing");
    }, 400);
}
 
// Marca com a classe "atual" o link que aponta para a página aberta
function MarkCurrentPage() {
    // Pega só o nome do arquivo da URL, ex: ".../HTML/Usuarios.html" vira "usuarios.html"
    const paginaAtual = location.pathname.split("/").pop().toLowerCase();
 
    // Pega todos os links do menu
    const links = document.querySelectorAll(".MenuLinks a");
 
    for (const link of links) {
        // Compara o href do link com o nome da página (tudo em minúsculo, para ignorar maiúsculas)
        if (link.getAttribute("href").toLowerCase() === paginaAtual) {
            link.classList.add("atual"); // O estilo roxo está no Menu.css
        }
    }
}


// Só carrega o menu em páginas que têm header (Login e SignUp ficam sem menu)
if (document.querySelector("body > header")) {
    LoadMenu();
}
