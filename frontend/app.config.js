// frontend/app.config.js
module.exports = {
    expo: {
      name: 'Test3',
      slug: 'test3',
      version: '1.0.0',
      orientation: 'portrait',
      icon: './assets/icon.png',
      userInterfaceStyle: 'light',
      splash: {
        image: './assets/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
      },
      assetBundlePatterns: ['**/*'],
      ios: {
        supportsTablet: true,
      },
      android: {
        adaptiveIcon: {
          foregroundImage: './assets/adaptive-icon.png',
          backgroundColor: '#ffffff',
        },
      },
      web: {
        favicon: './assets/favicon.png',
      },
      extra: {
        apiUrl: 'http://localhost:5000', // Hardcode for now
      },
    },
  };