import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useAdminGuard } from '../../src/hooks/useAdminGuard';
import { useGoalies } from '../../src/hooks/useGoalies';
import { StatStepper } from '../../src/components/StatStepper';

export default function AdjustGoaliesScreen() {
  const allowed = useAdminGuard();

  const { goalies, isLoading, isError, refetch, incrementStats, isIncrementing } = useGoalies();

  const handleRefresh = useCallback(() => {
    // FlatList onRefresh não precisa await
    void refetch();
  }, [refetch]);

  const Separator = useMemo(() => {
    return function Sep() {
      return <View style={styles.separator} />;
    };
  }, []);

  if (allowed === null) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator />
        <Text style={styles.mutedText}>Verificando permissões...</Text>
      </View>
    );
  }

  if (!allowed) {
    return (
      <View style={styles.screen}>
        <Text>Você não tem permissão para acessar esta área.</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator />
        <Text style={styles.mutedText}>Carregando goalies...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.screen}>
        <Text>Erro ao carregar goalies.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Ajustar stats — Goalies</Text>
        {isIncrementing ? <ActivityIndicator size="small" /> : null}
      </View>

      <FlatList
        data={goalies}
        keyExtractor={(item) => item.id}
        refreshing={false}
        onRefresh={handleRefresh}
        ItemSeparatorComponent={Separator}
        renderItem={({ item }) => {
          const savePct = item.shots_against > 0 ? (item.saves / item.shots_against) * 100 : 0;

          return (
            <View style={styles.card}>
              <View style={styles.block}>
                <Text style={styles.bold}>{item.name}</Text>
                <Text style={styles.mutedText}>
                  GS {item.games_started} • W {item.wins} • SO {item.shutouts} • SA{' '}
                  {item.shots_against} / SV {item.saves} ({savePct.toFixed(1)}%)
                </Text>
              </View>

              <View style={styles.stepperStack}>
                <View style={styles.stepperBlock}>
                  <Text style={styles.label}>Games Started</Text>
                  <StatStepper
                    value={item.games_started}
                    onChange={async (newValue) => {
                      const delta = newValue - item.games_started;
                      if (delta === 0) return;

                      await incrementStats({
                        goalie_id: item.id,
                        gs_delta: delta,
                        sa_delta: 0,
                        sv_delta: 0,
                        w_delta: 0,
                        so_delta: 0,
                      });
                    }}
                  />
                </View>

                <View style={styles.stepperBlock}>
                  <Text style={styles.label}>Shots Against</Text>
                  <StatStepper
                    value={item.shots_against}
                    onChange={async (newValue) => {
                      const delta = newValue - item.shots_against;
                      if (delta === 0) return;

                      await incrementStats({
                        goalie_id: item.id,
                        gs_delta: 0,
                        sa_delta: delta,
                        sv_delta: 0,
                        w_delta: 0,
                        so_delta: 0,
                      });
                    }}
                  />
                </View>

                <View style={styles.stepperBlock}>
                  <Text style={styles.label}>Saves</Text>
                  <StatStepper
                    value={item.saves}
                    onChange={async (newValue) => {
                      const delta = newValue - item.saves;
                      if (delta === 0) return;

                      await incrementStats({
                        goalie_id: item.id,
                        gs_delta: 0,
                        sa_delta: 0,
                        sv_delta: delta,
                        w_delta: 0,
                        so_delta: 0,
                      });
                    }}
                  />
                </View>

                <View style={styles.stepperBlock}>
                  <Text style={styles.label}>Wins</Text>
                  <StatStepper
                    value={item.wins}
                    onChange={async (newValue) => {
                      const delta = newValue - item.wins;
                      if (delta === 0) return;

                      await incrementStats({
                        goalie_id: item.id,
                        gs_delta: 0,
                        sa_delta: 0,
                        sv_delta: 0,
                        w_delta: delta,
                        so_delta: 0,
                      });
                    }}
                  />
                </View>

                <View style={styles.stepperBlock}>
                  <Text style={styles.label}>Shutouts</Text>
                  <StatStepper
                    value={item.shutouts}
                    onChange={async (newValue) => {
                      const delta = newValue - item.shutouts;
                      if (delta === 0) return;

                      await incrementStats({
                        goalie_id: item.id,
                        gs_delta: 0,
                        sa_delta: 0,
                        sv_delta: 0,
                        w_delta: 0,
                        so_delta: delta,
                      });
                    }}
                  />
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16 },
  center: { alignItems: 'center', justifyContent: 'center' },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: { fontSize: 16, fontWeight: '700' },

  separator: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 8 },

  card: { paddingVertical: 8 },
  block: { marginBottom: 12 },

  bold: { fontWeight: '700' },
  mutedText: { marginTop: 8, color: '#6b7280' },

  stepperStack: { gap: 12 },
  stepperBlock: { gap: 6 },
  label: { fontSize: 12, color: '#374151' },
});
