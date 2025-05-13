
// frontend/src/screens/Farmer/Notifications.js
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import FarmerHeader from '../../components/FarmerHeader';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import styles from '../../styles/NotificationsStyles';

export default function Notifications({ navigation }) {
  const { email, token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!email || !token) {
      Alert.alert('Error', 'Please log in to view notifications');
      navigation.navigate('Login');
      return;
    }
    try {
      console.log('Fetching notifications for:', email);
      const response = await fetch('http://localhost:5000/api/notifications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setNotifications(data);
      } else {
        Alert.alert('Error', data.error || 'Failed to fetch notifications');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error: ' + error.message);
    }
  };

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
      } else {
        Alert.alert('Error', data.error || 'Failed to mark notification as read');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error: ' + error.message);
    }
  };

  // Poll for notifications every 30 seconds
  useEffect(() => {
    console.log('Notifications page rendered');
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval); // Cleanup on unmount
  }, [email, token, navigation]);

  return (
    <View style={styles.container}>
      <FarmerHeader navigation={navigation} title="Notifications" showBack={false} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={Platform.select({ web: true, default: false })}
      >
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          {notifications.length === 0 ? (
            <Text style={styles.emptyText}>No notifications yet.</Text>
          ) : (
            notifications.map((notification) => (
              <View
                key={notification._id}
                style={[styles.card, notification.isRead ? styles.readCard : styles.unreadCard]}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{notification.message}</Text>
                </View>
                <Text style={styles.cardDetail}>
                  Time: {new Date(notification.timestamp).toLocaleString()}
                </Text>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {
                    markAsRead(notification._id);
                    if (notification.type === 'order' || notification.type === 'bid') {
                      navigation.navigate('Orders');
                    } else {
                      Alert.alert('System Notification', 'View profile settings');
                    }
                  }}
                >
                  <Ionicons
                    name={
                      notification.type === 'order'
                        ? 'cart-outline'
                        : notification.type === 'bid'
                        ? 'pricetag-outline'
                        : 'alert-circle-outline'
                    }
                    size={20}
                    color="#2E7D32"
                  />
                  <Text style={styles.actionText}>
                    {notification.type === 'order'
                      ? 'View Order'
                      : notification.type === 'bid'
                      ? 'View Bid'
                      : 'View Details'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
