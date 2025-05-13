
import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: Platform.select({ web: 20, default: 10 }),
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Platform.select({ web: 20, default: 10 }),
    paddingHorizontal: 5,
  },
  title: {
    fontSize: Platform.select({ web: 24, default: 20 }),
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  refreshButton: {
    backgroundColor: '#0073AA',
    padding: 8,
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  productCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    margin: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
    ...(Platform.OS === 'web' && {
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    }),
    ...(Platform.OS === 'web' && {
      ':hover': {
        transform: 'scale(1.02)',
        shadowOpacity: 0.15,
      },
    }),
  },
  imageContainer: {
    width: '100%',
    height: Platform.select({ web: 200, default: 150 }),
    backgroundColor: '#F0F0F0',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  noImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  productInfo: {
    padding: Platform.select({ web: 12, default: 8 }),
  },
  productName: {
    fontSize: Platform.select({ web: 16, default: 14 }),
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: Platform.select({ web: 18, default: 16 }),
    fontWeight: '700',
    color: '#0073AA',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: Platform.select({ web: 14, default: 12 }),
    color: '#666',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: Platform.select({ web: 14, default: 12 }),
    fontWeight: '700',
    color: '#333',
    marginTop: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 5,
    padding: 10,
    fontSize: Platform.select({ web: 14, default: 12 }),
    color: '#333',
    marginBottom: 10,
    backgroundColor: '#FFF',
  },
  actionContainer: {
    padding: Platform.select({ web: 10, default: 8 }),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#0073AA',
    borderRadius: 5,
    marginTop: 10,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: Platform.select({ web: 14, default: 12 }),
    fontWeight: '500',
    textAlign: 'center',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    marginBottom: 10,
  },
  retryButton: {
    padding: 10,
    backgroundColor: '#0073AA',
    borderRadius: 5,
  },
  retryText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: Platform.select({ web: 18, default: 16 }),
    color: '#666',
    textAlign: 'center',
    marginVertical: 10,
  },
  addButton: {
    padding: 10,
    backgroundColor: '#0073AA',
    borderRadius: 5,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});
