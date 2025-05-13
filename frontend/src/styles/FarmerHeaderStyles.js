
// frontend/src/styles/FarmerHeaderStyles.js
import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  header: {
    backgroundColor: '#F8FAFC',
    paddingTop: Platform.OS === 'web' ? 20 : 40,
    paddingBottom: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: Platform.select({ web: 24, default: 20 }),
    fontWeight: '600',
    color: '#1E3A8A',
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileButton: {
    padding: 5,
    marginLeft: 10,
  },
  logoutButton: {
    padding: 5,
    marginLeft: 10,
  },
});
