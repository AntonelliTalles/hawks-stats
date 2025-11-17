import React from 'react';
import { Controller, SubmitHandler, useForm, Resolver } from 'react-hook-form';
import { Button, FormControl, Input, Switch, VStack } from 'native-base';
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
  const { control, handleSubmit, formState: { errors } } = useForm<GoalieFormValues>({
    resolver: zodResolver(goalieSchema) as Resolver<GoalieFormValues>,
    defaultValues: { name: '', is_active: true, ...defaultValues },
  });

  const submit: SubmitHandler<GoalieFormValues> = async (values) => {
    await onSubmit(values);
  };

  return (
    <VStack space="3">
      <FormControl isInvalid={!!errors.name}>
        <FormControl.Label>Nome</FormControl.Label>
        <Controller name="name" control={control} render={({ field }) => <Input {...field} />} />
        <FormControl.ErrorMessage>{errors.name?.message}</FormControl.ErrorMessage>
      </FormControl>

      <FormControl>
        <FormControl.Label>Ativo</FormControl.Label>
        <Controller
          name="is_active"
          control={control}
          render={({ field: { value, onChange } }) => <Switch isChecked={value} onValueChange={onChange} />}
        />
      </FormControl>

      <Button onPress={handleSubmit(submit)} isLoading={!!submitting}>Salvar</Button>
    </VStack>
  );
}
