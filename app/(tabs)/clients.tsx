
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { mockClients } from '@/data/mockData';
import { Client } from '@/types';

export default function ClientsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const filteredClients = mockClients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedClient) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setSelectedClient(null)}
          activeOpacity={0.7}
        >
          <IconSymbol ios_icon_name="chevron.left" android_material_icon_name="arrow-back" size={24} color={Colors.primary} />
          <Text style={styles.backButtonText}>Back to Clients</Text>
        </TouchableOpacity>

        <View style={styles.profileHeader}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{selectedClient.name.charAt(0)}</Text>
          </View>
          <Text style={styles.profileName}>{selectedClient.name}</Text>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Contact Information</Text>
          <View style={styles.detailRow}>
            <IconSymbol ios_icon_name="envelope.fill" android_material_icon_name="email" size={20} color={Colors.primary} />
            <Text style={styles.detailText}>{selectedClient.email}</Text>
          </View>
          <View style={styles.detailRow}>
            <IconSymbol ios_icon_name="phone.fill" android_material_icon_name="phone" size={20} color={Colors.primary} />
            <Text style={styles.detailText}>{selectedClient.phone}</Text>
          </View>
          {selectedClient.address && (
            <View style={styles.detailRow}>
              <IconSymbol ios_icon_name="location.fill" android_material_icon_name="location-on" size={20} color={Colors.primary} />
              <Text style={styles.detailText}>{selectedClient.address}</Text>
            </View>
          )}
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Communication Logs</Text>
          {selectedClient.communicationLogs.length > 0 ? (
            selectedClient.communicationLogs.map((log, index) => (
              <View key={index} style={styles.logItem}>
                <View style={styles.logHeader}>
                  <Text style={styles.logType}>{log.type.toUpperCase()}</Text>
                  <Text style={styles.logDate}>{log.date}</Text>
                </View>
                <Text style={styles.logNotes}>{log.notes}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No communication logs yet</Text>
          )}
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Booking History</Text>
          {selectedClient.bookingHistory.length > 0 ? (
            selectedClient.bookingHistory.map((booking, index) => (
              <View key={index} style={styles.bookingItem}>
                <Text style={styles.bookingText}>Booking #{booking.id}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No bookings yet</Text>
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Clients</Text>
        <Text style={styles.headerSubtitle}>Manage your client profiles</Text>
      </View>

      <View style={styles.searchContainer}>
        <IconSymbol ios_icon_name="magnifyingglass" android_material_icon_name="search" size={20} color={Colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search clients..."
          placeholderTextColor={Colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {filteredClients.map((client, index) => (
          <TouchableOpacity
            key={index}
            style={styles.clientCard}
            onPress={() => setSelectedClient(client)}
            activeOpacity={0.7}
          >
            <View style={styles.clientAvatar}>
              <Text style={styles.clientAvatarText}>{client.name.charAt(0)}</Text>
            </View>
            <View style={styles.clientInfo}>
              <Text style={styles.clientName}>{client.name}</Text>
              <Text style={styles.clientEmail}>{client.email}</Text>
              <Text style={styles.clientPhone}>{client.phone}</Text>
            </View>
            <IconSymbol ios_icon_name="chevron.right" android_material_icon_name="chevron-right" size={24} color={Colors.textSecondary} />
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
  clientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  clientAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  clientAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  clientEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  clientPhone: {
    fontSize: 14,
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
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
    color: Colors.textSecondary,
    marginLeft: 12,
    flex: 1,
  },
  logItem: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    paddingLeft: 12,
    marginBottom: 12,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  logType: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  logDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  logNotes: {
    fontSize: 14,
    color: Colors.text,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  bookingItem: {
    padding: 12,
    backgroundColor: Colors.background,
    borderRadius: 8,
    marginBottom: 8,
  },
  bookingText: {
    fontSize: 14,
    color: Colors.text,
  },
  bottomPadding: {
    height: 100,
  },
});
