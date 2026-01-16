import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useGoalies } from '../../src/hooks/useGoalies';

export default function GoaliesScreen() {
  const { goalies, isLoading, error } = useGoalies();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.helperText}>Carregando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Erro ao carregar</Text>
      </View>
    );
  }

  return (
    <View style={styles.safe}>
      <Text style={styles.title}>Chicago Blackhawks — Goalies</Text>

      {/* Header da “tabela” */}
      <View style={[styles.row, styles.headerRow]}>
        <Text style={[styles.headerCell, styles.playerCol]}>Jogador</Text>
        <Text style={[styles.headerCell, styles.statCol]}>GS</Text>
        <Text style={[styles.headerCell, styles.statCol]}>SA</Text>
        <Text style={[styles.headerCell, styles.statCol]}>SV</Text>
        <Text style={[styles.headerCell, styles.statCol]}>SV%</Text>
        <Text style={[styles.headerCell, styles.statCol]}>W</Text>
        <Text style={[styles.headerCell, styles.statCol]}>SO</Text>
      </View>

      <FlatList
        data={goalies}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.playerCol}>
              <Text style={styles.playerName}>
                {item.name} #{item.number ?? '-'}
              </Text>
              <Text style={styles.playerMeta}>{item.position}</Text>
            </View>

            <Text style={styles.statCol}>{item.games_started}</Text>
            <Text style={styles.statCol}>{item.shots_against}</Text>
            <Text style={styles.statCol}>{item.saves}</Text>
            <Text style={styles.statCol}>{item.save_pct}</Text>
            <Text style={styles.statCol}>{item.wins}</Text>
            <Text style={styles.statCol}>{item.shutouts}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    padding: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 24,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
  },
  helperText: {
    opacity: 0.7,
  },
  errorText: {
    color: '#b00020',
    fontWeight: '600',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  headerRow: {
    paddingVertical: 10,
    marginBottom: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#D1D5DB',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },

  headerCell: {
    fontWeight: '700',
  },
  playerCol: {
    flex: 2,
    paddingRight: 8,
  },
  statCol: {
    width: 44, // ~w={10} do NativeBase (aproximação visual)
    textAlign: 'right',
  },

  playerName: {
    fontWeight: '700',
  },
  playerMeta: {
    marginTop: 2,
    opacity: 0.65,
    fontSize: 12,
  },
});
