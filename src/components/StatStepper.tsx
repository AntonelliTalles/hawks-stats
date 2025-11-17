import React from 'react';
import { HStack, IconButton, Input, Text } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
};

export function StatStepper({ label, value, onChange, step = 1 }: Props) {
  return (
    <HStack alignItems="center" space="2">
      <Text w={24}>{label}</Text>
      <IconButton onPress={() => onChange(value - step)} icon={<Ionicons name="remove" size={18} />} />
      <Input w={16} value={String(value)} keyboardType="numeric" onChangeText={(t) => onChange(parseInt(t || '0', 10) || 0)} />
      <IconButton onPress={() => onChange(value + step)} icon={<Ionicons name="add" size={18} />} />
    </HStack>
  );
}
