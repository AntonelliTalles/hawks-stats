import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View, Text, TextInput, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '../../src/services/supabase';
import { router } from 'expo-router';

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo de 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: FormData) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      // TODO: exibir toast/erro na tela
      console.log(error.message);
      return;
    }

    router.replace('/admin/adjust-skaters');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Login</Text>

      <View style={styles.field}>
        <Text style={styles.label}>E-mail</Text>
        <Controller
          name="email"
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              style={[styles.input, errors.email ? styles.inputError : null]}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="seu@email.com"
              placeholderTextColor="#777"
            />
          )}
        />
        {errors.email?.message ? (
          <Text style={styles.errorText}>{errors.email.message}</Text>
        ) : null}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Senha</Text>
        <Controller
          name="password"
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              style={[styles.input, errors.password ? styles.inputError : null]}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              secureTextEntry
              placeholder="******"
              placeholderTextColor="#777"
            />
          )}
        />
        {errors.password?.message ? (
          <Text style={styles.errorText}>{errors.password.message}</Text>
        ) : null}
      </View>

      <Pressable
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        style={({ pressed }) => [
          styles.button,
          isSubmitting ? styles.buttonDisabled : null,
          pressed && !isSubmitting ? styles.buttonPressed : null,
        ]}
      >
        {isSubmitting ? <ActivityIndicator /> : <Text style={styles.buttonText}>Entrar</Text>}
      </Pressable>

      <Text style={styles.helper}>Acesso restrito.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 48,
    flex: 1,
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#b00020',
  },
  errorText: {
    color: '#b00020',
    fontSize: 13,
  },
  button: {
    marginTop: 8,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  helper: {
    color: '#777',
    marginTop: 6,
  },
});
