
import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
    paddingTop: 10,
  },
  content: {
    paddingHorizontal: Platform.select({ web: 20, default: 10 }),
    maxWidth: Platform.OS === 'web' ? 800 : width,
    marginHorizontal: 'auto',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 20,
  },
  imageSection: {
    width: '100%',
    height: Platform.select({ web: 400, default: 250 }),
    backgroundColor: '#F1F5F9',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  noImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  noImageText: {
    fontSize: Platform.select({ web: 16, default: 14 }),
    color: '#B0B0B0',
    marginTop: 10,
    fontWeight: '500',
  },
  detailsSection: {
    padding: 20,
  },
  productTitle: {
    fontSize: Platform.select({ web: 28, default: 22 }),
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 15,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: Platform.select({ web: 22, default: 18 }),
    fontWeight: '600',
    color: '#E53E3E',
    marginBottom: 15,
    textAlign: 'center',
  },
  detailItem: {
    fontSize: Platform.select({ web: 16, default: 14 }),
    color: '#4A5568',
    marginBottom: 10,
    lineHeight: 22,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2D3748',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
    ...(Platform.OS === 'web' && {
      transition: 'background-color 0.2s ease',
      ':hover': {
        backgroundColor: '#1A202C',
      },
    }),
  },
  backIcon: {
    marginRight: 8,
  },
  backButtonText: {
    fontSize: Platform.select({ web: 16, default: 14 }),
    fontWeight: '500',
    color: '#FFFFFF',
  },
});
