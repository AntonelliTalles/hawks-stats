# Hawks Stats 🏒

App mobile em **React Native (Expo)** para visualizar e administrar estatísticas dos jogadores do **Chicago Blackhawks**.

O foco do projeto é:

- treinar **React Native + Expo** do zero, aproveitando experiência prévia em React web;
- aplicar uma arquitetura simples, mas organizada;
- usar **Supabase** como backend (Auth + Postgres + RLS);
- ter um projeto **bem versionado** para portfólio (GitHub + LinkedIn).

---

## Stack técnica

- **Mobile**
  - [Expo](https://expo.dev/) + React Native
  - TypeScript
  - [expo-router](https://expo.github.io/router/) (navegação)
  - [NativeBase](https://nativebase.io/) (UI)
- **Estado / dados**
  - [@tanstack/react-query](https://tanstack.com/query) (data fetching/cache)
  - `react-hook-form` + `zod` (forms e validação)
- **Backend**
  - [Supabase](https://supabase.com/)
    - Auth (e-mail/senha)
    - Postgres
    - RLS (Row Level Security)
    - RPC (funções para incrementos atômicos de stats)
- **Qualidade**
  - TypeScript `tsc --noEmit`
  - ESLint

---

## Funcionalidades

### Público

- Lista de **skaters** (jogadores de linha):
  - nome, número, posição (C/LW/RW/D)
  - gols, assistências, pontos (G/A/P)
  - status ativo/inativo
- Lista de **goalies**:
  - games started (GS)
  - shots against (SA)
  - saves (SV)
  - save% (SV%)
  - vitórias (W)
  - shutouts (SO)

### Área admin

Apenas para usuários com `role = 'admin'` na tabela `profiles`:

- **Login admin**
  - autenticação via Supabase Auth (e-mail/senha)
  - guarda sessão localmente com AsyncStorage
- **CRUD de skaters**
  - criar / editar / remover jogadores
  - formulário com validação via `zod`
- **CRUD de goalies**
  - criar / editar / remover goleiros
- **Incremento de stats**
  - uso de RPC no Supabase para incrementar/decrementar:
    - skaters: gols / assistências
    - goalies: GS / SA / SV / W / SO
  - consistente e atômico, sem race conditions

---

## Arquitetura (visão rápida)

```text
app/
  _layout.tsx             # providers globais (NativeBase, React Query)
  (tabs)/
    _layout.tsx           # abas públicas (Skaters / Goalies)
    skaters.tsx
    goalies.tsx
  admin/
    login.tsx             # tela de login admin
    manage-skaters.tsx    # CRUD de skaters
    manage-goalies.tsx    # CRUD de goalies
src/
  services/
    supabase.ts           # client do Supabase
    session.ts            # helpers de sessão
  hooks/
    useSkaters.ts         # fetch + mutations de skaters
    useGoalies.ts         # fetch + mutations de goalies
    useAdminGuard.ts      # proteção de rotas admin
  components/
    SkaterForm.tsx
    GoalieForm.tsx
    StatStepper.tsx       # componente genérico para + / - stats
  utils/
    zodSchemas.ts         # schemas de validação (forms)


Como rodar localmente
1. Pré-requisitos

Node.js (recomendado LTS)

npm ou yarn

Conta no Supabase

2. Clonar o projeto
git clone [REPO]
cd hawks-stats
npm install

3. Configurar Supabase

Crie um projeto no Supabase.

Copie:

Project URL

anon public key

Na raiz do projeto, crie um arquivo .env:

EXPO_PUBLIC_SUPABASE_URL="https://SEU-PROJETO.supabase.co"
EXPO_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5..."


Rode os scripts SQL das tabelas (skaters, goalies, profiles, RPC, RLS) no SQL Editor do Supabase.

(Opcional) Você pode criar um arquivo supabase/schema.sql com o schema completo para versionar a parte de banco também.

4. Rodar o app
npm start


Abra no emulador, no Expo Go ou no device.

Scripts
npm start        # inicia o Expo
npm run lint     # roda ESLint
npm run typecheck# roda TypeScript (tsc --noEmit)
