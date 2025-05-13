
import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  Platform,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import FarmerHeader from '../../components/FarmerHeader';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { AuthContext } from '../../context/AuthContext';
import styles from '../../styles/MyProductsStyles';


const { width } = Dimensions.get('window');

export default function MyProducts({ navigation }) {
  const { token, email } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const numColumns = Platform.OS === 'web' ? 4 : 1; // 4 columns on web, 1 column on mobile
  const cardMargin = 10;

  const fetchProducts = useCallback(async () => {
    if (!token || !email) {
      setError('Please log in to view products');
      setLoading(false);
      setRefreshing(false);
      Alert.alert('Error', 'Authentication required');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/farmer/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch products');
      }

      setProducts(data.products || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      Alert.alert('Error', err.message || 'Failed to load products');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, email]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProducts();
  }, [fetchProducts]);

  const retryFetch = () => {
    setLoading(true);
    fetchProducts();
  };

  const handleViewDetails = (product) => {
    navigation.navigate('ViewDetails', { product }); // Navigate to ViewDetails screen
  };

  const handleEditProduct = (product) => {
    navigation.navigate('EditProduct', { product }); // Navigate to EditProduct screen
  };

  const getItemLayout = (data, index) => ({
    length: width / numColumns - (cardMargin * 2),
    offset: (width / numColumns - (cardMargin * 2)) * index,
    index,
  });

  const renderProductItem = ({ item, index }) => (
    <Animated.View
      key={item._id}
      style={[
        styles.productCard,
        { width: width / numColumns - (cardMargin * 2) },
      ]}
      entering={FadeInUp.delay(index * 200).duration(400)}
    >
      <View style={styles.imageContainer}>
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.productImage}
            resizeMode="cover"
            onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
          />
        ) : (
          <View style={styles.noImage}>
            <Ionicons name="image-outline" size={40} color="#D3D3D3" />
            <Text style={styles.noImageText}>No Image</Text>
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.productPrice}>₹{item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleViewDetails(item)}
        >
          <Text style={styles.actionButtonText}>View Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEditProduct(item)}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <FarmerHeader navigation={navigation} title="My Products" showBack />
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#0073AA" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FarmerHeader navigation={navigation} title="My Products" showBack />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Products</Text>
          {Platform.OS === 'web' && (
            <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
              <Ionicons name="refresh" size={20} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>
        {error ? (
          <View style={styles.error}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={retryFetch}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : products.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="cart-outline" size={50} color="#666" />
            <Text style={styles.emptyText}>No products available.</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AddProduct')}
            >
              <Text style={styles.addButtonText}>Add Product</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={products}
            renderItem={renderProductItem}
            keyExtractor={(item) => item._id}
            numColumns={numColumns}
            contentContainerStyle={styles.list}
            refreshControl={
              Platform.OS !== 'web' ? (
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0073AA" />
              ) : undefined
            }
            columnWrapperStyle={styles.columnWrapper}
            initialNumToRender={15}
            maxToRenderPerBatch={10}
            windowSize={5}
            getItemLayout={getItemLayout}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}
