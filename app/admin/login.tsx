import React from 'react';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import { Box, Button, FormControl, Heading, Input, Text } from 'native-base';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '../../src/services/supabase';
import { router } from 'expo-router';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
type FormData = z.infer<typeof schema>;

export default function Login() {
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    const { error } = await supabase.auth.signInWithPassword(values);
    if (error) {
      // opcional: exibir toast/erro
      return;
    }
    router.replace('/admin/manage-skaters'); // ou manage-goalies
  };

  return (
    <Box safeArea p="4">
      <Heading mb="6">Admin Login</Heading>

      <FormControl mb="4" isInvalid={!!errors.email}>
        <FormControl.Label>E-mail</FormControl.Label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input {...field} autoCapitalize="none" keyboardType="email-address" />
          )}
        />
        <FormControl.ErrorMessage>{errors.email?.message}</FormControl.ErrorMessage>
      </FormControl>

      <FormControl mb="6" isInvalid={!!errors.password}>
        <FormControl.Label>Senha</FormControl.Label>
        <Controller
          name="password"
          control={control}
          render={({ field }) => <Input {...field} secureTextEntry />}
        />
        <FormControl.ErrorMessage>{errors.password?.message}</FormControl.ErrorMessage>
      </FormControl>

      <Button onPress={handleSubmit(onSubmit)} isLoading={isSubmitting}>
        Entrar
      </Button>
      <Text mt="4" color="coolGray.500">Acesso restrito.</Text>
    </Box>
  );
}