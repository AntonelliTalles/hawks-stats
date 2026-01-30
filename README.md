# Hawks Stats 🏒

App mobile em **React Native (Expo)** para visualizar e administrar estatísticas dos jogadores do **Chicago Blackhawks**.

O foco do projeto é:

- treinar **React Native + Expo** do zero, aproveitando experiência prévia em React web;
- aplicar uma arquitetura simples, mas organizada;
- usar **Firebase** como backend (Auth + Postgres + RLS);
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
  - [Firebase](https://firebase.com/)
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
  - autenticação via Firebase Auth (e-mail/senha)
  - guarda sessão localmente com AsyncStorage
- **CRUD de skaters**
  - criar / editar / remover jogadores
  - formulário com validação via `zod`
- **CRUD de goalies**
  - criar / editar / remover goleiros
- **Incremento de stats**
  - uso de RPC no Firebase para incrementar/decrementar:
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
    firebase.ts           # client do Firebase
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

Conta no Firebase

2. Clonar o projeto
git clone [REPO]
cd hawks-stats
npm install

3. Configurar Firebase

Crie um projeto no Firebase.

Copie:

Project URL

anon public key

Na raiz do projeto, crie um arquivo .env:

EXPO_PUBLIC_FIREBASE_API_KEY=""
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN="hawks-stats.firebaseapp.com"
EXPO_PUBLIC_FIREBASE_PROJECT_ID="hawks-stats"
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET="hawks-stats.firebasestorage.app"
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
EXPO_PUBLIC_FIREBASE_APP_ID=""


Rode os scripts SQL das tabelas (skaters, goalies, profiles, RPC, RLS) no SQL Editor do Firebase.

(Opcional) Você pode criar um arquivo firebase/schema.sql com o schema completo para versionar a parte de banco também.

4. Rodar o app
npm start


Abra no emulador, no Expo Go ou no device.

Scripts
npm start        # inicia o Expo
npm run lint     # roda ESLint
npm run typecheck# roda TypeScript (tsc --noEmit)
