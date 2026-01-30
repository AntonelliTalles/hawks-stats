import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAdminGuard } from '../../src/hooks/useAdminGuard';
import { useSkaters } from '../../src/hooks/useSkaters';
import type { Skater } from '../../src/types/skater';
import { SkaterForm, SkaterFormValues } from '../../src/components/SkaterForm';
import { createSkater, updateSkater, deleteSkater } from '../../src/services/skaters.firestore';

export default function SkatersCrud() {
  const allowed = useAdminGuard();
  const { skaters, refetch, isFetching } = useSkaters();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Skater | null>(null);

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
        <Text style={styles.title}>Skaters — CRUD</Text>
        <Text>Você não tem permissão para acessar esta área.</Text>
      </View>
    );
  }

  const handleCreate = async (values: SkaterFormValues) => {
    await createSkater({
      name: values.name,
      number: values.number,
      position: values.position,
      is_active: values.is_active,
    });

    setOpen(false);
    await refetch();
  };

  const handleUpdate = async (id: string, values: SkaterFormValues) => {
    await updateSkater(id, {
      name: values.name,
      number: values.number,
      position: values.position,
      is_active: values.is_active,
    });

    setEditing(null);
    await refetch();
  };

  const handleDelete = async (id: string) => {
    await deleteSkater(id);
    await refetch();
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Skaters — CRUD</Text>

        <Pressable style={styles.primaryButton} onPress={() => setOpen(true)}>
          <Text style={styles.primaryButtonText}>Novo Skater</Text>
        </Pressable>
      </View>

      <FlatList
        data={skaters}
        keyExtractor={(i) => i.id}
        refreshing={isFetching}
        onRefresh={refetch}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.bold}>
                {item.name} #{item.number ?? '-'}
              </Text>

              <View style={styles.actions}>
                <Pressable onPress={() => setEditing(item)}>
                  <Ionicons name="create-outline" size={18} />
                </Pressable>
                <Pressable onPress={() => handleDelete(item.id)}>
                  <Ionicons name="trash-outline" size={18} />
                </Pressable>
              </View>
            </View>

            <Text style={styles.muted}>
              {item.position} • G{item.goals} / A{item.assists} / P{item.points} •{' '}
              {item.is_active ? 'Ativo' : 'Inativo'}
            </Text>
          </View>
        )}
      />

      {/* Modal criar */}
      <Modal visible={open} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Novo Skater</Text>
            <SkaterForm onSubmit={handleCreate} />
            <Pressable style={styles.cancel} onPress={() => setOpen(false)}>
              <Text>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal editar */}
      <Modal visible={!!editing} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Editar Skater</Text>

            {editing && (
              <SkaterForm
                defaultValues={{
                  name: editing.name,
                  number: editing.number ?? undefined,
                  position: editing.position,
                  is_active: editing.is_active,
                }}
                onSubmit={(v) => handleUpdate(editing.id, v)}
              />
            )}

            <Pressable style={styles.cancel} onPress={() => setEditing(null)}>
              <Text>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  bold: {
    fontWeight: '700',
  },
  muted: {
    color: '#6b7280',
  },
  primaryButton: {
    backgroundColor: '#111827',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 16,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  cancel: {
    marginTop: 12,
    alignItems: 'center',
  },
});
