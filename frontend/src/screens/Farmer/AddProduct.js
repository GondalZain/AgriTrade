
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Platform, Alert, TouchableOpacity, Image, ScrollView } from 'react-native';
import FarmerHeader from '../../components/FarmerHeader';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import * as ImagePicker from 'react-native-image-picker';
import styles from '../../styles/AddProductStyles';

export default function AddProduct({ navigation }) {
  const { token, email } = useContext(AuthContext);
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    quantity: '',
    location: '',
    harvestDate: '',
    unit: '', // Added unit field
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setProductData((prev) => ({ ...prev, [field]: value }));
  };

  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
      includeBase64: Platform.OS === 'web', // Include Base64 only for web
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        Alert.alert('Error', `ImagePicker Error: ${response.errorMessage}`);
      } else {
        const asset = response.assets[0];
        console.log('Selected image:', asset); // Debug image data
        setImage({
          uri: asset.uri,
          type: asset.type || 'image/jpeg', // Fallback type
          name: asset.fileName || `product_${Date.now()}.jpg`,
          base64: asset.base64, // Store Base64 if available
        });
      }
    });
  };

  const handleSubmit = async () => {
    const { name, description, category, price, quantity, location, harvestDate } = productData;
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a product name');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }
    if (!category.trim()) {
      Alert.alert('Error', 'Please enter a category');
      return;
    }
    if (!price || isNaN(price) || Number(price) <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }
    if (!quantity || isNaN(quantity) || Number(quantity) <= 0) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }
    if (!location.trim()) {
      Alert.alert('Error', 'Please enter a location');
      return;
    }
    if (!harvestDate) {
      Alert.alert('Error', 'Please enter a harvest date');
      return;
    }
    if (!token || !email) {
      Alert.alert('Error', 'You must be logged in to add a product');
      return;
    }
    console.log('Token being sent:', token); // Debug token

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('description', description.trim());
      formData.append('category', category.trim());
      formData.append('price', Number(price));
      formData.append('quantity', Number(quantity));
      formData.append('location', location.trim());
      formData.append('harvestDate', harvestDate);
      formData.append('unit', productData.unit.trim()); // Added unit to formData
      formData.append('farmer', JSON.stringify({ email: email.toLowerCase().trim(), name: email.split('@')[0] }));

      if (image) {
        if (image.base64 && Platform.OS === 'web') {
          // Send Base64 for web platform
          console.log('Sending Base64 image for web');
          formData.append('imageBase64', `data:${image.type};base64,${image.base64}`);
        } else {
          // Send file URI for mobile platforms
          const fileUri = Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.uri;
          console.log('Adjusted file URI:', fileUri); // Debug adjusted URI
          console.log('Image data being sent:', { uri: fileUri, type: image.type, name: image.name }); // Debug image data
          formData.append('image', {
            uri: fileUri,
            type: image.type,
            name: image.name,
          });
        }
      }

      // Debug FormData content using entries()
      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log('FormData entry:', key, value);
      }

      const response = await fetch('http://localhost:5000/api/farmer/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log('Server response:', data); // Debug server response
      if (!response.ok) {
        console.log('Response error:', data);
        throw new Error(data.error || 'Failed to add product');
      }

      Alert.alert('Success', 'Product added successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('FarmerDashboard') },
      ]);
      setProductData({
        name: '',
        description: '',
        category: '',
        price: '',
        quantity: '',
        location: '',
        harvestDate: '',
        unit: '', // Reset unit field
      });
      setImage(null);
    } catch (error) {
      console.error('Submission error:', error.message);
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <FarmerHeader navigation={navigation} title="Add Product" showBack />
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Add New Product</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="leaf-outline" size={Platform.select({ web: 24, default: 20 })} color="#1E3A8A" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Product Name (e.g., Wheat)"
            value={productData.name}
            onChangeText={(text) => handleChange('name', text)}
            maxLength={50}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="document-text-outline" size={Platform.select({ web: 24, default: 20 })} color="#1E3A8A" style={styles.inputIcon} />
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Description (e.g., High-quality wheat)"
            value={productData.description}
            onChangeText={(text) => handleChange('description', text)}
            multiline
            numberOfLines={4}
            maxLength={200}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="pricetag-outline" size={Platform.select({ web: 24, default: 20 })} color="#1E3A8A" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Category (e.g., Grain)"
            value={productData.category}
            onChangeText={(text) => handleChange('category', text)}
            maxLength={30}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="cash-outline" size={Platform.select({ web: 24, default: 20 })} color="#1E3A8A" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Price (e.g., 500)"
            value={productData.price}
            onChangeText={(text) => handleChange('price', text.replace(/[^0-9.]/g, ''))}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="cube-outline" size={Platform.select({ web: 24, default: 20 })} color="#1E3A8A" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Quantity (e.g., 100)"
            value={productData.quantity}
            onChangeText={(text) => handleChange('quantity', text.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="scale-outline" size={Platform.select({ web: 24, default: 20 })} color="#1E3A8A" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Unit (e.g., kg, pieces)"
            value={productData.unit}
            onChangeText={(text) => handleChange('unit', text)}
            maxLength={20}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="location-outline" size={Platform.select({ web: 24, default: 20 })} color="#1E3A8A" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Location (e.g., Punjab)"
            value={productData.location}
            onChangeText={(text) => handleChange('location', text)}
            maxLength={100}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="calendar-outline" size={Platform.select({ web: 24, default: 20 })} color="#1E3A8A" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Harvest Date (YYYY-MM-DD)"
            value={productData.harvestDate}
            onChangeText={(text) => handleChange('harvestDate', text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="image-outline" size={Platform.select({ web: 24, default: 20 })} color="#1E3A8A" style={styles.inputIcon} />
          <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
            <Text style={styles.imagePickerText}>{image ? 'Image Selected' : 'Upload Product Image'}</Text>
          </TouchableOpacity>
        </View>
        {image && (
          <Image source={{ uri: image.uri }} style={styles.imagePreview} resizeMode="cover" />
        )}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Adding...' : 'Add Product'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
