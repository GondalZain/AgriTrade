// components/InputFieldStyles.js
import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  input: {
    width: '100%', // Full width for consistency with LoginScreenStyles.js
    maxWidth: Platform.select({
      web: 380, // Slightly narrower on web
      default: 340, // Slightly narrower on mobile
    }),
    padding: Platform.select({
      web: 14, // Larger padding on web
      default: 12, // Compact padding on mobile
    }),
    marginVertical: 12, // Consistent spacing
    borderWidth: 1,
    borderColor: '#CBD5E1', // Light gray border (matches LoginScreenStyles.js)
    borderRadius: 10, // Rounded corners (matches LoginScreenStyles.js)
    backgroundColor: '#FAFAFC', // Light background (matches LoginScreenStyles.js)
    fontSize: 15, // Consistent font size
    color: '#1F2937', // Dark text color (matches LoginScreenStyles.js)
    fontWeight: '400',
    ...Platform.select({
      web: {
        outlineWidth: 0, // Remove default outline on web
        transitionProperty: 'border-color, box-shadow', // Smooth transitions
        transitionDuration: '0.3s',
      },
    }),
  },
  inputFocus: {
    borderColor: '#1E3A8A', // Navy blue to match LoginScreenStyles.js
    ...Platform.select({
      web: {
        boxShadow: '0 0 0 3px rgba(30, 58, 138, 0.2)', // Navy blue focus ring
      },
      default: {
        borderColor: '#1E3A8A',
      },
    }),
  },
  placeholder: {
    color: '#6B7280', // Muted gray for placeholders (matches LoginScreenStyles.js)
    fontSize: 15,
    fontWeight: '400',
  },
});

export default styles;