import React from 'react';
import { View, Text, TextInput, Switch, Button } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

/**
 * INPUT DO FORM (o que o usuário digita)
 */
export type SkaterFormInput = {
  name: string;
  number?: string;
  position: 'C' | 'LW' | 'RW' | 'D';
  is_active: boolean;
};

/**
 * PAYLOAD FINAL (para banco)
 */
export type SkaterFormValues = {
  name: string;
  number?: number;
  position: 'C' | 'LW' | 'RW' | 'D';
  is_active: boolean;
};

const skaterSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  number: z.string().optional(),
  position: z.enum(['C', 'LW', 'RW', 'D']),
  is_active: z.boolean(),
});

type Props = {
  defaultValues?: Partial<SkaterFormValues>;
  onSubmit: (data: SkaterFormValues) => Promise<void> | void;
};

export function SkaterForm({ defaultValues, onSubmit }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SkaterFormInput>({
    resolver: zodResolver(skaterSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      position: defaultValues?.position ?? 'C',
      is_active: defaultValues?.is_active ?? true,
      number:
        defaultValues?.number !== undefined && defaultValues?.number !== null
          ? String(defaultValues.number)
          : '',
    },
  });

  const submit = (raw: SkaterFormInput) => {
    const payload: SkaterFormValues = {
      name: raw.name,
      position: raw.position,
      is_active: raw.is_active,
      number: raw.number && raw.number.trim() !== '' ? Number(raw.number) : undefined,
    };

    onSubmit(payload);
  };

  return (
    <View style={{ gap: 12 }}>
      <Text>Nome</Text>
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <TextInput
            value={field.value}
            onChangeText={field.onChange}
            style={{ borderWidth: 1, padding: 8 }}
          />
        )}
      />
      {errors.name && <Text>{errors.name.message}</Text>}

      <Text>Número</Text>
      <Controller
        control={control}
        name="number"
        render={({ field }) => (
          <TextInput
            value={field.value}
            onChangeText={field.onChange}
            keyboardType="numeric"
            style={{ borderWidth: 1, padding: 8 }}
          />
        )}
      />

      <Text>Posição</Text>
      <Controller
        control={control}
        name="position"
        render={({ field }) => (
          <TextInput
            value={field.value}
            onChangeText={field.onChange}
            style={{ borderWidth: 1, padding: 8 }}
          />
        )}
      />

      <Text>Ativo</Text>
      <Controller
        control={control}
        name="is_active"
        render={({ field }) => <Switch value={field.value} onValueChange={field.onChange} />}
      />

      <Button title="Salvar" onPress={handleSubmit(submit)} />
    </View>
  );
}
