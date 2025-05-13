
// frontend/src/screens/Farmer/FarmerProfile.js
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import FarmerHeader from '../../components/FarmerHeader';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import styles from '../../styles/FarmerProfileStyles';

export default function FarmerProfile({ navigation }) {
  const { email, token } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    zipCode: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch profile data on mount
  useEffect(() => {
    console.log('FarmerProfile page rendered');
    if (!email || !token) {
      Alert.alert('Error', 'Please log in to view your profile');
      navigation.navigate('Login');
      return;
    }

    const fetchProfile = async () => {
      try {
        console.log('Fetching profile for:', email);
        const response = await fetch(`http://localhost:5000/api/profile/${encodeURIComponent(email)}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setProfile({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: email,
            phoneNumber: data.phoneNumber || '',
            address: data.address || '',
            city: data.city || '',
            zipCode: data.zipCode || '',
          });
        } else {
          Alert.alert('Error', data.error || 'Failed to fetch profile');
        }
      } catch (error) {
        Alert.alert('Error', 'Network error: ' + error.message);
      }
    };
    fetchProfile();
  }, [email, token, navigation]);

  // Handle profile update
  const handleUpdate = async () => {
    try {
      console.log('Updating profile:', profile);
      const response = await fetch(`http://localhost:5000/api/profile/${encodeURIComponent(email)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          phoneNumber: profile.phoneNumber,
          address: profile.address,
          city: profile.city,
          zipCode: profile.zipCode,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Profile updated successfully');
        setIsEditing(false);
      } else {
        Alert.alert('Error', data.error || 'Failed to update profile');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <FarmerHeader navigation={navigation} title="Profile" showBack={false} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={Platform.select({ web: true, default: false })}
      >
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Farmer Profile</Text>
          <View style={styles.card}>
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{profile.email || 'Not set'}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>First Name</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={profile.firstName}
                  onChangeText={(text) => setProfile({ ...profile, firstName: text })}
                  placeholder="Enter first name"
                />
              ) : (
                <Text style={styles.value}>{profile.firstName || 'Not set'}</Text>
              )}
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Last Name</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={profile.lastName}
                  onChangeText={(text) => setProfile({ ...profile, lastName: text })}
                  placeholder="Enter last name"
                />
              ) : (
                <Text style={styles.value}>{profile.lastName || 'Not set'}</Text>
              )}
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Phone Number</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={profile.phoneNumber}
                  onChangeText={(text) => setProfile({ ...profile, phoneNumber: text })}
                  placeholder="Enter phone number (+923001234567)"
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.value}>{profile.phoneNumber || 'Not set'}</Text>
              )}
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Address</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={profile.address}
                  onChangeText={(text) => setProfile({ ...profile, address: text })}
                  placeholder="Enter address"
                  multiline
                />
              ) : (
                <Text style={styles.value}>{profile.address || 'Not set'}</Text>
              )}
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>City</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={profile.city}
                  onChangeText={(text) => setProfile({ ...profile, city: text })}
                  placeholder="Enter city"
                />
              ) : (
                <Text style={styles.value}>{profile.city || 'Not set'}</Text>
              )}
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Zip Code</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={profile.zipCode}
                  onChangeText={(text) => setProfile({ ...profile, zipCode: text })}
                  placeholder="Enter 5-digit zip code"
                  keyboardType="numeric"
                />
              ) : (
                <Text style={styles.value}>{profile.zipCode || 'Not set'}</Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => (isEditing ? handleUpdate() : setIsEditing(true))}
            >
              <Ionicons
                name={isEditing ? 'checkmark-outline' : 'pencil-outline'}
                size={20}
                color="#2E7D32"
              />
              <Text style={styles.actionText}>{isEditing ? 'Save Changes' : 'Edit Profile'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
