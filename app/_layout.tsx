import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NativeBaseProvider } from 'native-base';
import React from 'react';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <NativeBaseProvider>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }} />
      </QueryClientProvider>
    </NativeBaseProvider>
  );
}
