<div align="center">
  <h1>MecaTech API</h1>
  <p>
    Serviço de Back-end (API) para o sistema MecaTech, construído com Nest.js.
  </p>
</div>

---

## 🚀 Sobre esta API

Esta é uma API RESTful construída com **Nest.js**, **Prisma** e **PostgreSQL**. Ela gerencia toda a lógica de negócio, dados e relacionamentos para o sistema de gestão de oficinas.

### Stack de Tecnologia

* **Framework:** Nest.js
* **ORM:** Prisma
* **Banco de Dados:** PostgreSQL
* **Validação:** `class-validator` e `class-transformer` (via `ValidationPipe`)

---

### ⚙️ Configuração (Obrigatório)

Para rodar esta API localmente, você **precisa** de um arquivo `.env` na raiz deste pacote (`packages/api/.env`).

1.  **Crie o arquivo:**
    `packages/api/.env`

2.  **Adicione a Variável de Ambiente:**
    (Este arquivo deve estar em UTF-8).
    ```env
    DATABASE_URL="postgresql://admin:password@localhost:5432/meca_tech"
    ```

---

### ▶️ Rodando a API (Desenvolvimento)

Para executar o servidor da API em modo *watch* (reinicia automaticamente ao salvar).

**A partir da Raiz do Monorepo (`meca-tech`):**
```bash
pnpm --filter api start:dev
```

**Ou, de dentro desta pasta (`packages/api`):**
```bash
pnpm run start:dev
```

A API estará disponível em `http://localhost:3000`.

---

### 🗃️ Banco de Dados (Prisma)

Nós usamos scripts `pnpm` (definidos no `package.json` deste pacote) para gerenciar o Prisma, pois eles incluem o `dotenv-cli` para carregar o `.env` corretamente.

**Sempre execute estes comandos da Raiz do Monorepo (`meca-tech`).**

#### Aplicar Migrations
*(Aplica mudanças do `schema.prisma` ao banco de dados)*
```bash
pnpm --filter api run prisma:dev
```

#### Abrir o Prisma Studio
*(GUI visual para o banco de dados)*
```bash
pnpm --filter api run prisma:studio
```

---

### 📦 Módulos da API

Esta API está organizada nos seguintes módulos de recursos (localizados em `src/`):

* **`PrismaModule`**: Gerencia a conexão global do Prisma.
* **`ClientModule`**: CRUD para Clientes.
* **`VehicleModule`**: CRUD para Veículos (vinculados a Clientes).
* **`PartModule`**: CRUD para Peças (gerenciamento de inventário).
* **`ServiceModule`**: CRUD para Serviços (mão de obra).
* **`OrderModule`**: O módulo principal (transacional) que cria Ordens de Serviço, calcula totais e gerencia a baixa de estoque.
