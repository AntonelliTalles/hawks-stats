import React from 'react';
import { FlatList } from 'react-native';
import { Box, Heading, HStack, Text, VStack } from 'native-base';
import { useSkaters } from '../../src/hooks/useSkaters';

export default function SkatersScreen() {
  const { data, isLoading, error } = useSkaters();
  if (isLoading) return <Text>Carregando...</Text>;
  if (error) return <Text>Erro ao carregar</Text>;

  return (
    <Box safeArea p="4">
      <Heading mb="4">Chicago Blackhawks — Skaters</Heading>
      <HStack px="2" mb="2" justifyContent="space-between">
        <Text flex={2} bold>Jogador</Text>
        <Text w={10} bold textAlign="right">G</Text>
        <Text w={10} bold textAlign="right">A</Text>
        <Text w={10} bold textAlign="right">P</Text>
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
            <Text w={10} textAlign="right">{item.goals}</Text>
            <Text w={10} textAlign="right">{item.assists}</Text>
            <Text w={10} textAlign="right">{item.points}</Text>
          </HStack>
        )}
      />
    </Box>
  );
}
