
import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: Platform.select({ web: 30, default: 15 }),
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: Platform.select({ web: 28, default: 22 }),
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 15,
    elevation: 2, // Shadow for mobile
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    ...(Platform.OS === 'web' && {
      transition: 'border-color 0.2s ease',
      ':hover': {
        borderColor: '#1E3A8A',
      },
    }),
  },
  inputIcon: {
    padding: 10,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: Platform.select({ web: 16, default: 14 }),
    color: '#374151',
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  imagePickerButton: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  imagePickerText: {
    fontSize: Platform.select({ web: 14, default: 12 }),
    color: '#1E3A8A',
    fontWeight: '500',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  button: {
    backgroundColor: '#1E3A8A',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    ...(Platform.OS === 'web' && {
      transition: 'background-color 0.2s ease',
      ':hover': {
        backgroundColor: '#163172',
      },
    }),
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
    ...(Platform.OS === 'web' && {
      ':hover': {
        backgroundColor: '#9CA3AF',
      },
    }),
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: Platform.select({ web: 16, default: 14 }),
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
