import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAdminGuard } from '../../src/hooks/useAdminGuard';
import { useGoalies } from '../../src/hooks/useGoalies';
import { StatStepper } from '../../src/components/StatStepper';

type DraftRow = { gs: number; sa: number; sv: number; w: number; so: number };
const emptyRow: DraftRow = { gs: 0, sa: 0, sv: 0, w: 0, so: 0 };

export default function ManageGoalies() {
  const allowed = useAdminGuard();

  // ✅ padrão novo do hook (sem data)
  const { goalies, incrementStats, isIncrementing, isLoading, isError } = useGoalies();

  const [draft, setDraft] = useState<Record<string, DraftRow>>({});

  const setValue = (id: string, key: keyof DraftRow, v: number) => {
    setDraft((prev) => {
      const before = prev[id] ?? emptyRow;
      return { ...prev, [id]: { ...before, [key]: v } };
    });
  };

  if (allowed === null) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.muted}>Verificando permissões...</Text>
      </View>
    );
  }

  if (!allowed) {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>Gerenciar Goalies</Text>
        <Text>Você não tem permissão para acessar esta área.</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.muted}>Carregando goalies...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>Gerenciar Goalies</Text>
        <Text>Erro ao carregar goalies.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Gerenciar Goalies</Text>
        {isIncrementing ? <ActivityIndicator /> : null}
      </View>

      <FlatList
        data={goalies}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => {
          const row = draft[item.id] ?? emptyRow;

          const hasChanges =
            row.gs !== 0 || row.sa !== 0 || row.sv !== 0 || row.w !== 0 || row.so !== 0;

          return (
            <View style={styles.card}>
              <View style={styles.rowHeader}>
                <Text style={styles.bold}>{item.name}</Text>

                <Text style={styles.muted}>
                  GS {item.games_started} • SA {item.shots_against} • SV {item.saves} • SV%{' '}
                  {item.save_pct}% • W {item.wins} • SO {item.shutouts}
                </Text>
              </View>

              <View style={styles.stepperBlock}>
                <Text style={styles.label}>Δ Games Started</Text>
                <StatStepper value={row.gs} onChange={(v) => setValue(item.id, 'gs', v)} />
              </View>

              <View style={styles.stepperBlock}>
                <Text style={styles.label}>Δ Shots Against</Text>
                <StatStepper value={row.sa} onChange={(v) => setValue(item.id, 'sa', v)} />
              </View>

              <View style={styles.stepperBlock}>
                <Text style={styles.label}>Δ Saves</Text>
                <StatStepper value={row.sv} onChange={(v) => setValue(item.id, 'sv', v)} />
              </View>

              <View style={styles.stepperBlock}>
                <Text style={styles.label}>Δ Wins</Text>
                <StatStepper value={row.w} onChange={(v) => setValue(item.id, 'w', v)} />
              </View>

              <View style={styles.stepperBlock}>
                <Text style={styles.label}>Δ Shutouts</Text>
                <StatStepper value={row.so} onChange={(v) => setValue(item.id, 'so', v)} />
              </View>

              <Pressable
                style={[styles.button, (!hasChanges || isIncrementing) && styles.buttonDisabled]}
                disabled={!hasChanges || isIncrementing}
                onPress={async () => {
                  await incrementStats({
                    goalie_id: item.id,
                    gs_delta: row.gs,
                    sa_delta: row.sa,
                    sv_delta: row.sv,
                    w_delta: row.w,
                    so_delta: row.so,
                  });

                  // zera o draft da linha após salvar
                  setDraft((prev) => ({ ...prev, [item.id]: emptyRow }));
                }}
              >
                <Text style={styles.buttonText}>Salvar incrementos</Text>
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  rowHeader: {
    gap: 6,
    marginBottom: 12,
  },
  bold: {
    fontWeight: '700',
  },
  muted: {
    color: '#6b7280',
  },
  stepperBlock: {
    marginBottom: 12,
    gap: 6,
  },
  label: {
    fontSize: 12,
    color: '#374151',
  },
  button: {
    marginTop: 8,
    backgroundColor: '#111827',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
