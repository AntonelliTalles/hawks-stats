import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useSkaters } from '../../src/hooks/useSkaters';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SkatersScreen() {
  const { skaters, isLoading, isError } = useSkaters();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.muted}>Carregando skaters...</Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.error}>Erro ao carregar skaters.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Chicago Blackhawks — Skaters</Text>

      {/* Cabeçalho da "tabela" */}
      <View style={[styles.row, styles.headerRow]}>
        <Text style={[styles.headerText, styles.colPlayer]}>Jogador</Text>
        <Text style={[styles.headerText, styles.colStat]}>G</Text>
        <Text style={[styles.headerText, styles.colStat]}>A</Text>
        <Text style={[styles.headerText, styles.colStat]}>P</Text>
      </View>

      <FlatList
        data={skaters}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.colPlayer}>
              <Text style={styles.playerName}>
                {item.name} #{item.number ?? '-'}
              </Text>
              <Text style={styles.muted}>{item.position}</Text>
            </View>

            <Text style={[styles.colStat, styles.statValue]}>{item.goals}</Text>
            <Text style={[styles.colStat, styles.statValue]}>{item.assists}</Text>
            <Text style={[styles.colStat, styles.statValue]}>{item.points}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff', // se quiser tirar aquela faixa branca, depois podemos alinhar bg global
  },
  center: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  headerRow: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#D1D5DB',
    marginBottom: 4,
  },
  headerText: {
    fontWeight: '700',
    color: '#374151',
  },
  colPlayer: {
    flex: 2,
  },
  colStat: {
    width: 32,
    textAlign: 'right',
  },
  playerName: {
    fontWeight: '600',
  },
  statValue: {
    color: '#111827',
  },
  muted: {
    color: '#6B7280',
    fontSize: 12,
  },
  error: {
    color: '#b00020',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E7EB',
  },
});
