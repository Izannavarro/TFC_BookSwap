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
import Geolocation from 'react-native-geolocation-service';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import Context from './Context';

export default function Home() {
  const [location, setLocation] = useState(null);
  const [userMarkers, setUserMarkers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const { token, username, picture } = useContext(Context);

  useEffect(() => {
    const requestAndFetchLocation = async () => {
      const granted = await Geolocation.requestAuthorization('whenInUse');
      if (granted === 'granted') {
        Geolocation.getCurrentPosition(
          (pos) => setLocation(pos.coords),
          (err) => console.warn(err.message),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } else {
        Alert.alert('Permiso denegado', 'No se puede acceder a la ubicación.');
      }
    };

    requestAndFetchLocation();
    fetchUserCoordinates();
  }, []);

  useEffect(() => {
    if (!isFocused) {
      setSelectedUser(null);
      setUserModalVisible(false);
    }
  }, [isFocused]);

  const fetchUserCoordinates = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/bookswap/userLocations?username=${username}`
      );
      setUserMarkers(res.data);
    } catch (error) {
      console.warn('Error fetching user coordinates:', error.message);
    }
  };

  const handleMarkerPress = async (name) => {
    if (selectedUser && selectedUser.username === name) {
      setUserModalVisible(true);
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:8080/bookswap/userInfo?token=${token}&username=${name}`
      );
      setSelectedUser(res.data);
      setUserModalVisible(true);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la información del usuario.');
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
            source={{ uri: picture }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      {/* Mapa */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          showsUserLocation={true}
          initialRegion={
            location
              ? {
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }
              : {
                  latitude: 37.78825,
                  longitude: -122.4324,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }
          }>
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
                <Text style={styles.modalText}>Sin imagen de perfil</Text>
              )}
              <Text style={styles.modalTitle}>
                {selectedUser.username || 'Sin nombre'}
              </Text>
              <Text style={styles.modalText}>
                {selectedUser.address || 'Sin dirección'}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setUserModalVisible(false);
                  setSelectedUser(null);
                }}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
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
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    width: '100%',
    paddingHorizontal: 15,
    paddingTop: 40,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#d3a3ff',
  },
  logo: { width: 50, height: 40, resizeMode: 'contain' },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#a0c4ff',
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
  modalSubtitle: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  modalBook: { fontSize: 14, marginVertical: 2 },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#d3a3ff',
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: { fontWeight: 'bold', color: '#fff' },
  exchangeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#a0c4ff',
    borderRadius: 10,
    alignItems: 'center',
  },
  exchangeButtonText: {
    fontWeight: 'bold',
    color: '#fff',
  },
});
