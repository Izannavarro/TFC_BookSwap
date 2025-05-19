import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useEffect, useState, useContext } from 'react';
import * as Location from 'expo-location';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import Context from './Context';

export default function Home() {
  const [userMarkers, setUserMarkers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [location, setLocation] = useState(null); // ✅ nueva ubicación local
  const [noUsersModalVisible, setNoUsersModalVisible] = useState(false);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const { token, username, picture, lat, lng, setLat, setLng } =
    useContext(Context);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Could not get your location.');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLat(loc.coords.latitude);
      setLng(loc.coords.longitude);
    })();
  }, []);

  useEffect(() => {
    fetchUserCoordinates();
  }, []);

  const fetchUserCoordinates = async () => {
    try {
      const res = await axios.get(
        `http://3.219.75.18:8080/bookswap/userLocations?currentUsername=${username}`
      );

      if (res.data.length === 0) {
        if (location || (lat && lng)) {
          const userLocation = location || { latitude: lat, longitude: lng };

          setUserMarkers([
            {
              username: 'THERE ARE NO USERS NEAR YOU',
              address: '',
              lat: userLocation.latitude,
              lng: userLocation.longitude,
            },
          ]);
        } else {
          setUserMarkers([]); // No se puede mostrar ningún marcador
        }
      } else {
        setUserMarkers(res.data);
      }
    } catch (error) {
      console.warn('Error fetching user coordinates:', error.message);
    }
  };

  const handleMarkerPress = async (name) => {
    if (name === 'THERE ARE NO USERS NEAR U') {
      setNoUsersModalVisible(true);
      return;
    }

    if (selectedUser && selectedUser.username === name) {
      setUserModalVisible(true);
      return;
    }

    try {
      const res = await axios.get(
        `http://3.219.75.18:8080/bookswap/userInfo?token=${token}&username=${name}`
      );
      setSelectedUser(res.data);
      setUserModalVisible(true);
    } catch (error) {
      Alert.alert('Error', 'Could not load user information.');
    }
  };

  const getInitialRegion = () => {
    if (lat && lng) {
      return {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    } else if (location) {
      return {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    } else {
      // Fallback por defecto
      return {
        latitude: 39.4699,
        longitude: -0.3763,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../assets/LOGO_BOOKSWAP.png')}
          style={styles.logo}
        />
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Image
            source={{ uri: picture || 'https://placehold.co/40x40' }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      {/* Mapa */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          showsUserLocation={true}
          initialRegion={getInitialRegion()}>
          {userMarkers.map((user) => (
            <Marker
              key={user.username}
              coordinate={{ latitude: user.lat, longitude: user.lng }}
              title={user.username}
              description={user.address}
              onPress={() => handleMarkerPress(user.username)}
            />
          ))}
        </MapView>
      </View>

      {/* Modal con información del usuario */}
      {selectedUser && (
        <Modal
          visible={userModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => {
            setUserModalVisible(false);
            setSelectedUser(null);
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {selectedUser.profilePicture ? (
                <Image
                  source={{
                    uri: `data:image/png;base64,${selectedUser.profilePicture}`,
                  }}
                  style={styles.modalImage}
                />
              ) : (
                <Text style={styles.modalText}>No profile picture</Text>
              )}
              <Text style={styles.modalTitle}>{selectedUser.username || 'No name'}</Text>
              <Text style={styles.modalText}>{selectedUser.address || 'No address'}</Text>
              <TouchableOpacity
                style={styles.exchangeButton}
                onPress={() => {
                  setUserModalVisible(false);
                  navigation.navigate('Exchanges', {
                    selectedUser: selectedUser,
                    showCreateModal: true,
                  });
                }}>
                <Text style={styles.exchangeButtonText}>Create Exchange</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setUserModalVisible(false);
                  setSelectedUser(null);
                }}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Modal cuando no hay usuarios cerca */}
      <Modal
        visible={noUsersModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setNoUsersModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>No users near you!</Text>
            <Text style={styles.modalText}>
              Try refreshing your location or come back later.
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setNoUsersModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#000000', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  logo: {
    width: 80,
    height: 60,
    resizeMode: 'contain',
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  mapContainer: { flex: 1, overflow: 'hidden' },
  map: { flex: 1 },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
  },
  modalImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 10,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  modalText: { fontSize: 14, textAlign: 'center', marginBottom: 10 },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#B25B00',
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: { fontWeight: 'bold', color: '#fff' },
  exchangeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#96cf24',
    borderRadius: 10,
    alignItems: 'center',
  },
  exchangeButtonText: {
    fontWeight: 'bold',
    color: '#fff',
  },
});
