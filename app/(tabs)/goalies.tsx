import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGoalies } from '../../src/hooks/useGoalies';

export default function GoaliesScreen() {
  const { goalies, isLoading, isError, refetch, isFetching } = useGoalies();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.muted}>Carregando goalies...</Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.title}>Chicago Blackhawks — Goalies</Text>
        <Text style={styles.error}>Erro ao carregar goalies.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Chicago Blackhawks — Goalies</Text>

      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, styles.flex2, styles.headerLeft]}>Goleiro</Text>
        <Text style={styles.headerCell}>GS</Text>
        <Text style={styles.headerCell}>SA</Text>
        <Text style={styles.headerCell}>SV</Text>
        <Text style={styles.headerCell}>SV%</Text>
        <Text style={styles.headerCell}>W</Text>
        <Text style={styles.headerCell}>SO</Text>
      </View>

      <View style={styles.separator} />

      <FlatList
        data={goalies}
        keyExtractor={(item) => item.id}
        refreshing={isFetching}
        onRefresh={refetch}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={[styles.flex2, styles.playerCol]}>
              <Text style={styles.playerName}>{item.name}</Text>
            </View>

            <Text style={styles.cell}>{item.games_started}</Text>
            <Text style={styles.cell}>{item.shots_against}</Text>
            <Text style={styles.cell}>{item.saves}</Text>
            <Text style={styles.cell}>{item.save_pct.toFixed(1)}</Text>
            <Text style={styles.cell}>{item.wins}</Text>
            <Text style={styles.cell}>{item.shutouts}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  center: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerCell: {
    flex: 1,
    fontWeight: '600',
    textAlign: 'right',
    fontSize: 12,
    color: '#4b5563',
  },
  headerLeft: {
    textAlign: 'left',
  },
  flex2: {
    flex: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  playerCol: {
    justifyContent: 'center',
  },
  playerName: {
    fontWeight: '500',
    fontSize: 14,
  },
  cell: {
    flex: 1,
    textAlign: 'right',
    fontSize: 14,
  },
  muted: {
    color: '#6b7280',
  },
  error: {
    color: '#b91c1c',
    marginTop: 8,
  },
});
