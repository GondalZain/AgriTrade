
// frontend/src/styles/OrdersStyles.js
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: Platform.select({ web: 16, default: 14 }),
    fontWeight: '600',
    color: '#1E3A8A',
  },
  status: {
    fontSize: Platform.select({ web: 14, default: 12 }),
    fontWeight: '600',
  },
  statusPending: {
    color: '#F59E0B', // Amber
  },
  statusConfirmed: {
    color: '#2E7D32', // Green
  },
  statusCancelled: {
    color: '#EF4444', // Red
  },
  cardDetail: {
    fontSize: Platform.select({ web: 14, default: 12 }),
    color: '#555',
    marginBottom: 4,
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
  bidsTitle: {
    fontSize: Platform.select({ web: 16, default: 14 }),
    fontWeight: '600',
    color: '#1E3A8A',
    marginTop: 12,
    marginBottom: 8,
  },
  emptyBidsText: {
    fontSize: Platform.select({ web: 14, default: 12 }),
    color: '#555',
    marginBottom: 8,
  },
  bidItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    padding: Platform.select({ web: 12, default: 10 }),
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  bidHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  bidDetail: {
    fontSize: Platform.select({ web: 14, default: 12 }),
    color: '#555',
  },
  bidStatus: {
    fontSize: Platform.select({ web: 14, default: 12 }),
    fontWeight: '600',
  },
  bidStatusOpen: {
    color: '#F59E0B', // Amber
  },
  bidStatusAccepted: {
    color: '#2E7D32', // Green
  },
  bidStatusRejected: {
    color: '#EF4444', // Red
  },
  bidActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  bidActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    padding: Platform.select({ web: 10, default: 8 }),
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  acceptButton: {
    backgroundColor: '#2E7D32', // Green
  },
  rejectButton: {
    backgroundColor: '#EF4444', // Red
  },
  bidActionText: {
    fontSize: Platform.select({ web: 14, default: 12 }),
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 6,
  },
});
