# PI-II-TIME-V5

## Sistema de Acompanhamento de Demandas de Desenvolvimento

Sistema web desenvolvido para o componente curricular **Projeto Integrador II**, do curso de **Engenharia de Software da PUC-Campinas**, durante o segundo semestre de 2026.

O projeto consiste em uma aplicação para gerenciamento de projetos e acompanhamento de demandas de desenvolvimento, permitindo organizar atividades, atribuir responsáveis e monitorar o progresso das tarefas.

## Funcionalidades

- Cadastro e autenticação de usuários.
- Gerenciamento de projetos e participantes.
- Cadastro, edição e exclusão de demandas.
- Atribuição de responsáveis e definição de prazos.
- Controle de status, tipos e prioridades.
- Comentários e histórico de alterações.
- Filtros e pesquisa de demandas.
- Dashboard com indicadores.
- Controle de permissões por perfil.
- Integração com API de feriados.

## Tecnologias Utilizadas

| Área | Tecnologia |
|---|---|
| Frontend | HTML, CSS e JavaScript |
| Backend | Node.js, TypeScript e Express |
| Banco de Dados | MySQL |
| Comunicação | API REST |
| Versionamento | Git e GitHub |

## Banco de Dados

O sistema utiliza MySQL e possui as seguintes tabelas:

- `usuario`: dados e perfis dos usuários.
- `projeto`: projetos cadastrados e seus líderes.
- `usuario_projeto_participa`: relacionamento entre usuários e projetos.
- `demanda`: demandas, responsáveis, prazos, status e prioridades.
- `historico`: registro de alterações nas demandas.
- `comentario`: comentários realizados pelos usuários.

## Instalação e Execução

**Requisitos:** Node.js, MySQL e MySQL Workbench.

**1. Clone o repositório:**

```bash
git clone <URL_DO_REPOSITORIO>
cd PI-II-TIME-V5
```

**2. Crie o banco de dados no MySQL:**

```sql
CREATE DATABASE PI2;
```

**3. Crie um arquivo `.env` na raiz do repositório:**

```env
DB_HOST=localhost
DB_USER=seu_usuario_mysql
DB_PASSWORD=sua_senha_mysql
DB_NAME=PI2
DB_PORT=3306
```

**4. Instale as dependências e compile o backend:**

```bash
cd BackEnd
npm install
npx tsc
```

**5. Inicie o servidor:**

```bash
npm start
```

O servidor estará disponível em `http://localhost:3000`.

> **Observação:** caso seja necessário reinicializar o banco com os dados predefinidos, altere temporariamente o valor da linha 77 de `BackEnd/src/dados/database.ts` para `true`, reinicie o servidor e, após a execução, retorne o valor para `false`. Essa operação pode sobrescrever dados existentes.

**Importante:** não compartilhe o arquivo `.env` nem envie suas credenciais ao GitHub.

## Integrantes

- Arthur Cardoso Martin
- Kauã Gaiofato Santana Lima de Jesus
- Lucas de Oliveira Santos
- Lucas Studach Kaid Ludemann
- Vitor Kenzo Pina Takemasa

## Informações Acadêmicas

- **Instituição:** PUC-Campinas
- **Curso:** Engenharia de Software
- **Disciplina:** Projeto Integrador II
- **Professor:** Fernando Luiz de Almeida Silveira
- **Período:** 2º semestre de 2026

---

*Projeto acadêmico desenvolvido para o componente curricular Projeto Integrador II.*
