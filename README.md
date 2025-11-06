MecaTech

🇧🇷 Português
Um SaaS B2B (Software as a Service) para gestão de oficinas mecânicas. Este projeto é um monorepo gerenciado com pnpm, contendo uma API back-end em Nest.js e uma interface front-end em Next.js.

🚀 Tecnologias (Stack)
Monorepo: pnpm Workspaces

Back-end: Nest.js (Node.js)

Front-end: Next.js 14+ (App Router)

Banco de Dados: PostgreSQL (rodando em Docker)

ORM: Prisma

UI (Front-end): Chakra UI V3 (baseado em PandaCSS / Ark UI)

Gerenciamento de Formulários: React Hook Form

Chamadas de API: Axios

📋 Pré-requisitos
Antes de começar, garanta que você tenha:

Node.js (versão LTS v20+)

pnpm (instalado globalmente: npm install -g pnpm)

Docker Desktop (precisa estar em execução)

⚙️ Instalação e Configuração
Siga estes passos na primeira vez que clonar o projeto.

Clonar o Repositório
git clone https://github.com/amdhess/MecaTech

cd meca-tech

Instalar Dependências (Raiz) Este comando instala todas as dependências do monorepo (para a api e web).
pnpm install

# Volte para a raiz

cd ../..
Configurar Variáveis de Ambiente da API (Obrigatório) O Prisma precisa de um arquivo .env para se conectar ao banco de dados.

Manualmente, crie o arquivo: packages/api/.env

Abra o arquivo e cole a seguinte linha (use UTF-8):

Snippet de código

DATABASE_URL="postgresql://admin:password@localhost:5432/meca_tech"

Atualizar Scripts do Prisma Para que os comandos do Prisma funcionem, edite o packages/api/package.json e adicione dotenv -- no início dos scripts do Prisma:

// packages/api/package.json
"scripts": {
"prisma:dev": "dotenv -- npx prisma migrate dev",
"prisma:studio": "dotenv -- npx prisma studio"
},

Iniciar o Banco de Dados (Docker) Certifique-se que o Docker Desktop está rodando.
docker-compose up -d

Rodar a Primeira Migration Este comando criará o banco meca_tech e todas as tabelas.
pnpm --filter api run prisma:dev

▶️ Rodando a Aplicação (Desenvolvimento)

Para rodar o projeto, você precisará de 3 terminais abertos na raiz (meca-tech).

Terminal 1: Banco de Dados (Docker)
docker-compose up -d

Terminal 2: Back-end (API Nest.js) Inicia o servidor da API na porta 3000.
pnpm --filter api start:dev

Terminal 3: Front-end (Web Next.js) Inicia o servidor do front-end na porta 3001.
pnpm --filter web dev

API: http://localhost:3000

Front-end: http://localhost:3001

🗃️ Comandos Úteis (Banco de Dados)
Execute estes comandos na raiz do projeto.

Rodar Migrations (Para aplicar qualquer mudança do schema.prisma no banco)
pnpm --filter api run prisma:dev

Abrir o Prisma Studio (Uma interface visual para ver e editar os dados do banco)
pnpm --filter api run prisma:studio

🛠️ Comandos do Nest.js CLI
Como o nest CLI está instalado localmente (e não globalmente), sempre use pnpm nest... de dentro da pasta packages/api.

Exemplo (dentro de packages/api):

# Para gerar um novo módulo, service, controller, etc.

pnpm nest g resource [nome_do_recurso]
