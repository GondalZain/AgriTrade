// frontend/config.js
import Constants from 'expo-constants';

const config = {
  API_URL: Constants.expoConfig?.extra?.apiUrl || 'http://localhost:5000',
};

export default config;