
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { mockEvents, mockClients, mockServiceProviders, mockVenues } from '@/data/mockData';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();

  const stats = [
    { label: 'Active Events', value: mockEvents.filter(e => e.status === 'planning' || e.status === 'confirmed').length, color: Colors.primary },
    { label: 'Total Clients', value: mockClients.length, color: Colors.accent },
    { label: 'Service Providers', value: mockServiceProviders.length, color: Colors.highlight },
    { label: 'Venues', value: mockVenues.length, color: Colors.secondary },
  ];

  const quickActions = [
    { title: 'New Event', icon: 'add_circle', route: '/(tabs)/events', ios_icon: 'plus.circle.fill', color: Colors.primary },
    { title: 'Add Client', icon: 'person_add', route: '/(tabs)/clients', ios_icon: 'person.badge.plus', color: Colors.accent },
    { title: 'Browse Providers', icon: 'search', route: '/(tabs)/providers', ios_icon: 'magnifyingglass', color: Colors.highlight },
    { title: 'View Calendar', icon: 'calendar_month', route: '/(tabs)/events', ios_icon: 'calendar', color: Colors.secondary },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Event Manager</Text>
        <Text style={styles.headerSubtitle}>Organize your celebrations with ease</Text>
      </View>

      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={[styles.statCard, { borderLeftColor: stat.color }]}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.actionCard, { backgroundColor: action.color }]}
              onPress={() => router.push(action.route as any)}
              activeOpacity={0.7}
            >
              <IconSymbol
                ios_icon_name={action.ios_icon}
                android_material_icon_name={action.icon as any}
                size={32}
                color="#FFFFFF"
              />
              <Text style={styles.actionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        {mockEvents.slice(0, 3).map((event, index) => (
          <TouchableOpacity
            key={index}
            style={styles.eventCard}
            onPress={() => router.push('/(tabs)/events')}
            activeOpacity={0.7}
          >
            <View style={styles.eventHeader}>
              <View style={[styles.eventTypeBadge, { backgroundColor: event.type === 'wedding' ? Colors.primary : Colors.accent }]}>
                <Text style={styles.eventTypeBadgeText}>{event.type.toUpperCase()}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: event.status === 'confirmed' ? Colors.success : Colors.warning }]}>
                <Text style={styles.statusBadgeText}>{event.status.toUpperCase()}</Text>
              </View>
            </View>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <View style={styles.eventDetails}>
              <View style={styles.eventDetailRow}>
                <IconSymbol ios_icon_name="calendar" android_material_icon_name="event" size={16} color={Colors.textSecondary} />
                <Text style={styles.eventDetailText}>{event.date}</Text>
              </View>
              <View style={styles.eventDetailRow}>
                <IconSymbol ios_icon_name="person.2" android_material_icon_name="people" size={16} color={Colors.textSecondary} />
                <Text style={styles.eventDetailText}>{event.guestCount} guests</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingTop: 48,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    width: (width - 48) / 2,
    marginBottom: 12,
    borderLeftWidth: 4,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 48) / 2,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  eventCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  eventTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  eventTypeBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  eventDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventDetailText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  bottomPadding: {
    height: 100,
  },
});
