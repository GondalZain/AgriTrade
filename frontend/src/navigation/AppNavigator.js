
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import FarmerTabNavigator from './FarmerTabNavigator'; // Import the tab navigator
import RiderDashboard from '../screens/RiderDashboard';
import BuyerDashboard from '../screens/BuyerDashboard';
import AdminDashboard from '../screens/AdminDashboard';
import ViewDetails from '../screens/Farmer/ViewDetails';
import EditProduct from '../screens/Farmer/EditProduct';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="FarmerDashboard" component={FarmerTabNavigator} />
        <Stack.Screen name="RiderDashboard" component={RiderDashboard} />
        <Stack.Screen name="BuyerDashboard" component={BuyerDashboard} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="ViewDetails" component={ViewDetails} />
        <Stack.Screen name="EditProduct" component={EditProduct} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
