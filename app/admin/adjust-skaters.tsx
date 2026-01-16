import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useAdminGuard } from '../../src/hooks/useAdminGuard';
import { useSkaters } from '../../src/hooks/useSkaters';
import { StatStepper } from '../../src/components/StatStepper';

export default function AdjustSkatersScreen() {
  const allowed = useAdminGuard();

  const { skaters, isLoading, isError, refetch, incrementStats, isIncrementing } = useSkaters();

  const handleRefresh = useCallback(() => {
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
        <Text style={styles.mutedText}>Carregando skaters...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.screen}>
        <Text>Erro ao carregar skaters.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Ajustar stats — Skaters</Text>
        {isIncrementing ? <ActivityIndicator size="small" /> : null}
      </View>

      <FlatList
        data={skaters}
        keyExtractor={(item) => item.id}
        refreshing={false}
        onRefresh={handleRefresh}
        ItemSeparatorComponent={Separator}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.block}>
              <Text style={styles.bold}>
                {item.name} #{item.number ?? '-'}
              </Text>
              <Text style={styles.mutedText}>
                {item.position} • G{item.goals} / A{item.assists} / P{item.points}
              </Text>
            </View>

            <View style={styles.row}>
              <View style={styles.stepperCol}>
                <Text style={styles.label}>Gols</Text>
                <StatStepper
                  value={item.goals}
                  onChange={async (newValue) => {
                    const delta = newValue - item.goals;
                    if (delta === 0) return;

                    await incrementStats({
                      skater_id: item.id,
                      goals_delta: delta,
                      assists_delta: 0,
                    });
                  }}
                />
              </View>

              <View style={styles.stepperCol}>
                <Text style={styles.label}>Assistências</Text>
                <StatStepper
                  value={item.assists}
                  onChange={async (newValue) => {
                    const delta = newValue - item.assists;
                    if (delta === 0) return;

                    await incrementStats({
                      skater_id: item.id,
                      goals_delta: 0,
                      assists_delta: delta,
                    });
                  }}
                />
              </View>
            </View>
          </View>
        )}
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
  mutedText: { color: '#6b7280', marginTop: 4 },

  row: { flexDirection: 'row', gap: 12 },
  stepperCol: { flex: 1, gap: 6 },

  label: { fontSize: 12, color: '#374151' },
});
