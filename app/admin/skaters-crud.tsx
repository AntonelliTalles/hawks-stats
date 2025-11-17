import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { Box, Button, Heading, HStack, IconButton, Modal, Text, VStack } from 'native-base';
import { useAdminGuard } from '../../src/hooks/useAdminGuard';
import { useSkaters } from '../../src/hooks/useSkaters';
import { SkaterForm, SkaterFormValues } from '../../src/components/SkaterForm';
import { supabase } from '../../src/services/supabase';
import { Ionicons } from '@expo/vector-icons';

type Skater = {
  id: string; name: string; number?: number; position: 'C'|'LW'|'RW'|'D';
  goals: number; assists: number; points: number; is_active: boolean;
};

export default function SkatersCrud() {
  const allowed = useAdminGuard();
  const { data, refetch, isFetching } = useSkaters();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Skater | null>(null);

  const list = data ?? [];

  if (allowed === null) return <Text>Verificando permissões...</Text>;

  const handleCreate = async (values: SkaterFormValues) => {
    const { error } = await supabase.from('skaters').insert(values);
    if (!error) {
        setOpen(false);
        await refetch();
    }
  };

  const handleUpdate = async (id: string, values: SkaterFormValues) => {
    const { error } = await supabase.from('skaters').update(values).eq('id', id);
    if (!error) {
        setEditing(null);
        await refetch();
    }
  };
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('skaters').delete().eq('id', id);
    if (!error) await refetch();
  };

  return (
    <Box safeArea p="4">
      <HStack justifyContent="space-between" alignItems="center" mb="4">
        <Heading>Skaters — CRUD</Heading>
        <Button onPress={() => setOpen(true)}>Novo Skater</Button>
      </HStack>

      <FlatList
        data={list}
        refreshing={isFetching}
        onRefresh={refetch}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <VStack mb="3" p="3" borderWidth={1} borderColor="coolGray.200" rounded="lg" space="1">
            <HStack justifyContent="space-between">
              <Text bold>{item.name} #{item.number ?? '-'}</Text>
              <HStack space="2">
                <IconButton
                  icon={<Ionicons name="create-outline" size={18} />}
                  onPress={() => setEditing(item)}
                />
                <IconButton
                  icon={<Ionicons name="trash-outline" size={18} />}
                  onPress={() => handleDelete(item.id)}
                />
              </HStack>
            </HStack>
            <Text color="coolGray.500">{item.position} • G{item.goals} / A{item.assists} / P{item.points} • {item.is_active ? 'Ativo' : 'Inativo'}</Text>
          </VStack>
        )}
      />

      {/* Modal novo */}
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Novo Skater</Modal.Header>
          <Modal.Body>
            <SkaterForm onSubmit={handleCreate} />
          </Modal.Body>
        </Modal.Content>
      </Modal>

      {/* Modal editar */}
      <Modal isOpen={!!editing} onClose={() => setEditing(null)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Editar Skater</Modal.Header>
          <Modal.Body>
            {editing && (
              <SkaterForm
                defaultValues={{
                  name: editing.name,
                  number: editing.number,
                  position: editing.position,
                  is_active: editing.is_active,
                }}
                onSubmit={(v) => handleUpdate(editing.id, v)}
              />
            )}
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Box>
  );
}
