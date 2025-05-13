
// frontend/src/screens/FarmerOrdersScreen.js
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import styles from '../../styles/OrdersStyles';
import FarmerHeader from '../../components/FarmerHeader';

export default function FarmerOrdersScreen() {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/farmer/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setOrders(data.orders || []);
      } else {
        Alert.alert('Error', data.error || 'Failed to fetch orders');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/farmer/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (response.ok) {
        setOrders(orders.map(o => o._id === orderId ? data.order : o));
      } else {
        Alert.alert('Error', data.error || 'Failed to update order status');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error: ' + error.message);
    }
  };

  const renderOrder = ({ item }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderDetail}>Order ID: {item._id}</Text>
      <Text style={styles.orderDetail}>Buyer: {item.buyer}</Text>
      <Text style={styles.orderDetail}>Total: ${item.total.toFixed(2)}</Text>
      <Text style={styles.orderDetail}>Status: {item.status}</Text>
      <Text style={styles.orderDetail}>
        Items: {item.items.map((i) => `${i.product.name} (x${i.quantity})`).join(', ')}
      </Text>
      {item.status === 'pending' && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => updateOrderStatus(item._id, 'confirmed')}
          >
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#dc3545' }]}
            onPress={() => updateOrderStatus(item._id, 'rejected')}
          >
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
      {item.status === 'confirmed' && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => updateOrderStatus(item._id, 'shipped')}
        >
          <Text style={styles.buttonText}>Mark Shipped</Text>
        </TouchableOpacity>
      )}
      {item.status === 'shipped' && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => updateOrderStatus(item._id, 'delivered')}
        >
          <Text style={styles.buttonText}>Mark Delivered</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FarmerHeader />
      <Text style={styles.title}>Orders</Text>
      {loading ? (
        <Text>Loading orders...</Text>
      ) : orders.length === 0 ? (
        <Text>No orders found</Text>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item._id}
          style={styles.productList}
        />
      )}
    </View>
  );
}
