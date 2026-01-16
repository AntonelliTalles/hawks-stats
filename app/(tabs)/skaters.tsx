import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { useSkaters } from '../../src/hooks/useSkaters';

export default function SkatersScreen() {
  const { skaters, isLoading, error } = useSkaters();

  if (isLoading) return <Text>Carregando...</Text>;
  if (error) return <Text>Erro ao carregar</Text>;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>
        Chicago Blackhawks — Skaters
      </Text>

      <View style={{ flexDirection: 'row', marginBottom: 8 }}>
        <Text style={{ flex: 2, fontWeight: '700' }}>Jogador</Text>
        <Text style={{ width: 40, textAlign: 'right', fontWeight: '700' }}>G</Text>
        <Text style={{ width: 40, textAlign: 'right', fontWeight: '700' }}>A</Text>
        <Text style={{ width: 40, textAlign: 'right', fontWeight: '700' }}>P</Text>
      </View>

      <FlatList
        data={skaters}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderColor: '#e5e7eb',
            }}
          >
            <View style={{ flex: 2 }}>
              <Text style={{ fontWeight: '700' }}>
                {item.name} #{item.number ?? '-'}
              </Text>
              <Text style={{ color: '#6b7280' }}>{item.position}</Text>
            </View>

            <Text style={{ width: 40, textAlign: 'right' }}>{item.goals}</Text>
            <Text style={{ width: 40, textAlign: 'right' }}>{item.assists}</Text>
            <Text style={{ width: 40, textAlign: 'right' }}>{item.points}</Text>
          </View>
        )}
      />
    </View>
  );
}
