/* Feito por: Kauã Gaiofato Santana Lima de Jesus RA: 26000195 */
/* Modificado por: Lucas Studach Kaid Ludemann RA: 26006454 */

let demanda = {}; // Demanda que está sendo mostrada nesta aba
let comentarios = []; // Comentários da demanda


// Pega a demanda: primeiro a que esta aba já guardou, senão a que a listagem salvou
function CarregarDemanda() {
  let salva = sessionStorage.getItem("DemandaAtual");
  if (!salva) { // Primeira vez que a aba abre
    salva = localStorage.getItem("DemandaAtual");
    if (salva) {
      sessionStorage.setItem("DemandaAtual", salva); // Guarda na aba, assim se abrir outra demanda em outra aba, esta nao muda
    }
  }
  if (salva) {
    demanda = JSON.parse(salva);
    console.log(demanda);
  }
}

// Cada demanda tem a sua lista de comentários no localStorage
function ChaveComentarios() {
  return "comentarios:" + (demanda.nome || demanda.titulo) + "|" + (demanda.projeto || demanda.id_projeto) + "|" + (demanda.DTcriacao || demanda.data_criacao);
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
  } else if (prio.includes("média") || prio.includes("media")) {
    p.classList.add("prioridade-m-gen");
  } else if (prio.includes("alta")) {
    p.classList.add("prioridade-a-gen");
  } else if (prio.includes("crítica") || prio.includes("critica")) {
    p.classList.add("prioridade-c-gen");
  }
}

function StatusColor(p) {
  if (!p) { //So coloquei isso para evitar problema de estar vazio
    return;
  }
  const stat = p.textContent.toLowerCase(); // Variável de simplificação da sintaxe

  // Limpa classes antigas de status antes de aplicar a nova 
  p.classList.remove(
    "status-aberta",
    "status-andamento",
    "status-revisao",
    "status-concluido",
    "status-cancelado"
  );
  
  // Aplica as cores de fundo respectivas
  if (stat.includes("aberta")) {
    p.classList.add("status-aberta");
  } else if (stat.includes("em andamento")) {
    p.classList.add("status-andamento");
  } else if (stat.includes("em revisao") || stat.includes("revisão")) {
    p.classList.add("status-revisao");
  } else if (stat.includes("concluida") || stat.includes("concluída")) {
    p.classList.add("status-concluido");
  } else if (stat.includes("cancelado") || stat.includes("cancelada")) {
    p.classList.add("status-cancelado");
  }
}

function mudarStatus() {
    const seloStatus = document.getElementById('dem-status');
    StatusColor(seloStatus);

    const dd = seloStatus.parentElement;
    const opcoes = [
      { texto: 'Aberta', valor: 'Aberta' },
      { texto: 'Em andamento', valor: 'Em andamento' },
      { texto: 'Em revisão', valor: 'Em revisao' },
      { texto: 'Concluida', valor: 'Concluida' },
      { texto: 'Cancelado', valor: 'Cancelado' }
    ];  
    const textoAtual = seloStatus.textContent;
    const itemAtual = opcoes.find(item => item.texto === textoAtual);
    const atual = itemAtual ? itemAtual.valor : null;   

    // REGRAS DE TRANSIÇÃO:
    // Aberta -> Em andamento
    // Em andamento -> Em revisao 
    // Em revisao -> Concluida / Em andamento
    // Qualquer status -> Cancelada

    //Membro de equipe só pode mudar:
    // Aberta-> Em andamento;
    // Em andamento -> Em revisao

    if (atual !== 'Concluida' && atual !== 'Cancelado') { // Ajustado para 'Cancelada'
      const escolha = document.createElement('select');
      escolha.id = 'status_id';
      escolha.name = 'Status';  

      // Item inicial, para o "change" poder disparar mesmo com uma só opção
      const inicial = document.createElement('option');
      inicial.text = 'Alterar status...';
      inicial.value = '';
      inicial.disabled = true;
      inicial.selected = true;
      escolha.appendChild(inicial);

      opcoes.forEach(item => {
      const option = document.createElement('option');
      option.value = item.valor;
      option.text = item.texto;   
      
      if (usuario.papel === "Membro da equipe") {
        if (atual === 'Aberta' && item.valor === 'Em andamento'){
          escolha.appendChild(option);
        }
        else if (atual === 'Em andamento' && item.valor === 'Em revisao'){
          escolha.appendChild(option);
        }
      }

      else {
        if (atual === 'Aberta' && (item.valor === 'Em andamento' || item.valor === 'Cancelado')) {
        escolha.appendChild(option);
      } else if (atual === 'Em andamento' && (item.valor === 'Em revisao' || item.valor === 'Cancelado')) {
        escolha.appendChild(option);
      } else if (atual === 'Em revisao' && (item.valor === "Em andamento" || item.valor === 'Concluida' || item.valor === 'Cancelado')) {
        escolha.appendChild(option);
      }
        }
      });  

      dd.appendChild(escolha); 

      function atualizarSelo() {
        const novo = escolha.options[escolha.selectedIndex].text;

        seloStatus.textContent = novo;
        StatusColor(seloStatus);

        demanda.statusDemanda = novo;
        const json = JSON.stringify(demanda);
        localStorage.setItem("DemandaAtual", json);
        sessionStorage.setItem("DemandaAtual", json);

      } 

      escolha.addEventListener('change', item => {
        console.log('Valor selecionado:', item.target.value);
        atualizarSelo();
      });
      }
}
  

