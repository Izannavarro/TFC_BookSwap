import { StyleSheet, Text, View, Image, Pressable, Alert, ImageBackground } from 'react-native';
import { useContext, useState, useEffect } from 'react';
import { TextInput } from 'react-native-paper';
import Context from './Context';
import * as Font from 'expo-font';
import toImageUri from '../utilities/toImageUri';

export default function Login({ navigation }) {
  const {
    username,
    setUsername,
    password,
    setPassword,
  } = useContext(Context);

  // const [fontsLoaded, setFontsLoaded] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const toApp = async () => {
    if (!username || !password) {
      Alert.alert('El usuario o la contraseña no pueden estar vacíos.');
      return;
    }

    try {
      // const response = await fetch('http://localhost:8080/bookswap/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ username: name, password }),
      // });

      // if (!response.ok) {
      //   Alert.alert('Error en la autenticación');
      //   return;
      // }

      // const token = await response.text();
      // setToken(token);

      // const response2 = await fetch(
      //   `http://localhost:8080/bookswap/userInfo?token=${token}&username=${name}`
      // );

      // if (response2.ok) {
      //   const result = await response2.json();
      //   setUserId(result.id);
      //   setPoints(result.points);
      //   result.profilePicture
      //     ? setPicture(toImageUri(result.profilePicture, result.extension))
      //     : setPicture(null);
      // }

      navigation.navigate('LoadingScreen');
    } catch (error) {
      console.error('Error en la autenticación:', error);
    }
  };

  const toMain = () => {
    setUsername('');
    navigation.navigate('Main');
  };

  // useEffect(() => {
  //   const loadFonts = async () => {
  //     await Font.loadAsync({
  //       'alegraya-sans': require('../assets/fonts/AlegreyaSansSC-Regular.ttf'),
  //     });
  //     setFontsLoaded(true);
  //   };
  //   if (!fontsLoaded) loadFonts();
  // }, [fontsLoaded]);

  // if (!fontsLoaded) return null;

  return (
    <ImageBackground
      source={require('../assets/IMAGEN_LOGIN2.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Image style={styles.logo} source={require('../assets/LOGO_BOOKSWAP.png')} />
        <View style={styles.form}>
          <Text style={styles.title}>Iniciar sesión</Text>

          <TextInput
            label="Usuario"
            mode="flat"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            theme={{ colors: { text: '#000', primary: '#96cf24' } }}
          />
          <TextInput
            label="Contraseña"
            mode="flat"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            style={styles.input}
            theme={{ colors: { text: '#000', primary: '#96cf24' } }}
            right={
              <TextInput.Icon
                icon={passwordVisible ? 'eye' : 'eye-off'}
                onPress={() => setPasswordVisible(!passwordVisible)}
              />
            }
          />

          <Pressable onPress={toApp} style={[styles.button, { backgroundColor: '#006838' }]}>
            <Text style={styles.buttonText}>Entrar</Text>
          </Pressable>

          <Pressable onPress={toMain} style={[styles.button, { backgroundColor: '#B25B00' }]}>
            <Text style={styles.buttonText}>Volver</Text>
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
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 400,
    height: 130,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  form: {
    width: '85%',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontFamily: 'alegraya-sans',
    marginBottom: 20,
    letterSpacing: 2,
  },
  input: {
    backgroundColor: '#FFBD77',
    width: '100%',
    marginBottom: 15,
    borderRadius: 8,
    fontFamily: 'alegraya-sans',
  },
  button: {
    padding: 12,
    width: '60%',
    borderRadius: 15,
    marginTop: 15,
    elevation: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'alegraya-sans',
    color: '#fff',
    fontSize: 16,
    letterSpacing: 2,
  },
});
