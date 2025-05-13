
// frontend/src/styles/NotificationsStyles.js
import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Soft white
  },
  scrollContent: {
    paddingBottom: Platform.select({ web: 40, default: 20 }),
    flexGrow: 1,
  },
  content: {
    padding: Platform.select({ web: 32, default: 16 }),
    alignItems: Platform.select({ web: 'center', default: 'stretch' }),
  },
  sectionTitle: {
    fontSize: Platform.select({ web: 22, default: 20 }),
    fontWeight: 'bold',
    color: '#1E3A8A', // Navy blue
    marginBottom: 12,
    marginTop: 16,
  },
  emptyText: {
    fontSize: Platform.select({ web: 18, default: 16 }),
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
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
    width: Platform.select({ web: '60%', default: '100%' }),
    alignSelf: 'center',
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32', // Green for unread
  },
  readCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#E5E7EB', // Gray for read
  },
  cardHeader: {
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: Platform.select({ web: 16, default: 14 }),
    fontWeight: '600',
    color: '#1E3A8A',
  },
  cardDetail: {
    fontSize: Platform.select({ web: 14, default: 12 }),
    color: '#555',
    marginBottom: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9', // Light gray
    borderRadius: 6,
    padding: Platform.select({ web: 12, default: 10 }),
  },
  actionText: {
    fontSize: Platform.select({ web: 16, default: 14 }),
    fontWeight: '600',
    color: '#1E3A8A',
    marginLeft: 8,
  },
});
