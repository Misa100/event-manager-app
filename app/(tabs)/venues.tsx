
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { Colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { mockVenues } from '@/data/mockData';
import { Venue } from '@/types';

export default function VenuesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  const filteredVenues = mockVenues.filter(venue =>
    venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    venue.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedVenue) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setSelectedVenue(null)}
          activeOpacity={0.7}
        >
          <IconSymbol ios_icon_name="chevron.left" android_material_icon_name="arrow-back" size={24} color={Colors.primary} />
          <Text style={styles.backButtonText}>Back to Venues</Text>
        </TouchableOpacity>

        {selectedVenue.photos.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoGallery}>
            {selectedVenue.photos.map((photo, index) => (
              <Image
                key={index}
                source={{ uri: photo }}
                style={styles.venuePhoto}
              />
            ))}
          </ScrollView>
        )}

        <View style={styles.venueHeader}>
          <Text style={styles.venueName}>{selectedVenue.name}</Text>
          <View style={styles.ratingContainer}>
            <IconSymbol ios_icon_name="star.fill" android_material_icon_name="star" size={20} color={Colors.highlight} />
            <Text style={styles.ratingText}>{selectedVenue.rating.toFixed(1)}</Text>
          </View>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>About</Text>
          <Text style={styles.detailText}>{selectedVenue.description}</Text>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Details</Text>
          <View style={styles.detailRow}>
            <IconSymbol ios_icon_name="person.2.fill" android_material_icon_name="people" size={20} color={Colors.primary} />
            <Text style={styles.detailText}>Capacity: {selectedVenue.capacity} guests</Text>
          </View>
          <View style={styles.detailRow}>
            <IconSymbol ios_icon_name="location.fill" android_material_icon_name="location-on" size={20} color={Colors.primary} />
            <Text style={styles.detailText}>{selectedVenue.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <IconSymbol ios_icon_name="dollarsign.circle.fill" android_material_icon_name="attach-money" size={20} color={Colors.primary} />
            <Text style={styles.detailText}>
              {selectedVenue.pricing.perDay
                ? `$${selectedVenue.pricing.perDay.toLocaleString()} per day`
                : `$${selectedVenue.pricing.perHour?.toLocaleString()} per hour`}
            </Text>
          </View>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Amenities</Text>
          <View style={styles.amenitiesContainer}>
            {selectedVenue.amenities.map((amenity, index) => (
              <View key={index} style={styles.amenityChip}>
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Reviews ({selectedVenue.reviews.length})</Text>
          {selectedVenue.reviews.length > 0 ? (
            selectedVenue.reviews.map((review, index) => (
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
        <Text style={styles.headerTitle}>Venues</Text>
        <Text style={styles.headerSubtitle}>Discover the perfect location</Text>
      </View>

      <View style={styles.searchContainer}>
        <IconSymbol ios_icon_name="magnifyingglass" android_material_icon_name="search" size={20} color={Colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search venues..."
          placeholderTextColor={Colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {filteredVenues.map((venue, index) => (
          <TouchableOpacity
            key={index}
            style={styles.venueCard}
            onPress={() => setSelectedVenue(venue)}
            activeOpacity={0.7}
          >
            {venue.photos.length > 0 && (
              <Image
                source={{ uri: venue.photos[0] }}
                style={styles.venueCardImage}
              />
            )}
            <View style={styles.venueCardContent}>
              <View style={styles.venueCardHeader}>
                <Text style={styles.venueCardName}>{venue.name}</Text>
                <View style={styles.venueRating}>
                  <IconSymbol ios_icon_name="star.fill" android_material_icon_name="star" size={16} color={Colors.highlight} />
                  <Text style={styles.venueRatingText}>{venue.rating.toFixed(1)}</Text>
                </View>
              </View>
              <Text style={styles.venueCardDescription} numberOfLines={2}>{venue.description}</Text>
              <View style={styles.venueCardFooter}>
                <View style={styles.venueCardDetail}>
                  <IconSymbol ios_icon_name="person.2" android_material_icon_name="people" size={16} color={Colors.textSecondary} />
                  <Text style={styles.venueCardDetailText}>{venue.capacity} guests</Text>
                </View>
                <View style={styles.venueCardDetail}>
                  <IconSymbol ios_icon_name="location" android_material_icon_name="location-on" size={16} color={Colors.textSecondary} />
                  <Text style={styles.venueCardDetailText}>{venue.location}</Text>
                </View>
              </View>
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
  venueCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  venueCardImage: {
    width: '100%',
    height: 200,
  },
  venueCardContent: {
    padding: 16,
  },
  venueCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  venueCardName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  venueRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  venueRatingText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 4,
  },
  venueCardDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  venueCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  venueCardDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  venueCardDetailText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
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
  photoGallery: {
    marginBottom: 16,
  },
  venuePhoto: {
    width: 300,
    height: 200,
    borderRadius: 12,
    marginRight: 12,
  },
  venueHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  venueName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 6,
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
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityChip: {
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  amenityText: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: '500',
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
