import React from 'react';
import { FlatList } from 'react-native';
import { Box, Heading, HStack, Text, VStack } from 'native-base';
import { useGoalies } from '../../src/hooks/useGoalies';

export default function GoaliesScreen() {
  const { data, isLoading, error } = useGoalies();
  if (isLoading) return <Text>Carregando...</Text>;
  if (error) return <Text>Erro ao carregar</Text>;

  return (
    <Box safeArea p="4">
      <Heading mb="4">Chicago Blackhawks — Goalies</Heading>
      <HStack px="2" mb="2" justifyContent="space-between">
        <Text flex={2} bold>Jogador</Text>
        <Text w={10} bold textAlign="right">GS</Text>
        <Text w={10} bold textAlign="right">SA</Text>
        <Text w={10} bold textAlign="right">SV</Text>
        <Text w={10} bold textAlign="right">SV%</Text>
        <Text w={10} bold textAlign="right">W</Text>
        <Text w={10} bold textAlign="right">SO</Text>
      </HStack>

      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <HStack px="2" py="3" borderBottomWidth={1} borderColor="coolGray.200" justifyContent="space-between">
            <VStack flex={2}>
              <Text bold>{item.name} #{item.number ?? '-'}</Text>
              <Text color="coolGray.500">{item.position}</Text>
            </VStack>
            <Text w={10} textAlign="right">{item.games.started}</Text>
            <Text w={10} textAlign="right">{item.shots_against}</Text>
            <Text w={10} textAlign="right">{item.saves}</Text>
            <Text w={10} textAlign="right">{item.save_pct}</Text>
            <Text w={10} textAlign="right">{item.wins}</Text>
            <Text w={10} textAlign="right">{item.shutouts}</Text>
          </HStack>
        )}
      />
    </Box>
  );
}
