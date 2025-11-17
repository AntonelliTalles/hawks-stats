import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { Box, Button, Heading, HStack, Text, VStack } from 'native-base';
import { useSkaters, useIncrementSkater } from '../../src/hooks/useSkaters';
import { StatStepper } from '../../src/components/StatStepper';

export default function ManageSkaters() {
  const { data } = useSkaters();
  const inc = useIncrementSkater();
  const [draft, setDraft] = useState<Record<string, { g: number; a: number }>>({});

  const setValue = (id: string, key: 'g'|'a', v: number) => {
    setDraft((d) => ({ ...d, [id]: { g: d[id]?.g ?? 0, a: d[id]?.a ?? 0, [key]: v } as any }));
  };

  return (
    <Box safeArea p="4">
      <Heading mb="4">Gerenciar Skaters</Heading>
      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => {
          const row = draft[item.id] ?? { g: 0, a: 0 };
          return (
            <VStack mb="4" p="3" borderWidth={1} borderColor="coolGray.200" rounded="lg" space="2">
              <HStack justifyContent="space-between">
                <Text bold>{item.name}</Text>
                <Text color="coolGray.500">G{item.goals} / A{item.assists} / P{item.points}</Text>
              </HStack>
              <StatStepper label="Δ Gols" value={row.g} onChange={(v) => setValue(item.id, 'g', v)} />
              <StatStepper label="Δ Assists" value={row.a} onChange={(v) => setValue(item.id, 'a', v)} />
              <Button
                mt="2"
                onPress={() => inc.mutate({ skater_id: item.id, goals_delta: row.g, assists_delta: row.a })}
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
