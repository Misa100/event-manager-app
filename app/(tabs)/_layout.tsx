
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { Colors } from '@/styles/commonStyles';

export default function TabLayout() {
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)',
      icon: 'home',
      label: 'Home',
    },
    {
      name: 'clients',
      route: '/(tabs)/clients',
      icon: 'people',
      label: 'Clients',
    },
    {
      name: 'providers',
      route: '/(tabs)/providers',
      icon: 'business',
      label: 'Providers',
    },
    {
      name: 'venues',
      route: '/(tabs)/venues',
      icon: 'location-city',
      label: 'Venues',
    },
    {
      name: 'events',
      route: '/(tabs)/events',
      icon: 'event',
      label: 'Events',
    },
    {
      name: 'profile',
      route: '/(tabs)/profile',
      icon: 'person',
      label: 'Profile',
    },
  ];

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen key="home" name="(home)" />
        <Stack.Screen key="clients" name="clients" />
        <Stack.Screen key="providers" name="providers" />
        <Stack.Screen key="venues" name="venues" />
        <Stack.Screen key="events" name="events" />
        <Stack.Screen key="profile" name="profile" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
