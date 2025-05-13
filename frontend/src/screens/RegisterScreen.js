// frontend/screens/RegisterScreen.js
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Platform, ImageBackground, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import InputField from '../components/InputField';
import Button from '../components/Button';
import styles from '../styles/RegisterScreenStyles';
import axios from 'axios';
import config from '../../config';

export default function RegisterScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [errors, setErrors] = useState({});
  const [isRegisterHovered, setRegisterHovered] = useState(false);
  const [isSecondaryHovered, setSecondaryHovered] = useState(false);
  const [isInputFocused, setInputFocused] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phoneNumber: false,
    password: false,
    confirmPassword: false,
    address: false,
    city: false,
    zipCode: false,
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, delay: 200, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const validateField = (field, value) => {
    let newErrors = { ...errors };
    switch (field) {
      case 'firstName':
        if (!value || value.length < 2) newErrors.firstName = 'First name must be at least 2 characters';
        else delete newErrors.firstName;
        break;
      case 'lastName':
        if (!value || value.length < 2) newErrors.lastName = 'Last name must be at least 2 characters';
        else delete newErrors.lastName;
        break;
      case 'email':
        if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) newErrors.email = 'Enter a valid email';
        else delete newErrors.email;
        break;
      case 'phoneNumber':
        if (!value || !/^\+92\d{10}$/.test(value)) newErrors.phoneNumber = 'Phone must be +92 followed by 10 digits (e.g., +9230012345678)';
        else delete newErrors.phoneNumber;
        break;
      case 'password':
        if (!value || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(value)) {
          newErrors.password = 'Password must have 1 uppercase, 1 lowercase, 1 number';
        } else delete newErrors.password;
        break;
      case 'confirmPassword':
        if (value !== password) newErrors.confirmPassword = 'Passwords do not match';
        else delete newErrors.confirmPassword;
        break;
      case 'role':
        if (!value) newErrors.role = 'Please select a role';
        else delete newErrors.role;
        break;
      case 'address':
        if (!value || value.length < 5) newErrors.address = 'Address must be at least 5 characters';
        else delete newErrors.address;
        break;
      case 'city':
        if (!value || value.length < 2) newErrors.city = 'City must be at least 2 characters';
        else delete newErrors.city;
        break;
      case 'zipCode':
        if (!value || !/^\d{5}$/.test(value)) newErrors.zipCode = 'Zip code must be exactly 5 digits';
        else delete newErrors.zipCode;
        break;
    }
    setErrors(newErrors);
  };

  const handleRegister = async () => {
    // Validate all fields before submission
    Object.keys({ firstName, lastName, email, phoneNumber, password, confirmPassword, role, address, city, zipCode })
      .forEach((field) => validateField(field, eval(field)));

    if (Object.keys(errors).length > 0) {
      if (Platform.OS === 'web') {
        window.alert('Error: Please fix the errors in the form');
      } else {
        Alert.alert('Error', 'Please fix the errors in the form');
      }
      return;
    }

    const requestData = { firstName, lastName, email, phoneNumber, password, role, address, city, zipCode };
    console.log('API URL:', config.API_URL);
    console.log('Register Request Data:', requestData);

    try {
      const response = await axios.post(`${config.API_URL}/api/auth/register`, requestData);
      console.log('Register Response:', response.data);
      console.log('Success case triggered');
      if (Platform.OS === 'web') {
        window.alert('Success: Registration successful');
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhoneNumber('');
        setPassword('');
        setConfirmPassword('');
        setRole('');
        setAddress('');
        setCity('');
        setZipCode('');
        setErrors({});
        navigation.navigate('Login');
      } else {
        Alert.alert('Success', 'Registration successful', [
          {
            text: 'OK',
            onPress: () => {
              console.log('Navigating to Login');
              setFirstName('');
              setLastName('');
              setEmail('');
              setPhoneNumber('');
              setPassword('');
              setConfirmPassword('');
              setRole('');
              setAddress('');
              setCity('');
              setZipCode('');
              setErrors({});
              navigation.navigate('Login');
            },
          },
        ]);
      }
    } catch (error) {
      console.log('Error Response:', error.response);
      const errorMessage = error.response?.data?.message || 'Something went wrong';
      console.log('Error Message:', errorMessage);
      if (error.response?.status === 400 && errorMessage === 'User already exists') {
        console.log('User already exists case triggered');
        if (Platform.OS === 'web') {
          window.alert('Error: User already exists');
        } else {
          Alert.alert('Error', 'User already exists');
        }
      } else {
        if (Platform.OS === 'web') {
          window.alert(`Error: ${errorMessage}`);
        } else {
          Alert.alert('Error', errorMessage);
        }
      }
    }
  };

  const handleFocus = (field) => setInputFocused((prev) => ({ ...prev, [field]: true }));
  const handleBlur = (field) => setInputFocused((prev) => ({ ...prev, [field]: false }));

  return (
    <ImageBackground
    
      source={{ uri: 'https://plus.unsplash.com/premium_photo-1682092126179-2f8a4c0621be?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
      style={styles.container}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.title}>Register</Text>

          <View style={styles.row}>
            <View style={styles.inputWrapper}>
              <InputField
                style={[styles.input, isInputFocused.firstName && styles.inputFocus, errors.firstName && styles.inputError]}
                placeholder="First Name"
                placeholderTextColor={styles.inputPlaceholder?.color}
                value={firstName}
                onChangeText={(text) => { setFirstName(text); validateField('firstName', text); }}
                autoCapitalize="words"
                onFocus={() => handleFocus('firstName')}
                onBlur={() => handleBlur('firstName')}
              />
              {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
            </View>
            <View style={styles.inputWrapper}>
              <InputField
                style={[styles.input, isInputFocused.lastName && styles.inputFocus, errors.lastName && styles.inputError]}
                placeholder="Last Name"
                placeholderTextColor={styles.inputPlaceholder?.color}
                value={lastName}
                onChangeText={(text) => { setLastName(text); validateField('lastName', text); }}
                autoCapitalize="words"
                onFocus={() => handleFocus('lastName')}
                onBlur={() => handleBlur('lastName')}
              />
              {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.inputWrapper}>
              <InputField
                style={[styles.input, isInputFocused.email && styles.inputFocus, errors.email && styles.inputError]}
                placeholder="Email"
                placeholderTextColor={styles.inputPlaceholder?.color}
                value={email}
                onChangeText={(text) => { setEmail(text); validateField('email', text); }}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => handleFocus('email')}
                onBlur={() => handleBlur('email')}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>
            <View style={styles.inputWrapper}>
              <InputField
                style={[styles.input, isInputFocused.phoneNumber && styles.inputFocus, errors.phoneNumber && styles.inputError]}
                placeholder="Phone (+9230012345678)"
                placeholderTextColor={styles.inputPlaceholder?.color}
                value={phoneNumber}
                onChangeText={(text) => { setPhoneNumber(text); validateField('phoneNumber', text); }}
                keyboardType="phone-pad"
                maxLength={13}
                onFocus={() => handleFocus('phoneNumber')}
                onBlur={() => handleBlur('phoneNumber')}
              />
              {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.inputWrapper}>
              <InputField
                style={[styles.input, isInputFocused.password && styles.inputFocus, errors.password && styles.inputError]}
                placeholder="Password"
                placeholderTextColor={styles.inputPlaceholder?.color}
                value={password}
                onChangeText={(text) => { setPassword(text); validateField('password', text); validateField('confirmPassword', confirmPassword); }}
                secureTextEntry
                autoCapitalize="none"
                onFocus={() => handleFocus('password')}
                onBlur={() => handleBlur('password')}
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>
            <View style={styles.inputWrapper}>
              <InputField
                style={[styles.input, isInputFocused.confirmPassword && styles.inputFocus, errors.confirmPassword && styles.inputError]}
                placeholder="Confirm Password"
                placeholderTextColor={styles.inputPlaceholder?.color}
                value={confirmPassword}
                onChangeText={(text) => { setConfirmPassword(text); validateField('confirmPassword', text); }}
                secureTextEntry
                autoCapitalize="none"
                onFocus={() => handleFocus('confirmPassword')}
                onBlur={() => handleBlur('confirmPassword')}
              />
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>
          </View>
          <Text style={styles.passwordHint}>
            Password: 1 uppercase, 1 lowercase, 1 number
          </Text>

          <View style={styles.row}>
            <View style={styles.inputWrapper}>
              <View style={[styles.pickerContainer, errors.role && styles.pickerError]}>
                <Picker
                  selectedValue={role}
                  onValueChange={(itemValue) => { setRole(itemValue); validateField('role', itemValue); }}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Role" value="" />
                  <Picker.Item label="Farmer" value="farmer" />
                  <Picker.Item label="Rider" value="rider" />
                  <Picker.Item label="Buyer" value="buyer" />
                  <Picker.Item label="Admin" value="admin" />
                </Picker>
              </View>
              {errors.role && <Text style={styles.errorText}>{errors.role}</Text>}
            </View>
            <View style={styles.inputWrapper}>
              <InputField
                style={[styles.input, isInputFocused.address && styles.inputFocus, errors.address && styles.inputError]}
                placeholder="Address"
                placeholderTextColor={styles.inputPlaceholder?.color}
                value={address}
                onChangeText={(text) => { setAddress(text); validateField('address', text); }}
                autoCapitalize="sentences"
                onFocus={() => handleFocus('address')}
                onBlur={() => handleBlur('address')}
              />
              {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.inputWrapper}>
              <InputField
                style={[styles.input, isInputFocused.city && styles.inputFocus, errors.city && styles.inputError]}
                placeholder="City"
                placeholderTextColor={styles.inputPlaceholder?.color}
                value={city}
                onChangeText={(text) => { setCity(text); validateField('city', text); }}
                autoCapitalize="words"
                onFocus={() => handleFocus('city')}
                onBlur={() => handleBlur('city')}
              />
              {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
            </View>
            <View style={styles.inputWrapper}>
              <InputField
                style={[styles.input, isInputFocused.zipCode && styles.inputFocus, errors.zipCode && styles.inputError]}
                placeholder="Zip Code"
                placeholderTextColor={styles.inputPlaceholder?.color}
                value={zipCode}
                onChangeText={(text) => { setZipCode(text); validateField('zipCode', text); }}
                keyboardType="numeric"
                maxLength={5}
                onFocus={() => handleFocus('zipCode')}
                onBlur={() => handleBlur('zipCode')}
              />
              {errors.zipCode && <Text style={styles.errorText}>{errors.zipCode}</Text>}
            </View>
          </View>

          <Button
            style={[styles.button, isRegisterHovered && styles.buttonHover]}
            title="Register"
            onPress={handleRegister}
            textStyle={styles.buttonText}
            type="primary"
            {...(Platform.OS === 'web' && {
              onMouseEnter: () => setRegisterHovered(true),
              onMouseLeave: () => setRegisterHovered(false),
            })}
          />
          <Button
            style={[styles.secondaryButton, isSecondaryHovered && styles.secondaryButtonHover]}
            title="Back to Login"
            onPress={() => navigation.navigate('Login')}
            textStyle={styles.secondaryButtonText}
            type="secondary"
            {...(Platform.OS === 'web' && {
              onMouseEnter: () => setSecondaryHovered(true),
              onMouseLeave: () => setSecondaryHovered(false),
            })}
          />
        </Animated.View>
      </ScrollView>
    </ImageBackground>
  );
}