
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { Colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { mockServiceProviders } from '@/data/mockData';
import { ServiceProvider, ServiceType } from '@/types';

const serviceTypeLabels: Record<ServiceType, string> = {
  photographer: 'Photographer',
  videographer: 'Videographer',
  drone_operator: 'Drone Operator',
  audio_provider: 'Audio Provider',
  dj: 'DJ',
  caterer: 'Caterer',
  decorator: 'Decorator',
};

export default function ProvidersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ServiceType | 'all'>('all');
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);

  const filteredProviders = mockServiceProviders.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || provider.serviceType === selectedType;
    return matchesSearch && matchesType;
  });

  const serviceTypes: Array<ServiceType | 'all'> = ['all', 'photographer', 'videographer', 'drone_operator', 'caterer', 'dj', 'decorator'];

  if (selectedProvider) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setSelectedProvider(null)}
          activeOpacity={0.7}
        >
          <IconSymbol ios_icon_name="chevron.left" android_material_icon_name="arrow-back" size={24} color={Colors.primary} />
          <Text style={styles.backButtonText}>Back to Providers</Text>
        </TouchableOpacity>

        <View style={styles.providerHeader}>
          <Text style={styles.providerName}>{selectedProvider.name}</Text>
          <View style={styles.ratingContainer}>
            <IconSymbol ios_icon_name="star.fill" android_material_icon_name="star" size={20} color={Colors.highlight} />
            <Text style={styles.ratingText}>{selectedProvider.rating.toFixed(1)}</Text>
          </View>
          <Text style={styles.serviceTypeBadge}>{serviceTypeLabels[selectedProvider.serviceType]}</Text>
        </View>

        {selectedProvider.portfolio.length > 0 && (
          <View style={styles.portfolioSection}>
            <Text style={styles.sectionTitle}>Portfolio</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {selectedProvider.portfolio.map((photo, index) => (
                <Image
                  key={index}
                  source={{ uri: photo }}
                  style={styles.portfolioImage}
                />
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>About</Text>
          <Text style={styles.detailText}>{selectedProvider.description}</Text>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Pricing</Text>
          <Text style={styles.pricingText}>
            {selectedProvider.pricing.currency} ${selectedProvider.pricing.min.toLocaleString()} - ${selectedProvider.pricing.max.toLocaleString()}
          </Text>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Contact Information</Text>
          <View style={styles.detailRow}>
            <IconSymbol ios_icon_name="phone.fill" android_material_icon_name="phone" size={20} color={Colors.primary} />
            <Text style={styles.detailText}>{selectedProvider.phone}</Text>
          </View>
          <View style={styles.detailRow}>
            <IconSymbol ios_icon_name="envelope.fill" android_material_icon_name="email" size={20} color={Colors.primary} />
            <Text style={styles.detailText}>{selectedProvider.email}</Text>
          </View>
          <View style={styles.detailRow}>
            <IconSymbol ios_icon_name="location.fill" android_material_icon_name="location-on" size={20} color={Colors.primary} />
            <Text style={styles.detailText}>{selectedProvider.location}</Text>
          </View>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Reviews ({selectedProvider.reviews.length})</Text>
          {selectedProvider.reviews.length > 0 ? (
            selectedProvider.reviews.map((review, index) => (
              <View key={index} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewName}>{review.clientName}</Text>
                  <View style={styles.reviewRating}>
                    <IconSymbol ios_icon_name="star.fill" android_material_icon_name="star" size={16} color={Colors.highlight} />
                    <Text style={styles.reviewRatingText}>{review.rating}</Text>
                  </View>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
                <Text style={styles.reviewDate}>{review.date}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No reviews yet</Text>
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Service Providers</Text>
        <Text style={styles.headerSubtitle}>Find the perfect team for your event</Text>
      </View>

      <View style={styles.searchContainer}>
        <IconSymbol ios_icon_name="magnifyingglass" android_material_icon_name="search" size={20} color={Colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search providers..."
          placeholderTextColor={Colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        {serviceTypes.map((type, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.filterChip, selectedType === type && styles.filterChipActive]}
            onPress={() => setSelectedType(type)}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterChipText, selectedType === type && styles.filterChipTextActive]}>
              {type === 'all' ? 'All' : serviceTypeLabels[type]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {filteredProviders.map((provider, index) => (
          <TouchableOpacity
            key={index}
            style={styles.providerCard}
            onPress={() => setSelectedProvider(provider)}
            activeOpacity={0.7}
          >
            <View style={styles.providerCardHeader}>
              <View style={styles.providerCardInfo}>
                <Text style={styles.providerCardName}>{provider.name}</Text>
                <Text style={styles.providerCardType}>{serviceTypeLabels[provider.serviceType]}</Text>
              </View>
              <View style={styles.providerRating}>
                <IconSymbol ios_icon_name="star.fill" android_material_icon_name="star" size={16} color={Colors.highlight} />
                <Text style={styles.providerRatingText}>{provider.rating.toFixed(1)}</Text>
              </View>
            </View>
            <Text style={styles.providerCardDescription} numberOfLines={2}>{provider.description}</Text>
            <View style={styles.providerCardFooter}>
              <Text style={styles.providerCardPrice}>
                ${provider.pricing.min.toLocaleString()} - ${provider.pricing.max.toLocaleString()}
              </Text>
              <Text style={styles.providerCardLocation}>{provider.location}</Text>
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
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.card,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  providerCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  providerCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  providerCardInfo: {
    flex: 1,
  },
  providerCardName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  providerCardType: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  providerRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerRatingText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 4,
  },
  providerCardDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  providerCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  providerCardPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.accent,
  },
  providerCardLocation: {
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
  providerHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  providerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 6,
  },
  serviceTypeBadge: {
    backgroundColor: Colors.primary,
    color: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    fontSize: 14,
    fontWeight: '600',
  },
  portfolioSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  portfolioImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginRight: 12,
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
  detailText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  pricingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.accent,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewItem: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.highlight,
    paddingLeft: 12,
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewRatingText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 4,
  },
  reviewComment: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
    lineHeight: 20,
  },
  reviewDate: {
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
