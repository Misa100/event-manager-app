
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
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
      icon: 'location_city',
      label: 'Venues',
    },
    {
      name: 'events',
      route: '/(tabs)/events',
      icon: 'event',
      label: 'Events',
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
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
