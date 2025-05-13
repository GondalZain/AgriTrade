
// frontend/src/screens/BuyerDashboard.js
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import styles from '../styles/BuyerStyles';

export default function BuyerDashboard({ navigation }) {
  const { token, email, logout } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setProducts(data.products || []);
      } else {
        Alert.alert('Error', data.error || 'Failed to fetch products');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    try {
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Product added to cart');
      } else {
        Alert.alert('Error', data.error || 'Failed to add to cart');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error: ' + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productDetail}>Price: ${item.price.toFixed(2)}</Text>
      <Text style={styles.productDetail}>Quantity: {item.quantity}</Text>
      <Text style={styles.productDetail}>Farmer: {item.farmer.name}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => addToCart(item._id)}
      >
        <Text style={styles.buttonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buyer Dashboard</Text>
      <Text style={styles.subtitle}>Welcome, {email}!</Text>
      {loading ? (
        <Text>Loading products...</Text>
      ) : products.length === 0 ? (
        <Text>No products available</Text>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item._id}
          style={styles.productList}
        />
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('BuyerCart')}
        >
          <Text style={styles.buttonText}>View Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('BuyerOrders')}
        >
          <Text style={styles.buttonText}>Order History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
