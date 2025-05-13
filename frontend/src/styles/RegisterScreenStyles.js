// frontend/styles/RegisterScreenStyles.js
import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Platform.select({ web: 0, default: 20 }),
    paddingVertical: Platform.select({ web: 0, default: 30 }),
    ...Platform.select({
      web: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
    }),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    ...Platform.select({
      web: {
        maxWidth: 600, // Wider for two columns
        padding: 40,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.15)',
      },
      default: {
        width: '100%',
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
      },
    }),
  },
  title: {
    fontSize: Platform.select({ web: 32, default: 26 }),
    fontWeight: '800',
    marginBottom: Platform.select({ web: 35, default: 25 }),
    color: '#1E3A8A',
    letterSpacing: 0.8,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: Platform.select({ web: 'row', default: 'column' }),
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  inputWrapper: {
    width: Platform.select({ web: '48%', default: '100%' }), // Match input width
  },
  input: {
    width: '100%', // Full width within wrapper
    padding: Platform.select({ web: 14, default: 12 }),
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    backgroundColor: '#FAFAFC',
    fontSize: 15,
    color: '#1F2937',
    ...Platform.select({
      web: { outlineWidth: 0, transitionProperty: 'border-color, box-shadow', transitionDuration: '0.3s' },
    }),
  },
  inputPlaceholder: {
    color: '#6B7280',
    fontSize: 15,
    fontWeight: '400',
  },
  inputFocus: {
    borderColor: '#1E3A8A',
    ...Platform.select({
      web: { boxShadow: '0 0 0 3px rgba(30, 58, 138, 0.2)' },
      default: { borderColor: '#1E3A8A' },
    }),
  },
  inputError: {
    borderColor: '#EF4444', // Red border for errors
  },
  pickerContainer: {
    width: Platform.select({ web: '48%', default: '100%' }),
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    backgroundColor: '#FAFAFC',
    marginBottom: Platform.select({ web: 0, default: 15 }),
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#1F2937',
  },
  pickerError: {
    borderColor: '#EF4444', // Red border for picker errors
  },
  passwordHint: {
    fontSize: 12,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 5,
    textAlign: 'left',
  },
  button: {
    width: '100%',
    padding: Platform.select({ web: 16, default: 14 }),
    backgroundColor: '#1E3A8A',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    ...Platform.select({
      web: { cursor: 'pointer', transitionProperty: 'background-color, transform', transitionDuration: '0.3s' },
    }),
  },
  buttonHover: {
    ...Platform.select({
      web: { backgroundColor: '#1E40AF', transform: [{ scale: 1.02 }] },
    }),
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    width: '100%',
    padding: Platform.select({ web: 16, default: 14 }),
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#1E3A8A',
    borderRadius: 10,
    alignItems: 'center',
    ...Platform.select({
      web: { cursor: 'pointer', transitionProperty: 'background-color, border-color', transitionDuration: '0.3s' },
    }),
  },
  secondaryButtonHover: {
    ...Platform.select({
      web: { backgroundColor: '#F4F6FA', borderColor: '#1E40AF' },
    }),
  },
  secondaryButtonText: {
    color: '#1E3A8A',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default styles;