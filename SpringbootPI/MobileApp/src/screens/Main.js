import { StyleSheet, Text, Pressable, View, Image, ImageBackground } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import Context from './Context';
import * as Font from 'expo-font';
import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export default function Main({ navigation }) {
  const { theme } = useContext(Context);
  // const [fontsLoaded, setFontsLoaded] = useState(false);

  // useEffect(() => {
  //   const loadFonts = async () => {
  //     await Font.loadAsync({
  //       'alegraya-sans': require('../assets/fonts/AlegreyaSansSC-Regular.ttf'),
  //     });
  //     setFontsLoaded(true);
  //   };

  //   if (!fontsLoaded) {
  //     loadFonts();
  //   }
  // }, [fontsLoaded]);

  const toLogin = () => {
    navigation.navigate('Login');
  };

  const toRegister = () => {
    navigation.navigate('Register');
  };

  // if (!fontsLoaded) return null;

  return (
    <ImageBackground
      source={require('../assets/IMAGEN_LOGIN.jpg')}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Image style={styles.logo} source={require('../assets/LOGO_BOOKSWAP.png')} />
        <View style={styles.cardContainer}>
          <Pressable onPress={toLogin} style={[styles.button, { backgroundColor: '#006838' }]}>
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>
          <Pressable onPress={toRegister} style={[styles.button, { backgroundColor: '#B25B00' }]}>
            <Text style={styles.buttonText}>Register</Text>
          </Pressable>
        </View>
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
    backgroundColor: 'rgba(0,0,0,0.3)', // opacidad extra sobre el fondo
    padding: 20,
  },
  logo: {
  width: width * 1.2,     // 60% del ancho de pantalla
  height: width * 0.6,    // misma proporción para mantenerlo cuadrado
  resizeMode: 'contain',
  marginBottom: 40,
},
  cardContainer: {
    width: '60%',
    alignItems: 'center',
  },
  button: {
    width: '70%',
    padding: 15,
    borderRadius: 15,
    marginVertical: 20,
    shadowColor: '#000',
    elevation: 10,
  },
  buttonText: {
    fontFamily: 'alegraya-sans',
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 2,
  },
});
