
// frontend/src/components/BuyerHeader.js
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import styles from '../styles/BuyerStyles';

export default function BuyerHeader() {
  const { email, logout } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      alert('Failed to logout');
    }
  };

  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Farmer App</Text>
      <View style={styles.headerRight}>
        <Text style={styles.headerEmail}>{email}</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('BuyerProfile')}
        >
          <Text style={styles.headerButtonText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton} onPress={handleLogout}>
          <Text style={styles.headerButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
