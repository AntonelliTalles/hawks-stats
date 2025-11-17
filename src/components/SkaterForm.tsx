import React from 'react';
import { Controller, SubmitHandler, useForm, Resolver } from 'react-hook-form';
import { Button, FormControl, HStack, Input, Select, Switch, VStack } from 'native-base';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Tipo FINAL que queremos no submit:
export type SkaterFormValues = {
  name: string;
  number?: number; // opcional
  position: 'C' | 'LW' | 'RW' | 'D';
  is_active: boolean;
};

// Converte a string do Input para número ou undefined
const skaterSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  number: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
    z.number().int().min(0).max(99).optional()
  ),
  position: z.enum(['C', 'LW', 'RW', 'D']),
  is_active: z.boolean(),
});

type Props = {
  defaultValues?: Partial<SkaterFormValues>;
  onSubmit: (data: SkaterFormValues) => Promise<void> | void;
  submitting?: boolean;
};

export function SkaterForm({ defaultValues, onSubmit, submitting }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SkaterFormValues>({
    // força o resolver a “falar” o mesmo tipo do form:
    resolver: zodResolver(skaterSchema) as Resolver<SkaterFormValues>,
    defaultValues: { name: '', position: 'C', is_active: true, number: undefined, ...defaultValues },
  });

  const submit: SubmitHandler<SkaterFormValues> = async (values) => {
    await onSubmit(values);
  };

  return (
    <VStack space="3">
      <FormControl isInvalid={!!errors.name}>
        <FormControl.Label>Nome</FormControl.Label>
        <Controller name="name" control={control} render={({ field }) => <Input {...field} />} />
        <FormControl.ErrorMessage>{errors.name?.message}</FormControl.ErrorMessage>
      </FormControl>

      <HStack space="3">
        <FormControl flex={1} isInvalid={!!errors.number}>
          <FormControl.Label>#</FormControl.Label>
          <Controller
            name="number"
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                keyboardType="numeric"
                value={value === undefined ? '' : String(value)}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          <FormControl.ErrorMessage>{errors.number?.message as string}</FormControl.ErrorMessage>
        </FormControl>

        <FormControl flex={1} isInvalid={!!errors.position}>
          <FormControl.Label>Posição</FormControl.Label>
          <Controller
            name="position"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select selectedValue={value} onValueChange={onChange}>
                <Select.Item label="Center (C)" value="C" />
                <Select.Item label="Left Wing (LW)" value="LW" />
                <Select.Item label="Right Wing (RW)" value="RW" />
                <Select.Item label="Defense (D)" value="D" />
              </Select>
            )}
          />
          <FormControl.ErrorMessage>{errors.position?.message}</FormControl.ErrorMessage>
        </FormControl>
      </HStack>

      <FormControl>
        <FormControl.Label>Ativo</FormControl.Label>
        <Controller
          name="is_active"
          control={control}
          render={({ field: { value, onChange } }) => <Switch isChecked={value} onValueChange={onChange} />}
        />
      </FormControl>

      <Button onPress={handleSubmit(submit)} isLoading={!!submitting}>
        Salvar
      </Button>
    </VStack>
  );
}
