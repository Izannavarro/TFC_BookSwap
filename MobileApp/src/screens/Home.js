import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useEffect, useState } from 'react';
import Geolocation from 'react-native-geolocation-service';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default Home = () => {
  const [location, setLocation] = useState(null);
  const [userMarkers, setUserMarkers] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Pedir permisos y obtener ubicación
    Geolocation.requestAuthorization('whenInUse').then(() => {
      Geolocation.getCurrentPosition(
        (pos) => setLocation(pos.coords),
        (err) => console.warn(err.message),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });

    // Llamar al backend para obtener las coordenadas de los usuarios
    fetchUserCoordinates();
  }, []);

  const fetchUserCoordinates = async () => {
    try {
      const res = await axios.get('http://<TU_BACKEND>/api/users/coordinates');
      setUserMarkers(res.data); // Espera un array de objetos con lat y lng
    } catch (error) {
      console.warn('Error fetching user coordinates:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../assets/LOGO_BOOKSWAP.png')} style={styles.logo} />
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Image source={require('../assets/LOGO_BOOKSWAP.png')} style={styles.avatar} />
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
          {/* Marcador del usuario actual */}
          {location && (
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Tú"
              description="Tu ubicación actual"
              pinColor="blue"
            />
          )}

          {/* Marcadores de otros usuarios */}
          {userMarkers.map((user) => (
            <Marker
              key={user._id}
              coordinate={{
                latitude: user.coordinates.lat,
                longitude: user.coordinates.lng,
              }}
              title={user.name}
              description={user.address}
            />
          ))}
        </MapView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    paddingHorizontal: 15,
    paddingTop: 40,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#d3a3ff',
  },
  logo: {
    width: 50,
    height: 40,
    resizeMode: 'contain',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#a0c4ff',
  },
  mapContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
});
