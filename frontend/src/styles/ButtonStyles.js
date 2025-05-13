// components/ButtonStyles.js
import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  button: {
    width: '100%',
    maxWidth: Platform.select({
      web: 380, // Slightly narrower on web
      default: 340, // Compact for mobile
    }),
    paddingVertical: Platform.select({
      web: 14,
      default: 12,
    }),
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transitionProperty: 'background-color, transform',
        transitionDuration: '0.3s',
      },
    }),
  },
  primaryButton: {
    backgroundColor: '#D97706', // Warm amber for primary action
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonHover: {
    ...Platform.select({
      web: {
        backgroundColor: '#B45309', // Darker amber on hover
        transform: [{ scale: 1.03 }],
      },
    }),
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#D97706',
  },
  secondaryButtonHover: {
    ...Platform.select({
      web: {
        backgroundColor: '#FEF3C7', // Light amber background on hover
        borderColor: '#B45309',
      },
    }),
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#D97706',
  },
});

export default styles;