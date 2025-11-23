<div align="center">
  <h1>MecaTech</h1>
  <p>
    🇧🇷 Português
  </p>
  <p>
    Um SaaS B2B (Software as a Service) para gestão de oficinas mecânicas. <br />
    Projeto monorepo (pnpm) com <b>Nest.js (API)</b> e <b>Next.js (Web)</b>.
  </p>
</div>

---

## 🇧🇷 Português

### 🚀 Tecnologias (Stack)

<table>
  <thead>
    <tr>
      <th width="150px">Categoria</th>
      <th>Tecnologias</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Monorepo</b></td>
      <td><code>pnpm Workspaces</code></td>
    </tr>
    <tr>
      <td><b>Back-end (API)</b></td>
      <td><code>Nest.js</code>, <code>Node.js</code>, <code>Prisma (ORM)</code></td>
    </tr>
    <tr>
      <td><b>Front-end (Web)</b></td>
      <td><code>Next.js 14+ (App Router)</code>, <code>TypeScript</code></td>
    </tr>
    <tr>
      <td><b>Banco de Dados</b></td>
      <td><code>PostgreSQL</code> (via <code>Docker</code>)</td>
    </tr>
    <tr>
      <td><b>UI & Formulários</b></td>
      <td><code>Chakra UI V3</code> (PandaCSS / Ark UI), <code>React Hook Form</code>, <code>Axios</code></td>
    </tr>
  </tbody>
</table>

### 📋 Pré-requisitos

Antes de começar, garanta que você tenha:

* **Node.js** (versão LTS v20+)
* **pnpm** (instalado globalmente: `npm install -g pnpm`)
* **Docker Desktop** (precisa estar em execução)

---

### ⚙️ Instalação e Configuração

Siga estes passos na primeira vez que clonar o projeto.

1.  **Clonar o Repositório**
    ```bash
    git clone [https://github.com/amdhess/MecaTech](https://github.com/amdhess/MecaTech)
    cd meca-tech
    ```

2.  **Instalar Dependências (Raiz)**
    ```bash
    pnpm install
    ```

3.  **Configurar Variáveis de Ambiente da API (Obrigatório)**
    Crie o arquivo `packages/api/.env` (manualmente, em UTF-8) com o seguinte conteúdo:
    ```env
    DATABASE_URL="postgresql://admin:password@localhost:5432/meca_tech"
    ```

4.  **Iniciar o Banco de Dados (Docker)**
    Certifique-se que o Docker Desktop está rodando.
    ```bash
    docker-compose up -d
    ```

5.  **Rodar a Primeira Migration**
    Este comando criará o banco `meca_tech` e todas as tabelas.
    ```bash
    pnpm --filter api run prisma:dev
    ```

---

### ▶️ Rodando a Aplicação (Desenvolvimento)
Para rodar o projeto, você precisará de **3 terminais** abertos na raiz (`meca-tech`).

#### **Terminal 1: Banco de Dados (Docker)**
*(Inicia o container do PostgreSQL)*
```bash
docker-compose up -d
```
---

#### **Terminal 2: Back-end (API Nest.js)**
*(Inicia o servidor da API na porta 3000)*
```bash
pnpm --filter api start:dev
```
---

#### **Terminal 3: Front-end (Web Next.js)**
*(Inicia o servidor do front-end na porta 3001)*
```bash
pnpm --filter web dev
```
---
<br />
<table>
  <thead>
    <tr>
      <th width="150px">Serviço</th>
      <th>Url Local</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Front-end (Web)</b></td>
      <td>Back-end (API)></td>
    </tr>
    <tr>
      <td><code>http://localhost:3001</code></td>
      <td><code>http://localhost:3000</code></td>
    </tr>
  </tbody>
</table>
<br />

---
<details><summary>🗃️ Comandos Úteis (Banco de Dados e CLI)</summary>
  <br />
  Execute estes comandos na raiz do projeto.
  
#### **Rodar Migrations**
  **(Para aplicar qualquer mudança do schema.prisma no banco)**
  ```bash
    pnpm --filter api run prisma:dev
  ```
#### **Abrir o Prisma Studio (Uma interface visual para ver e editar os dados do banco)**
```bash
  pnpm --filter api run prisma:studio
```
#### **Comandos do Nest.js CLI**

Como o nest CLI está instalado localmente, sempre use 
```bash
  pnpm nest...
```
de dentro da pasta packages/api. Exemplo (dentro de packages/api):
```bash
  # Para gerar um novo módulo, service, controller, etc.
  pnpm nest g resource [nome_do_recurso]
```
</details>
