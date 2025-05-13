
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Alert, // Re-import Alert to fix the ReferenceError
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import styles from '../../styles/MyProductsStyles';

export default function EditProduct({ navigation, route }) {
  const { product } = route.params;
  const { token } = useContext(AuthContext);

  // Initialize state for all editable fields
  const [name, setName] = useState(product.name || '');
  const [price, setPrice] = useState(product.price ? product.price.toString() : '');
  const [description, setDescription] = useState(product.description || '');
  const [category, setCategory] = useState(product.category || '');
  const [quantity, setQuantity] = useState(product.quantity ? product.quantity.toString() : '');
  const [unit, setUnit] = useState(product.unit || '');
  const [location, setLocation] = useState(product.location || '');
  const [harvestDate, setHarvestDate] = useState(product.harvestDate || '');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSave = async () => {
    if (!token) {
      Alert.alert('Error', 'Authentication required');
      return;
    }

    // Validate required fields
    if (!name || !price || !description || !category || !quantity || !location || !harvestDate) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    const updatedProduct = {
      name,
      price: parseFloat(price),
      description,
      category,
      quantity: quantity ? parseInt(quantity) : null,
      unit,
      location,
      harvestDate,
    };

    console.log('Sending PUT request with payload:', updatedProduct);

    try {
      const response = await fetch(`http://localhost:5000/api/farmer/products/${product._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProduct),
      });

      const data = await response.json();
      console.log('PUT response:', { status: response.status, headers: response.headers, data });
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update product');
      }

      Alert.alert('Success', 'Product updated successfully!');
      navigation.goBack();
    } catch (err) {
      console.error('PUT error:', err.message);
      Alert.alert('Error', err.message || 'Failed to update product');
    }
  };

  const executeDelete = async () => {
    try {
      console.log('Executing DELETE request for product ID:', product._id);
      const response = await fetch(`http://localhost:5000/api/farmer/products/${product._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const text = await response.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        data = { error: 'Invalid JSON response' };
      }
      console.log('DELETE response:', { status: response.status, headers: response.headers, data, rawText: text });

      if (!response.ok) {
        throw new Error(data.error || `Failed to delete product (Status: ${response.status})`);
      }

      Alert.alert('Success', 'Product deleted successfully!');
      navigation.goBack();
    } catch (err) {
      console.error('DELETE error:', err.message);
      Alert.alert('Error', `Failed to delete product: ${err.message}`);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleDelete = () => {
    if (!token) {
      Alert.alert('Error', 'Authentication required');
      return;
    }

    console.log('Attempting to delete product with ID:', product._id);
    console.log('Token used for DELETE request:', token);
    console.log('Current time:', new Date().toISOString());
    console.log('Opening delete confirmation modal');
    setShowDeleteModal(true);
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Edit Product</Text>
          <View style={styles.imageContainer}>
            {product.imageUrl ? (
              <Image
                source={{ uri: product.imageUrl }}
                style={styles.productImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.noImage}>
                <Ionicons name="image-outline" size={40} color="#D3D3D3" />
                <Text style={styles.noImageText}>No Image</Text>
              </View>
            )}
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.detailLabel}>Name:</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Product Name"
            />
            <Text style={styles.detailLabel}>Price (₹):</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="Price"
              keyboardType="numeric"
            />
            <Text style={styles.detailLabel}>Description:</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="Description"
              multiline
            />
            <Text style={styles.detailLabel}>Category:</Text>
            <TextInput
              style={styles.input}
              value={category}
              onChangeText={setCategory}
              placeholder="Category"
            />
            <Text style={styles.detailLabel}>Quantity:</Text>
            <TextInput
              style={styles.input}
              value={quantity}
              onChangeText={setQuantity}
              placeholder="Quantity"
              keyboardType="numeric"
            />
            <Text style={styles.detailLabel}>Unit:</Text>
            <TextInput
              style={styles.input}
              value={unit}
              onChangeText={setUnit}
              placeholder="Unit (e.g., kg, pieces)"
            />
            <Text style={styles.detailLabel}>Location:</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="Location"
            />
            <Text style={styles.detailLabel}>Harvest Date (YYYY-MM-DD):</Text>
            <TextInput
              style={styles.input}
              value={harvestDate}
              onChangeText={setHarvestDate}
              placeholder="Harvest Date (YYYY-MM-DD)"
            />
          </View>
          <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
            <Text style={styles.actionButtonText}>Save Changes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#D32F2F' }]}
            onPress={handleDelete}
          >
            <Text style={styles.actionButtonText}>Delete Product</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#6B7280' }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.actionButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Custom Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          console.log('Modal closed');
          setShowDeleteModal(false);
        }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: 300 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Confirm Delete</Text>
            <Text style={{ marginBottom: 20 }}>Are you sure you want to delete this product?</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#6B7280',
                  padding: 10,
                  borderRadius: 5,
                  flex: 1,
                  marginRight: 10,
                  alignItems: 'center',
                }}
                onPress={() => {
                  console.log('Delete canceled by user');
                  setShowDeleteModal(false);
                }}
              >
                <Text style={{ color: 'white' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: '#D32F2F',
                  padding: 10,
                  borderRadius: 5,
                  flex: 1,
                  alignItems: 'center',
                }}
                onPress={() => {
                  console.log('Delete confirmed by user');
                  executeDelete();
                }}
              >
                <Text style={{ color: 'white' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
