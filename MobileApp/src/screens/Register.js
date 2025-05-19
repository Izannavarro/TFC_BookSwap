import { StyleSheet, Text, View, Pressable, ImageBackground, Image } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import { TextInput } from 'react-native-paper';
import Context from './Context';
import * as Font from 'expo-font';
import logo from '../assets/LOGO_BOOKSWAP.png';
import imageToBase64 from '../utilities/toBase64';

export default function Register({ navigation }) {
  const { setUsername,  setPassword, setToken, setPicture, setLat, setLng } = useContext(Context);
  const [textName, setTextName] = useState('');
  const [textPwd, setTextPwd] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [address, setAddress] = useState('');
  

  const toMain = () => {
    setTextPwd('');
    setTextName('');
    setAddress('');
    navigation.navigate('Main');
  };

  const toApp = async () => {
  if (!textName || !textPwd || !address) {
    alert('Username, password, and address cannot be empty.');
    return;
  }

  if (textPwd !== confirmPassword) {
    alert('Passwords must be the same.');
    return;
  }

  try {
    console.log(address);
    const geoResponse = await fetch(
      `http://3.219.75.18:8080/bookswap/geocode?address=${address}`
    );

    if (!geoResponse.ok) {
      if (geoResponse.status === 404) {
        alert('The entered address is invalid or incorrectly formatted.');
      } else {
        alert('There was an error verifying the address. Please try again.');
      }
      return;
    }

    const geoData = await geoResponse.json();
    if (!geoData.lat || !geoData.lng) {
      alert('Could not retrieve coordinates from the address.');
      return;
    }

    setLat(geoData.lat);
    setLng(geoData.lng);
    console.log(geoData.lat);
    console.log(geoData.lng);

    const response = await fetch('http://3.219.75.18:8080/bookswap/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: textName,
        password: textPwd,
        profilePicture: null,
        address: address,
        lat: geoData.lat,
        lng: geoData.lng,
      }),
    });

    const responseText = await response.text();
    if (!response.ok) {
      alert('Registration failed. Please check your input.');
      return;
    }

    setToken(responseText);
    setUsername(textName);
    setPassword(textPwd);
    setPicture(null);

    console.log(responseText);
    navigation.navigate('LoadingScreen');
  } catch (error) {
    console.error(error);
    alert('Network or server error. Please try again.');
  }
};

  return (
    <ImageBackground
      source={require('../assets/IMAGEN_LOGIN2.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Image style={styles.logo} source={require('../assets/LOGO_BOOKSWAP.png')} />
        <View style={styles.card}>
          <Text style={styles.title}>Register</Text>

          <TextInput
            placeholder="Username"
            placeholderTextColor="#555"
            value={textName}
            onChangeText={setTextName}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#555"
            value={textPwd}
            onChangeText={setTextPwd}
            secureTextEntry={!passwordVisible}
            right={
              <TextInput.Icon
                name={passwordVisible ? 'eye-off' : 'eye'}
                onPress={() => setPasswordVisible(!passwordVisible)}
              />
            }
            style={styles.input}
          />
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#555"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!confirmPasswordVisible}
            right={
              <TextInput.Icon
                name={confirmPasswordVisible ? 'eye-off' : 'eye'}
                onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              />
            }
            style={styles.input}
          />

          <TextInput
            placeholder="Address (ex: Av. Corrientes 1234, Buenos Aires, Argentina)"
            placeholderTextColor="#555"
            value={address}
            onChangeText={setAddress}
            style={styles.input}
          />

          <Pressable onPress={() => setIsChecked(!isChecked)} style={styles.checkboxContainer}>
            <View style={styles.checkbox}>
              {isChecked && <Text style={styles.checkmark}>✔</Text>}
            </View>
            <Text style={styles.checkboxText}>
              I accept the{' '}
              <Text style={styles.link} onPress={() => navigation.navigate('Terms')}>
                Terms and Conditions
              </Text>
            </Text>
          </Pressable>

          <Pressable
            onPress={toApp}
            style={[styles.button, { backgroundColor: '#B25B00' }, !isChecked && styles.disabled]}
            disabled={!isChecked}
          >
            <Text style={styles.buttonText}>Register</Text>
          </Pressable>

          <Pressable onPress={toMain} style={[styles.button, { backgroundColor: '#555' }]}>
            <Text style={styles.buttonText}>Go Back</Text>
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
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 20,
  },
  logo: {
    width: 400,
    height: 150,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  card: {
    width: '85%',
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    elevation: 10,
  },
  title: {
    fontFamily: 'alegraya-sans',
    fontSize: 28,
    marginBottom: 20,
    color: '#333',
    letterSpacing: 2,
  },
  input: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    marginVertical: 8,
    borderRadius: 10,
    fontFamily: 'alegraya-sans',
    letterSpacing: 1,
  },
  button: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 15,
    width: '70%',
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: {
    fontFamily: 'alegraya-sans',
    color: 'white',
    fontSize: 16,
    letterSpacing: 2,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    width: '100%',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkmark: {
    fontSize: 14,
  },
  checkboxText: {
    fontFamily: 'alegraya-sans',
    fontSize: 14,
    color: '#333',
    flexShrink: 1,
  },
  link: {
    color: '#0066cc',
    textDecorationLine: 'underline',
  },
  disabled: {
    backgroundColor: '#bbb',
  },
});
