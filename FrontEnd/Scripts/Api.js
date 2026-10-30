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

export async function EditarDemandasApi(id, demanda) { // TODO Ainda nao existe a rota Put, portanto essa função é um placeholder
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

export async function ListarProjetosApi(nome = "", lider = "") {
    let Url = `${Url_Api}/projetos/?`;
    if (nome) {
        Url += `nome=${encodeURIComponent(nome)}&`;
    }
    if (lider) {
        Url += `lider=${encodeURIComponent(lider)}`;
    } console.log(Url);
    const resposta = await fetch(Url);
    return await TratarRespostaApi(resposta);
}

export async function ListarProjetosUsuarioApi(id, nome = "", lider = "") {
    let Url = `${Url_Api}/projetos/?id=${id}`;
    if (nome) {
        Url += `&nome=${encodeURIComponent(nome)}`;
    }
    if (lider) {
        Url += `&lider=${encodeURIComponent(lider)}`;
    }

    const resposta = await fetch(Url);
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