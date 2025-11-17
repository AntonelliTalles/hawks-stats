# Hawks Stats (React Native + Expo)

App para visualizar e administrar estatísticas dos jogadores do Chicago Blackhawks (skaters e goalies).

## Stack
- Expo + TypeScript + expo-router
- NativeBase (UI)
- TanStack Query
- Supabase (Auth + Postgres + RLS)
- react-hook-form + zod

## Como rodar
1. Crie um projeto no Supabase e copie:
   - EXPO_PUBLIC_SUPABASE_URL
   - EXPO_PUBLIC_SUPABASE_ANON_KEY
2. Crie `.env` na raiz com as variáveis acima.
3. Instale deps:
   ```bash
   npm i
   npm start
