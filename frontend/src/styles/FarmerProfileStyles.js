
// frontend/src/styles/FarmerProfileStyles.js
import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Soft white
  },
  scrollContent: {
    paddingBottom: Platform.select({ web: 40, default: 20 }), // Scroll space
    flexGrow: 1,
  },
  content: {
    padding: Platform.select({ web: 32, default: 16 }), // Balanced padding
    alignItems: Platform.select({ web: 'center', default: 'stretch' }),
  },
  sectionTitle: {
    fontSize: Platform.select({ web: 22, default: 20 }),
    fontWeight: 'bold',
    color: '#1E3A8A', // Navy blue
    marginBottom: 12,
    marginTop: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: Platform.select({ web: 20, default: 16 }),
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Platform.select({ web: 0.15, default: 0.1 }),
    shadowRadius: 4,
    elevation: 2,
    width: Platform.select({ web: '60%', default: '100%' }), // Narrower on web
    alignSelf: 'center',
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: Platform.select({ web: 16, default: 14 }),
    fontWeight: '600',
    color: '#1E3A8A',
    marginBottom: 4,
  },
  value: {
    fontSize: Platform.select({ web: 16, default: 14 }),
    color: '#555',
  },
  input: {
    backgroundColor: '#F1F5F9', // Light gray
    borderRadius: 6,
    padding: Platform.select({ web: 12, default: 10 }),
    fontSize: Platform.select({ web: 16, default: 14 }),
    color: '#1E3A8A',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9', // Light gray
    borderRadius: 6,
    padding: Platform.select({ web: 12, default: 10 }),
    marginTop: 8,
  },
  actionText: {
    fontSize: Platform.select({ web: 16, default: 14 }),
    fontWeight: '600',
    color: '#1E3A8A',
    marginLeft: 8,
  },
});
