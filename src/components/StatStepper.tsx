import React from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type StatStepperProps = {
  value: number;
  step?: number;
  onChange: (newValue: number) => void;
};

export const StatStepper: React.FC<StatStepperProps> = ({ value, step = 1, onChange }) => {
  const handleMinus = () => onChange(value - step);
  const handlePlus = () => onChange(value + step);

  return (
    <View style={styles.container}>
      <Pressable onPress={handleMinus} style={styles.button}>
        <Ionicons name="remove" size={18} />
      </Pressable>

      <TextInput
        style={styles.input}
        value={String(value)}
        keyboardType="numeric"
        onChangeText={(t) => {
          const parsed = parseInt(t || '0', 10);
          onChange(Number.isNaN(parsed) ? 0 : parsed);
        }}
      />

      <Pressable onPress={handlePlus} style={styles.button}>
        <Ionicons name="add" size={18} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  button: {
    padding: 6,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: 60,
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    textAlign: 'center',
  },
});
