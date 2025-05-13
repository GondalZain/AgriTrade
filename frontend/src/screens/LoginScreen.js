
// frontend/src/screens/Login.js
import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Alert, Text } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function Login({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // Validate inputs
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    console.log('Login attempt:', { email, password });

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log('Login response:', { status: response.status, data });

      if (response.ok) {
        const { token, email: userEmail, role } = data;
        console.log('Received data:', { token, userEmail, role });

        try {
          await login(token, userEmail);
          console.log('AuthContext login called with:', { token, userEmail });
        } catch (authError) {
          console.error('AuthContext login error:', authError);
          Alert.alert('Error', 'Failed to store credentials');
          return;
        }

        // Navigate based on role
        const roles = {
          admin: 'AdminDashboard',
          rider: 'RiderDashboard',
          buyer: 'BuyerDashboard',
          farmer: 'FarmerDashboard',
        };
        const dashboard = roles[role] || 'Login';
        if (!roles[role]) {
          console.warn('Invalid role:', role);
          Alert.alert('Error', `Invalid user role: ${role}`);
          return;
        }

        // Verify navigation route exists
        try {
          const routeNames = navigation.getState().routeNames;
          console.log('Navigation stack:', routeNames);
          if (!routeNames.includes(dashboard)) {
            console.error('Navigation error: Route not found:', dashboard);
            Alert.alert('Error', `Navigation route not found: ${dashboard}`);
            return;
          }

          console.log('Navigating to:', dashboard);
          navigation.reset({
            index: 0,
            routes: [{ name: dashboard }],
          });
        } catch (navError) {
          console.error('Navigation error:', navError);
          Alert.alert('Error', 'Navigation failed: ' + navError.message);
        }
      } else {
        console.warn('Login failed:', data.error);
        Alert.alert('Error', data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Network error:', error.message);
      Alert.alert('Error', 'Network error: ' + error.message);
    }
  };

  const handleRegister = () => {
    console.log('Navigating to Register');
    navigation.navigate('Register');
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <Button title="Login" onPress={handleLogin} />
      <View style={{ marginTop: 10 }}>
        <Button title="Register" onPress={handleRegister} />
      </View>
    </View>
  );
}
