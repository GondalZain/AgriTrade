
// frontend/src/navigation/BuyerTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BuyerDashboard from '../screens/BuyerDashboard';
import BuyerCartScreen from '../screens/BuyerCartScreen';
import BuyerOrdersScreen from '../screens/BuyerOrdersScreen';
import BuyerDemandsScreen from '../screens/BuyerDemandsScreen';
import BuyerProfileScreen from '../screens/BuyerProfileScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function BuyerTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = 'home';
          else if (route.name === 'Cart') iconName = 'cart';
          else if (route.name === 'Orders') iconName = 'list';
          else if (route.name === 'Demands') iconName = 'megaphone';
          else if (route.name === 'Profile') iconName = 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#28a745',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={BuyerDashboard} />
      <Tab.Screen name="Cart" component={BuyerCartScreen} />
      <Tab.Screen name="Orders" component={BuyerOrdersScreen} />
      <Tab.Screen name="Demands" component={BuyerDemandsScreen} />
      <Tab.Screen name="Profile" component={BuyerProfileScreen} />
    </Tab.Navigator>
  );
}
