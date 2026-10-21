const Url_Api = "http://localhost:3000";

async function TratarRespostaApi(resposta) {
    const dados = await resposta.json();

    if (!resposta.ok) {
        const mensagem = dados.mensagem || "Erro na requisição";
        throw new Error(mensagem);
    }

    return dados;
}

export async function ListarDemandasApi(tipo = "", prioridade = "", status = "", projeto = "", responsavel = "") {
    let Url = `${Url_Api}/demandas`;

    if (tipo) {
        Url += `?tipo=${encodeURIComponent(tipo)}&`;
    }
    
    if (prioridade) {
        Url += `?prioridade=${encodeURIComponent(prioridade)}&`;
    }

    if (status) {
        Url += `?status=${encodeURIComponent(status)}&`;
    }

    if (projeto) {
        Url += `?id_projeto=${encodeURIComponent(projeto)}&`;
    }

    if (responsavel) {
        Url += `?responsavel=${encodeURIComponent(responsavel)}`;
    }

    const resposta = await fetch(Url);
    return await TratarRespostaApi(resposta);
}

export async function BuscarDemandasApi(id) {
    const resposta = await fetch(`${Url_Api}/demandas/${id}`);
    return await TratarRespostaApi(resposta);
}

export async function CadastrarDemandasApi(demanda) {
    const resposta = await fetch(`${Url_Api}/demandas`,
        {
            method: "POST",
            headers: { "Constent-Type" : "application/json" },
            body: JSON.stringify(demanda)
        }
    );
    return await TratarRespostaApi(resposta);
}

export async function EditarDemandasApi(id, demanda) { // TODO Ainda nao existe a rota Put, portanto essa função é um placeholder
    const resposta = await fetch(`${Url_Api}/demandas/${id}`,
        {
            method: "PUT",
            headers: { "Constent-Type" : "application/json" },
            body: JSON.stringify(demanda)
        }
    );
    return await TratarRespostaApi(resposta);
}

