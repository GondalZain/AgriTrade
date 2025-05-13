
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AuthContext } from '../context/AuthContext';
import styles from '../styles/FarmerHeaderStyles';

export default function FarmerHeader({ navigation, title, showBack = false }) {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout(); // Clear auth context (token, email, etc.)
    navigation.navigate('Login');
  };

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
      <View style={styles.headerContent}>
        {showBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="arrow-back"
              size={Platform.select({ web: 28, default: 24 })}
              color="#1E3A8A"
            />
          </TouchableOpacity>
        )}
        <Text style={[styles.title, { marginLeft: showBack ? 10 : 0 }]}>
          {title}
        </Text>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons
            name="person-circle-outline"
            size={Platform.select({ web: 32, default: 28 })}
            color="#1E3A8A"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons
            name="log-out-outline"
            size={Platform.select({ web: 32, default: 28 })}
            color="#D32F2F"
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
