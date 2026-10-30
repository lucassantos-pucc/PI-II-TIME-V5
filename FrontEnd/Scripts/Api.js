const Url_Api = "http://localhost:3000";

async function TratarRespostaApi(resposta) {
    const dados = await resposta.json();

    if (!resposta.ok) {
        const mensagem = dados.mensagem || "Erro na requisição";
        throw new Error(mensagem);
    }

    return dados;
}

// Demandas

export async function ListarDemandasApi(idProj, idUsu, tipo = "", prioridade = "", status = "", projeto = "", responsavel = "") {
    let Url = `${Url_Api}/demandas/?id_projeto=${idProj}&id_usuario=${idUsu}`;
    if (tipo) {
        Url += `&tipo=${encodeURIComponent(tipo)}`;
    }
    
    if (prioridade) {
        Url += `&prioridade=${encodeURIComponent(prioridade)}`;
    }

    if (status) {
        Url += `&status=${encodeURIComponent(status)}`;
    }

    if (projeto) {
        Url += `&id_projeto=${encodeURIComponent(projeto)}`;
    }

    if (responsavel) {
        Url += `&responsavel=${encodeURIComponent(responsavel)}`;
    }

    const resposta = await fetch(Url);
    return await TratarRespostaApi(resposta);
}

export async function BuscarDemandasApi(idDem, idProj) {
    const resposta = await fetch(`${Url_Api}/demandas/${idDem}/projeto/${idProj}`);
    return await TratarRespostaApi(resposta);
}

export async function CadastrarDemandasApi(demanda) {
    const resposta = await fetch(`${Url_Api}/demandas`,
        {
            method: "POST",
            headers: { "Content-Type" : "application/json" },
            body: JSON.stringify(demanda)
        }
    );
    return await TratarRespostaApi(resposta);
}

export async function EditarDemandasApi(id, demanda) { 
    const resposta = await fetch(`${Url_Api}/demandas/${id}`,
        {
            method: "PUT",
            headers: { "Content-Type" : "application/json" },
            body: JSON.stringify(demanda)
        }
    );
    return await TratarRespostaApi(resposta);
}

export async function CancelarDemandasApi(id) {
    const resposta = await fetch(`${Url_Api}/demandas/${id}`,
        {
            method: "DELETE"
        }
    );
    return await TratarRespostaApi(resposta);
}

// Usuarios

export async function VerificarLoginApi(usuario) {
    const resposta = await fetch(`${Url_Api}/usuarios/login`,
        {
            method: "PUT",
            headers: { "Content-Type" : "application/json" },
            body: JSON.stringify(usuario)
        }
    );
    return await TratarRespostaApi(resposta);
}

export async function ListarUsuariosApi() {
    const resposta = await fetch(`${Url_Api}/usuarios`);
    return await TratarRespostaApi(resposta);
}

export async function ListarUsuarioApi(id){
    const resposta = await fetch(`${Url_Api}/usuarios/${id}`);
    return await TratarRespostaApi(resposta);
}

export async function CadastrarUsuarioApi(usuario) {
    console.log(JSON.stringify(usuario));
    const resposta = await fetch(`${Url_Api}/usuarios`,
        {
            method: "POST",
            headers: { "Content-Type" : "application/json" },
            body: JSON.stringify(usuario)
        }
    );
    return await TratarRespostaApi(resposta);
}

// Projetos

export async function ListarProjetosApi() {
    const resposta = await fetch(`${Url_Api}/projetos/`);
    return await TratarRespostaApi(resposta);
}

export async function ListarProjetosUsuarioApi(id) {
    const resposta = await fetch(`${Url_Api}/projetos/?id=${id}`);
    return await TratarRespostaApi(resposta);
}
export async function BuscarProjetoApi(id) {
    const resposta = await fetch(`${Url_Api}/projetos/?id_projeto=${id}`);
    return await TratarRespostaApi(resposta);
}

export async function CadastrarProjetosApi(projeto) {
    const resposta = await fetch(`${Url_Api}/projetos`,
        {
            method: "POST",
            headers: { "Content-Type" : "application/json" },
            body: JSON.stringify(projeto)
        }
    );
    return await TratarRespostaApi(resposta);
}

export async function EditarProjetosApi(projeto) {
    const resposta = await fetch(`${Url_Api}/projetos`,
        {
            method: "PUT",
            headers: { "Content-Type" : "application/json" },
            body: JSON.stringify(projeto)
        }
    );
    return await TratarRespostaApi(resposta);
}

// Dashboards

export async function DashboardDemandasApi(id) {
    const resposta = await fetch(`${Url_Api}/dashboard/${id}`);
    return await TratarRespostaApi(resposta);
}

export async function CarregarHistoricoApi(id) {
    const resposta = await fetch(`${Url_Api}/historico/${id}`);
    return await TratarRespostaApi(resposta);
}

export async function RegistrarHistoricoApi(historico) {
    const resposta = await fetch(`${Url_Api}/historico/`,
        {
            method: "POST",
            headers: { "Content-Type" : "application/json" },
            body: JSON.stringify(historico)
        }
    );
    return await TratarRespostaApi(resposta);
}

// Comentarios
export async function ListarComentarios(id){
    const resposta = await fetch(`${Url_Api}/demandas/${id}/comentarios`);
    return await TratarRespostaApi(resposta);
}

export async function CadastrarComentario(id_demanda,comentario){
    const resposta = await fetch(`${Url_Api}/demandas/${id_demanda}/comentarios`,{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(comentario)
    });
    return await TratarRespostaApi(resposta);
}

const cacheFeriados = {}; // um ano só é buscado uma vez

export async function BuscarFeriadoNacional(dataISO) { // dataISO = "yyyy-mm-dd"
    const ano = dataISO.slice(0, 4);

    cacheFeriados[ano] ??= fetch(`https://brasilapi.com.br/api/feriados/v1/${ano}`)
        .then(r => {
            if (!r.ok) throw new Error("Falha ao consultar a API de feriados.");
            return r.json();
        })
        .catch(e => {
            delete cacheFeriados[ano]; // não guarda a falha no cache
            throw e;
        });

    const feriados = await cacheFeriados[ano];
    return feriados.find(f => f.date === dataISO) ?? null; // feriado ou null
}