
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import FarmerHeader from '../components/FarmerHeader';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import styles from '../styles/FarmerDashboardStyles';

export default function FarmerDashboard({ navigation }) {
  const { email, token } = useContext(AuthContext);
  const [stats, setStats] = useState({ crops: 0, orders: 0, updates: 0 });
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [sseSource, setSseSource] = useState(null);

  // Fetch initial dashboard data
  const fetchDashboardData = async () => {
    if (!email || !token) {
      navigation.navigate('Login');
      return;
    }
    try {
      console.log('Fetching initial dashboard data for:', email);
      const response = await fetch('http://localhost:5000/api/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setStats(data.stats);
        setRecentUpdates(data.recentUpdates);
      } else {
        console.log('Initial fetch error:', data.error || 'Failed to fetch dashboard data');
      }
    } catch (error) {
      console.log('Initial fetch network error:', error.message);
    }
  };

  // Mark notifications as read and reset count
  const markNotificationsAsRead = async () => {
    if (!email || !token) return;
    try {
      console.log('Marking notifications as read for:', email);
      const response = await fetch('http://localhost:5000/api/dashboard/notifications/mark-read', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Notifications marked as read:', data.message, 'Affected:', data.affected);
        setStats((prevStats) => ({
          ...prevStats,
          updates: 0,
        }));
      } else {
        console.log('Error marking notifications as read:', data.error);
      }
    } catch (error) {
      console.log('Network error marking notifications as read:', error.message);
    }
  };

  // Handle SSE updates
  const handleSSEUpdates = (event) => {
    const data = JSON.parse(event.data);
    console.log('Received SSE update:', data);
    switch (data.type) {
      case 'initial':
        setStats(data.stats);
        break;
      case 'crop':
        setStats((prevStats) => ({
          ...prevStats,
          crops: data.count,
        }));
        break;
      case 'order':
        setStats((prevStats) => ({
          ...prevStats,
          orders: data.count,
        }));
        break;
      case 'update':
        if (data.update) {
          setRecentUpdates((prevUpdates) => [data.update, ...prevUpdates].slice(0, 3));
        }
        break;
      case 'notification':
        setStats((prevStats) => ({
          ...prevStats,
          updates: data.count,
        }));
        break;
    }
  };

  // Set up SSE connection
  const setupSSE = () => {
    if (email && token) {
      const url = `http://localhost:5000/api/dashboard/stream?email=${encodeURIComponent(email)}`;
      const source = new EventSource(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      source.onmessage = handleSSEUpdates;
      source.onerror = (error) => {
        console.log('SSE error:', error);
        source.close();
      };

      setSseSource(source);

      return () => {
        if (source) {
          source.close();
          console.log('SSE connection closed');
        }
      };
    }
  };

  // Refresh data and set up SSE when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      console.log('FarmerDashboard screen focused');
      fetchDashboardData();
      const cleanupSSE = setupSSE();
      return () => {
        console.log('FarmerDashboard screen unfocused');
        if (cleanupSSE) cleanupSSE();
      };
    }, [email, token, navigation])
  );

  return (
    <View style={styles.container}>
      <FarmerHeader navigation={navigation} title="Farm Dashboard" showBack={false} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={Platform.select({ web: true, default: false })}
      >
        <View style={styles.content}>
          {/* Welcome Section */}
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeTitle}>Welcome, Farmer!</Text>
            <Text style={styles.welcomeSubtitle}>Manage your crops and orders</Text>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsCard}>
            <TouchableOpacity
              style={styles.statItem}
              onPress={() => navigation.navigate('My Products')}
            >
              <Text style={styles.statValue}>{stats.crops}</Text>
              <Text style={styles.statLabel}>Crops</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.statItem}
              onPress={() => navigation.navigate('Orders')}
            >
              <Text style={styles.statValue}>{stats.orders}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.statItem}
              onPress={async () => {
                await markNotificationsAsRead();
                navigation.navigate('Notifications');
              }}
            >
              <Text style={stats.updates > 0 ? [styles.statValue, { color: '#D32F2F' }] : styles.statValue}>
                {stats.updates}
              </Text>
              <Text style={styles.statLabel}>Notifications</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Actions */}
          <View style={styles.actionsCard}>
            <Text style={styles.actionsTitle}>Quick Actions</Text>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Add Product')}
            >
              <View style={styles.actionContent}>
                <Ionicons name="add-outline" size={24} color="#2E7D32" />
                <Text style={styles.actionText}>Add Crop</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('My Products')}
            >
              <View style={styles.actionContent}>
                <Ionicons name="list-outline" size={24} color="#2E7D32" />
                <Text style={styles.actionText}>View Crops</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Orders')}
            >
              <View style={styles.actionContent}>
                <Ionicons name="cart-outline" size={24} color="#2E7D32" />
                <Text style={styles.actionText}>Manage Orders</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Notifications')}
            >
              <View style={styles.actionContent}>
                <Ionicons name="notifications-outline" size={24} color="#2E7D32" />
                <Text style={styles.actionText}>View Notifications</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Recent Updates */}
          <View style={styles.updatesCard}>
            <Text style={styles.updatesTitle}>Recent Updates</Text>
            {recentUpdates.length === 0 ? (
              <Text style={styles.emptyUpdatesText}>No recent updates.</Text>
            ) : (
              recentUpdates.map((update, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.updateItem}
                  onPress={() => navigation.navigate('Notifications')}
                >
                  <Ionicons
                    name="alert-circle-outline"
                    size={20}
                    color="#2E7D32"
                    style={styles.updateIcon}
                  />
                  <View style={styles.updateTextContainer}>
                    <Text style={styles.updateText}>{update.message}</Text>
                    <Text style={styles.updateTimestamp}>
                      {new Date(update.timestamp).toLocaleString()}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
