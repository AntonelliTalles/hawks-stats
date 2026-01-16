import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View, Pressable, ActivityIndicator } from 'react-native';
import { useSkaters } from '../../src/hooks/useSkaters';
import { StatStepper } from '../../src/components/StatStepper';

type DraftRow = { g: number; a: number };

export default function ManageSkaters() {
  const { skaters, incrementStats, isIncrementing } = useSkaters();

  const [draft, setDraft] = useState<Record<string, DraftRow>>({});

  const setValue = (id: string, key: 'g' | 'a', v: number) => {
    setDraft((prev) => ({
      ...prev,
      [id]: {
        g: prev[id]?.g ?? 0,
        a: prev[id]?.a ?? 0,
        [key]: v,
      },
    }));
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Gerenciar Skaters</Text>

      <FlatList
        data={skaters}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => {
          const row = draft[item.id] ?? { g: 0, a: 0 };

          return (
            <View style={styles.card}>
              <View style={styles.rowHeader}>
                <Text style={styles.bold}>{item.name}</Text>
                <Text style={styles.muted}>
                  G{item.goals} / A{item.assists} / P{item.points}
                </Text>
              </View>

              <View style={styles.stepperBlock}>
                <Text style={styles.label}>Δ Gols</Text>
                <StatStepper value={row.g} onChange={(v) => setValue(item.id, 'g', v)} />
              </View>

              <View style={styles.stepperBlock}>
                <Text style={styles.label}>Δ Assistências</Text>
                <StatStepper value={row.a} onChange={(v) => setValue(item.id, 'a', v)} />
              </View>

              <Pressable
                style={[styles.button, isIncrementing && styles.buttonDisabled]}
                disabled={isIncrementing}
                onPress={async () => {
                  if (row.g === 0 && row.a === 0) return;

                  await incrementStats({
                    skater_id: item.id,
                    goals_delta: row.g,
                    assists_delta: row.a,
                  });

                  setDraft((d) => ({ ...d, [item.id]: { g: 0, a: 0 } }));
                }}
              >
                {isIncrementing ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Salvar incrementos</Text>
                )}
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
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
