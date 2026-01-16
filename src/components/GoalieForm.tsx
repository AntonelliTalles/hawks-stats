import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Text, TextInput, Pressable, View, StyleSheet, ActivityIndicator } from 'react-native';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export type GoalieFormValues = { name: string; is_active: boolean };

const goalieSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  is_active: z.boolean(),
});

type Props = {
  defaultValues?: Partial<GoalieFormValues>;
  onSubmit: (data: GoalieFormValues) => Promise<void> | void;
  submitting?: boolean;
};

export function GoalieForm({ defaultValues, onSubmit, submitting }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GoalieFormValues>({
    resolver: zodResolver(goalieSchema),
    defaultValues: { name: '', is_active: true, ...defaultValues },
  });

  const submit: SubmitHandler<GoalieFormValues> = async (values) => {
    await onSubmit(values);
  };

  return (
    <View style={styles.container}>
      {/* Nome */}
      <View style={styles.field}>
        <Text style={styles.label}>Nome</Text>
        <Controller
          name="name"
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Ex: Petr Mrázek"
              style={[styles.input, errors.name ? styles.inputError : null]}
              autoCapitalize="words"
            />
          )}
        />
        {errors.name?.message ? <Text style={styles.error}>{errors.name.message}</Text> : null}
      </View>

      {/* Ativo */}
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Ativo</Text>
        <Controller
          name="is_active"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Pressable
              onPress={() => onChange(!value)}
              accessibilityRole="switch"
              accessibilityState={{ checked: value }}
              style={[styles.switch, value ? styles.switchOn : styles.switchOff]}
            >
              <View style={[styles.knob, value ? styles.knobOn : styles.knobOff]} />
            </Pressable>
          )}
        />
      </View>

      {/* Botão */}
      <Pressable
        onPress={handleSubmit(submit)}
        disabled={!!submitting}
        style={[styles.button, submitting ? styles.buttonDisabled : null]}
      >
        {submitting ? (
          <View style={styles.buttonContent}>
            <ActivityIndicator />
            <Text style={styles.buttonText}>Salvando...</Text>
          </View>
        ) : (
          <Text style={styles.buttonText}>Salvar</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  field: {
    gap: 6,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#2b2b2b',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#b91c1c',
  },
  error: {
    color: '#b91c1c',
    fontSize: 12,
  },
  switch: {
    width: 52,
    height: 30,
    borderRadius: 999,
    padding: 3,
    justifyContent: 'center',
  },
  switchOn: {
    backgroundColor: '#16a34a',
  },
  switchOff: {
    backgroundColor: '#6b7280',
  },
  knob: {
    width: 24,
    height: 24,
    borderRadius: 999,
    backgroundColor: 'white',
  },
  knobOn: {
    alignSelf: 'flex-end',
  },
  knobOff: {
    alignSelf: 'flex-start',
  },
  button: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2b2b2b',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});
