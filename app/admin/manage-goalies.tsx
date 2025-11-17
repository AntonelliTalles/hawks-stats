// app/admin/manage-goalies.tsx
import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { Box, Button, Heading, HStack, Text, VStack } from 'native-base';
import { useGoalies, useIncrementGoalie } from '../../src/hooks/useGoalies';
import { StatStepper } from '../../src/components/StatStepper';
import { useAdminGuard } from '../../src/hooks/useAdminGuard';

type DraftRow = { gs: number; sa: number; sv: number; w: number; so: number };
const emptyRow: DraftRow = { gs: 0, sa: 0, sv: 0, w: 0, so: 0 };

export default function ManageGoalies() {
  const allowed = useAdminGuard();
  const { data } = useGoalies();
  const inc = useIncrementGoalie();
  const [draft, setDraft] = useState<Record<string, DraftRow>>({});

  if (allowed === null) return <Text>Verificando permissões...</Text>;

  const setValue = (id: string, key: keyof DraftRow, v: number) => {
    setDraft((d) => {
      const prev = d[id] ?? emptyRow;
      return { ...d, [id]: { ...prev, [key]: v } };
    });
  };

  return (
    <Box safeArea p="4">
      <Heading mb="4">Gerenciar Goalies</Heading>
      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => {
          const row = draft[item.id] ?? emptyRow;
          return (
            <VStack mb="4" p="3" borderWidth={1} borderColor="coolGray.200" rounded="lg" space="2">
              <HStack justifyContent="space-between" mb="1">
                <Text bold>{item.name}</Text>
                <Text color="coolGray.500">
                  GS {item.games_started} • SA {item.shots_against} • SV {item.saves} • SV% {item.save_pct}% • W {item.wins} • SO {item.shutouts}
                </Text>
              </HStack>

              <StatStepper label="Δ Games Started" value={row.gs} onChange={(v) => setValue(item.id, 'gs', v)} />
              <StatStepper label="Δ Shots Against" value={row.sa} onChange={(v) => setValue(item.id, 'sa', v)} />
              <StatStepper label="Δ Saves" value={row.sv} onChange={(v) => setValue(item.id, 'sv', v)} />
              <StatStepper label="Δ Wins" value={row.w} onChange={(v) => setValue(item.id, 'w', v)} />
              <StatStepper label="Δ Shutouts" value={row.so} onChange={(v) => setValue(item.id, 'so', v)} />

              <Button
                mt="2"
                onPress={() =>
                  inc.mutate({
                    goalie_id: item.id,
                    gs_delta: row.gs,
                    sa_delta: row.sa,
                    sv_delta: row.sv,
                    w_delta: row.w,
                    so_delta: row.so,
                  })
                }
                isLoading={inc.isPending}
              >
                Salvar incrementos
              </Button>
            </VStack>
          );
        }}
      />
    </Box>
  );
}
