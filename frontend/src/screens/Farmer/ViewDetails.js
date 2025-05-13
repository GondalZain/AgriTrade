
import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles/ViewDetailsStyles';

export default function ViewDetails({ navigation, route }) {
  const { product } = route.params;

  // Format dates
  const formattedCreatedAt = product.createdAt
    ? new Date(product.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Not specified';

  const formattedHarvestDate = product.harvestDate
    ? new Date(product.harvestDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Not specified';

  // Format quantity with unit
  const formattedQuantity = product.quantity
    ? `${product.quantity} ${product.unit || ''}`.trim()
    : 'Not specified';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.imageSection}>
            {product.imageUrl ? (
              <Image
                source={{ uri: product.imageUrl }}
                style={styles.productImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.noImage}>
                <Ionicons name="image-outline" size={50} color="#B0B0B0" />
                <Text style={styles.noImageText}>No Image Available</Text>
              </View>
            )}
          </View>
          <View style={styles.detailsSection}>
            <Text style={styles.productTitle}>{product.name || 'Not specified'}</Text>
            <Text style={styles.productPrice}>
              Price: ₹{product.price ? product.price.toFixed(2) : 'Not specified'}
            </Text>
            <Text style={styles.detailItem}>Quantity: {formattedQuantity}</Text>
            <Text style={styles.detailItem}>Description: {product.description || 'No description available'}</Text>
            <Text style={styles.detailItem}>Category: {product.category || 'Not specified'}</Text>
            <Text style={styles.detailItem}>Location: {product.location || 'Not specified'}</Text>
            <Text style={styles.detailItem}>Harvest Date: {formattedHarvestDate}</Text>
            <Text style={styles.detailItem}>Date Added: {formattedCreatedAt}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" style={styles.backIcon} />
          <Text style={styles.backButtonText}>Back to Products</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
