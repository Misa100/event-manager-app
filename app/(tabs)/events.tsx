
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { mockEvents, mockClients, mockVenues, mockServiceProviders } from '@/data/mockData';
import { Event } from '@/types';

const eventTypeLabels = {
  wedding: 'Wedding',
  birthday: 'Birthday',
  corporate: 'Corporate',
  other: 'Other',
};

const statusColors = {
  planning: Colors.warning,
  confirmed: Colors.accent,
  completed: Colors.secondary,
  cancelled: Colors.error,
};

export default function EventsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const filteredEvents = mockEvents.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedEvent) {
    const client = mockClients.find(c => c.id === selectedEvent.clientId);
    const venue = mockVenues.find(v => v.id === selectedEvent.venueId);

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setSelectedEvent(null)}
          activeOpacity={0.7}
        >
          <IconSymbol ios_icon_name="chevron.left" android_material_icon_name="arrow-back" size={24} color={Colors.primary} />
          <Text style={styles.backButtonText}>Back to Events</Text>
        </TouchableOpacity>

        <View style={styles.eventHeader}>
          <Text style={styles.eventTitle}>{selectedEvent.title}</Text>
          <View style={styles.badgeContainer}>
            <View style={[styles.typeBadge, { backgroundColor: Colors.primary }]}>
              <Text style={styles.badgeText}>{eventTypeLabels[selectedEvent.type]}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusColors[selectedEvent.status] }]}>
              <Text style={styles.badgeText}>{selectedEvent.status.toUpperCase()}</Text>
            </View>
          </View>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Event Details</Text>
          <View style={styles.detailRow}>
            <IconSymbol ios_icon_name="calendar" android_material_icon_name="event" size={20} color={Colors.primary} />
            <Text style={styles.detailText}>{selectedEvent.date}</Text>
          </View>
          <View style={styles.detailRow}>
            <IconSymbol ios_icon_name="clock" android_material_icon_name="schedule" size={20} color={Colors.primary} />
            <Text style={styles.detailText}>{selectedEvent.startTime} - {selectedEvent.endTime}</Text>
          </View>
          <View style={styles.detailRow}>
            <IconSymbol ios_icon_name="person.2" android_material_icon_name="people" size={20} color={Colors.primary} />
            <Text style={styles.detailText}>{selectedEvent.guestCount} guests</Text>
          </View>
          <View style={styles.detailRow}>
            <IconSymbol ios_icon_name="dollarsign.circle" android_material_icon_name="attach-money" size={20} color={Colors.primary} />
            <Text style={styles.detailText}>Budget: ${selectedEvent.budget.toLocaleString()}</Text>
          </View>
        </View>

        {client && (
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Client</Text>
            <Text style={styles.detailText}>{client.name}</Text>
            <Text style={styles.detailTextSecondary}>{client.email}</Text>
            <Text style={styles.detailTextSecondary}>{client.phone}</Text>
          </View>
        )}

        {venue && (
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Venue</Text>
            <Text style={styles.detailText}>{venue.name}</Text>
            <Text style={styles.detailTextSecondary}>{venue.location}</Text>
          </View>
        )}

        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Assigned Providers ({selectedEvent.assignedProviders.length})</Text>
          {selectedEvent.assignedProviders.length > 0 ? (
            selectedEvent.assignedProviders.map((ap, index) => {
              const provider = mockServiceProviders.find(p => p.id === ap.providerId);
              return (
                <View key={index} style={styles.providerItem}>
                  <Text style={styles.providerName}>{provider?.name || 'Unknown'}</Text>
                  <Text style={styles.providerType}>{ap.serviceType.replace('_', ' ')}</Text>
                </View>
              );
            })
          ) : (
            <Text style={styles.emptyText}>No providers assigned yet</Text>
          )}
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Timeline ({selectedEvent.timeline.length})</Text>
          {selectedEvent.timeline.length > 0 ? (
            selectedEvent.timeline.map((item, index) => (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTime}>{item.time}</Text>
                  <Text style={styles.timelineTitle}>{item.title}</Text>
                  {item.description && (
                    <Text style={styles.timelineDescription}>{item.description}</Text>
                  )}
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No timeline items yet</Text>
          )}
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Tasks ({selectedEvent.tasks.length})</Text>
          {selectedEvent.tasks.length > 0 ? (
            selectedEvent.tasks.map((task, index) => (
              <View key={index} style={styles.taskItem}>
                <View style={[styles.taskCheckbox, task.completed && styles.taskCheckboxCompleted]}>
                  {task.completed && (
                    <IconSymbol ios_icon_name="checkmark" android_material_icon_name="check" size={16} color="#FFFFFF" />
                  )}
                </View>
                <View style={styles.taskContent}>
                  <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>{task.title}</Text>
                  <Text style={styles.taskDueDate}>Due: {task.dueDate}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No tasks yet</Text>
          )}
        </View>

        {selectedEvent.notes && (
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Notes</Text>
            <Text style={styles.detailText}>{selectedEvent.notes}</Text>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Events</Text>
        <Text style={styles.headerSubtitle}>Manage your celebrations</Text>
      </View>

      <View style={styles.searchContainer}>
        <IconSymbol ios_icon_name="magnifyingglass" android_material_icon_name="search" size={20} color={Colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search events..."
          placeholderTextColor={Colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {filteredEvents.map((event, index) => (
          <TouchableOpacity
            key={index}
            style={styles.eventCard}
            onPress={() => setSelectedEvent(event)}
            activeOpacity={0.7}
          >
            <View style={styles.eventCardHeader}>
              <View style={[styles.eventTypeBadge, { backgroundColor: Colors.primary }]}>
                <Text style={styles.eventTypeBadgeText}>{eventTypeLabels[event.type]}</Text>
              </View>
              <View style={[styles.eventStatusBadge, { backgroundColor: statusColors[event.status] }]}>
                <Text style={styles.eventStatusBadgeText}>{event.status.toUpperCase()}</Text>
              </View>
            </View>
            <Text style={styles.eventCardTitle}>{event.title}</Text>
            <View style={styles.eventCardDetails}>
              <View style={styles.eventCardDetailRow}>
                <IconSymbol ios_icon_name="calendar" android_material_icon_name="event" size={16} color={Colors.textSecondary} />
                <Text style={styles.eventCardDetailText}>{event.date}</Text>
              </View>
              <View style={styles.eventCardDetailRow}>
                <IconSymbol ios_icon_name="person.2" android_material_icon_name="people" size={16} color={Colors.textSecondary} />
                <Text style={styles.eventCardDetailText}>{event.guestCount} guests</Text>
              </View>
            </View>
            <View style={styles.eventCardFooter}>
              <Text style={styles.eventCardBudget}>Budget: ${event.budget.toLocaleString()}</Text>
              <Text style={styles.eventCardProviders}>{event.assignedProviders.length} providers</Text>
            </View>
          </TouchableOpacity>
        ))}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
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
    paddingTop: 48,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.text,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  eventCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  eventCardHeader: {
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
  eventStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  eventStatusBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  eventCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  eventCardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  eventCardDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventCardDetailText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  eventCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventCardBudget: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.accent,
  },
  eventCardProviders: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.primary,
    marginLeft: 8,
    fontWeight: '600',
  },
  eventHeader: {
    marginBottom: 24,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  detailCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  detailLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 12,
    flex: 1,
  },
  detailTextSecondary: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  providerItem: {
    padding: 12,
    backgroundColor: Colors.background,
    borderRadius: 8,
    marginBottom: 8,
  },
  providerName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  providerType: {
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: 'capitalize',
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    marginTop: 4,
    marginRight: 12,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTime: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 4,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  timelineDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  taskCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskCheckboxCompleted: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary,
  },
  taskDueDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  bottomPadding: {
    height: 100,
  },
});
