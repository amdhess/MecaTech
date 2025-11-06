<div align="center">
  <h1>MecaTech Web (UI)</h1>
  <p>
    Interface de Front-end (UI) para o sistema MecaTech, construída com Next.js e Chakra UI V3.
  </p>
</div>

---

## 🚀 Sobre esta Aplicação

Esta é a aplicação web (front-end) do monorepo MecaTech. Ela consome a API (`packages/api`) e renderiza a interface para o usuário final.

### Stack de Tecnologia

* **Framework:** Next.js 14+ (App Router)
* **UI (Principal):** Chakra UI V3 (baseado em **PandaCSS** e **Ark UI**)
* **Gerenciamento de Formulários:** `React Hook Form`
* **Chamadas de API:** `Axios`

---

### 🏛️ Arquitetura de UI (Atomic Design)

Este projeto segue uma arquitetura baseada no Atomic Design para garantir a componentização e a manutenibilidade:

* **`app/`**: Rotas e "Views" (Componentes de nível de página, ex: `ClientsView`).
* **`components/ui/`**: **Átomos/Snippets**. Abstrações diretas dos primitivos do Chakra/Ark (ex: `table.tsx`, `dialog.tsx`, `field.tsx`). Estes são os únicos componentes que devem importar de `@chakra-ui/react`.
* **`components/organisms/`**: **Organismos**. Componentes complexos que usam os *snippets* de `ui/` para construir features (ex: `ClientTable.tsx`, `AddClientDialog.tsx`).
* **`lib/`**: Lógica de suporte (ex: `api.ts` - instância do Axios).
* **`types/`**: Definições de tipos (ex: `client.ts`).

---

### ▶️ Rodando o Front-end (Desenvolvimento)

Para executar o servidor do front-end em modo *watch*.

**A partir da Raiz do Monorepo (`meca-tech`):**
```bash
pnpm --filter web dev
```

**Ou, de dentro desta pasta (`packages/web`):**
```bash
pnpm run dev
```

A aplicação estará disponível em `http://localhost:3001`.
---
