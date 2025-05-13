import { Text, View, ActivityIndicator, StyleSheet, Image, ImageBackground } from 'react-native';
import { useEffect} from 'react';

export default function LoadingScreen({ navigation }) {
  useEffect(() => {

      setTimeout(() => {
        navigation.replace('AppStack');
      }, 2000);
  }, [navigation]);

  return (
    <ImageBackground
      source={require('../assets/IMAGEN_LOGIN.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Image
          source={require('../assets/LOGO_BOOKSWAP.png')}
          style={styles.logo}
        />
        <ActivityIndicator size="large" color="#B25B00" style={{ marginVertical: 30 }} />
        <Text style={styles.text}>Loading, please wait...</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 20,
  },
  logo: {
    width: 500,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  text: {
    fontFamily: 'alegraya-sans',
    fontSize: 16,
    color: 'white',
    letterSpacing: 2,
    marginTop: 10,
  },
});
