import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#9ca3af',
      }}
    >
      <Tabs.Screen
        name="skaters"
        options={{
          title: 'Skaters',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="goalies"
        options={{
          title: 'Goalies',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="shield-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="two"
        options={{
          title: 'Two',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="apps-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
