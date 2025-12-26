
import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { Colors } from '@/styles/commonStyles';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger key="home" name="(home)">
        <Icon sf="house.fill" />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="clients" name="clients">
        <Icon sf="person.2.fill" />
        <Label>Clients</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="providers" name="providers">
        <Icon sf="briefcase.fill" />
        <Label>Providers</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="venues" name="venues">
        <Icon sf="building.2.fill" />
        <Label>Venues</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="events" name="events">
        <Icon sf="calendar" />
        <Label>Events</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