// Coloca as informações da demanda na tela
function ShowDemanda() {
  document.title = (demanda.titulo || demanda.nome) + " - Demanda";
  document.getElementById("dem-nome").textContent = demanda.titulo;
  document.getElementById("dem-tipo").textContent = demanda.tipo;
  document.getElementById("dem-prioridade").textContent = demanda.prioridade;
  document.getElementById("dem-status").textContent = demanda.statusDemanda;
  document.getElementById("dem-projeto").textContent = demanda.projeto;
  document.getElementById("dem-responsavel").textContent = demanda.responsavel;
  document.getElementById("dem-criacao").textContent = demanda.dataCriacao;
  document.getElementById("dem-prazo").textContent = demanda.prazoFinalizacao;
  
  demanda.descricao = demanda.descricao ? demanda.descricao : "Sem descrição"; 
  document.getElementById("dem-descricao").textContent = demanda.descricao;
  
  PriorityColor(document.getElementById("dem-prioridade"));
  mudarStatus();
  StatusColor(document.getElementById("dem-status"));
}

// Cria um comentário na tela
function CreateComentario(info, posicao) {
  const Com_Cr = document.createElement('li'); 
  Com_Cr.classList.add("dem-coment");

  const avatar = document.createElement('div');
  avatar.classList.add("dem-avatar");
  avatar.appendChild(document.createTextNode(info.autor.charAt(0).toUpperCase())); 
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
  document.getElementById("dem-sem-coment").hidden = comentarios.length > 0;
}

// Habilita o botão de comentar só quando o nome e o comentário estiverem preenchidos
function ValidarComentario() {
  const autor = document.getElementById("dem-autor").value.trim();
  const texto = document.getElementById("dem-texto").value.trim();
  document.getElementById("dem-enviar").disabled = !(autor && texto);
}

function AddComentario(event) {
  event.preventDefault(); 
  const autor = document.getElementById("dem-autor");
  const texto = document.getElementById("dem-texto");

  if (!autor.value.trim() || !texto.value.trim()) {
    return;
  }

  localStorage.setItem("ComentarioAutor", autor.value.trim()); 
  comentarios.push({
    autor: autor.value.trim(),
    texto: texto.value.trim(),
    data: new Date().toISOString()
  });

  SalvarComentarios();
  ShowComentarios();
  texto.value = ""; 
  ValidarComentario();
}

// O cadastro lê a DemandaAtual do localStorage, então salva a desta aba antes de ir para lá
function Edit() {
  localStorage.setItem("DemandaAtual", JSON.stringify(demanda));
  open("Editar_Demanda.html", "_self");
}

function Historico() {
    localStorage.setItem("DemandaAtual", JSON.stringify(demanda));
    open("historico.html", "_self");
}
// Inicialização da página
const usuario = JSON.parse(localStorage.getItem("UsuarioLogado") || "null"); 

CarregarDemanda();

// Verificação adaptada para aceitar tanto .nome quanto .titulo
if (!demanda.nome && !demanda.titulo) { 
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
  document.getElementById("dem-form").addEventListener("submit", AddComentario);
  
  const botaoEditar = document.getElementById("dem-editar");

  //Se for membro de equipe, não pode editar demanda
  if (usuario.papel === "Membro da equipe") {
    botaoEditar.style.display = "none"; 
  }
  else {
    botaoEditar.addEventListener("click", Edit);
  }  
  document.getElementById("dem-historico").addEventListener("click", Historico);

}
