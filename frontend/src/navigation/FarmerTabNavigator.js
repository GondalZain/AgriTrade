// frontend/navigation/FarmerTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import FarmerDashboard from '../screens/FarmerDashboard';
import FarmerProfile from '../screens/Farmer/FarmerProfileScreen';
import AddProduct from '../screens/Farmer/AddProduct';
import MyProducts from '../screens/Farmer/MyProducts';
import Orders from '../screens/Farmer/FarmerOrdersScreen';
import Notifications from '../screens/Farmer/Notifications';


const Tab = createBottomTabNavigator();

export default function FarmerTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = 'home-outline';
          else if (route.name === 'Add Product') iconName = 'add-circle-outline';
          else if (route.name === 'My Products') iconName = 'list-outline';
          else if (route.name === 'Orders') iconName = 'cart-outline';
          else if (route.name === 'Notifications') iconName = 'notifications-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1E3A8A',
        tabBarInactiveTintColor: '#6B7280',
        headerShown: false, // Header is handled by FarmerHeader
      })}
    >
      <Tab.Screen name="Dashboard" component={FarmerDashboard} />
      <Tab.Screen name="Add Product" component={AddProduct} />
      <Tab.Screen name="My Products" component={MyProducts} />
      <Tab.Screen name="Orders" component={Orders} />
      <Tab.Screen name="Notifications" component={Notifications} />
      <Tab.Screen name="Profile" component={FarmerProfile} />
    </Tab.Navigator>
  );
}