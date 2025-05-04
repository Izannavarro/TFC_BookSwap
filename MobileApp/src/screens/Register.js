import { StyleSheet, Text, View, Pressable, ImageBackground, Image } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import { TextInput } from 'react-native-paper';
import Context from './Context';
import * as Font from 'expo-font';

export default function Register({ navigation }) {
  const { name, setName, password, setPassword, setToken, setUserId, theme } = useContext(Context);
  const [textName, setTextName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [address, setAddress] = useState('');

  const toMain = () => {
    navigation.navigate('Main');
  };

  const toApp = async () => {
    if (!textName || !password || !address) {
      alert('Username, password, and address cannot be empty.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords must be the same.');
      return;
    }

    try {
      // Get coordinates from the address via backend
      const geoResponse = await fetch(`http://localhost:8080/bookswap/geocode?address=${encodeURIComponent(address)}`);
      const geoData = await geoResponse.json();

      if (!geoData || !geoData.lat || !geoData.lng) {
        alert('Failed to get coordinates from the address.');
        return;
      }

      // Now we register the user
      const response = await fetch('http://localhost:8080/bookswap/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: textName, password, address, lat: geoData.lat, lng: geoData.lng }),
      });

      const responseText = await response.text();
      if (!response.ok) {
        alert('Authentication error.');
        return;
      }

      setToken(responseText);
      setName(textName);

      const response2 = await fetch(
        `http://localhost:8080/bookswap/userInfo?token=${responseText}&username=${textName}`
      );
      if (response2.ok) {
        const result = await response2.json();
        setUserId(result.id);
      }

      navigation.navigate('LoadingScreen');
    } catch (error) {
      console.error(error);
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
            value={password}
            onChangeText={setPassword}
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
