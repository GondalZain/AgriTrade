
// frontend/src/styles/FarmerDashboardStyles.js
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
  welcomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: Platform.select({ web: 24, default: 16 }),
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Platform.select({ web: 0.15, default: 0.1 }),
    shadowRadius: 4,
    elevation: 2,
    width: Platform.select({ web: '60%', default: '100%' }),
    alignSelf: 'center',
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: Platform.select({ web: 24, default: 20 }),
    fontWeight: 'bold',
    color: '#1E3A8A', // Navy blue
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: Platform.select({ web: 16, default: 14 }),
    color: '#555',
    textAlign: 'center',
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: Platform.select({ web: 20, default: 16 }),
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Platform.select({ web: 0.15, default: 0.1 }),
    shadowRadius: 4,
    elevation: 2,
    width: Platform.select({ web: '60%', default: '100%' }),
    alignSelf: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: Platform.select({ web: 12, default: 8 }),
  },
  statValue: {
    fontSize: Platform.select({ web: 28, default: 24 }),
    fontWeight: 'bold',
    color: '#2E7D32', // Green
  },
  statLabel: {
    fontSize: Platform.select({ web: 16, default: 14 }),
    color: '#1E3A8A', // Navy blue
    marginTop: 4,
  },
  actionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: Platform.select({ web: 20, default: 16 }),
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Platform.select({ web: 0.15, default: 0.1 }),
    shadowRadius: 4,
    elevation: 2,
    width: Platform.select({ web: '60%', default: '100%' }),
    alignSelf: 'center',
  },
  actionsTitle: {
    fontSize: Platform.select({ web: 20, default: 18 }),
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: '#F1F5F9', // Light gray
    borderRadius: 6,
    padding: Platform.select({ web: 14, default: 12 }),
    marginBottom: 8,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: Platform.select({ web: 16, default: 14 }),
    fontWeight: '600',
    color: '#1E3A8A',
    marginLeft: 12,
  },
  updatesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: Platform.select({ web: 20, default: 16 }),
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Platform.select({ web: 0.15, default: 0.1 }),
    shadowRadius: 4,
    elevation: 2,
    width: Platform.select({ web: '60%', default: '100%' }),
    alignSelf: 'center',
  },
  updatesTitle: {
    fontSize: Platform.select({ web: 20, default: 18 }),
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 12,
  },
  updateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  updateIcon: {
    marginRight: 12,
  },
  updateTextContainer: {
    flex: 1,
  },
  updateText: {
    fontSize: Platform.select({ web: 16, default: 14 }),
    color: '#555',
  },
  updateTimestamp: {
    fontSize: Platform.select({ web: 14, default: 12 }),
    color: '#888',
    marginTop: 4,
  },
  emptyUpdatesText: {
    fontSize: Platform.select({ web: 16, default: 14 }),
    color: '#555',
    textAlign: 'center',
  },
});
