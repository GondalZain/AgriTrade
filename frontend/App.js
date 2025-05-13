
// frontend/App.js
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

// This is the main entry point of the React Native application.
// It wraps the AppNavigator with the AuthProvider to manage authentication state.
// The AppNavigator handles the navigation between different screens in the app.
// The AuthProvider provides context for authentication, allowing components to access user state and authentication functions.
// The App component is exported as the default export, making it the main component that gets rendered when the app starts.
// The App component is the main entry point of the application.  