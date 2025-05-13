import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Context from './Context';
import axios from 'axios';
import imageToBase64 from '../utilities/toBase64';
import logo from '../assets/LOGO_BOOKSWAP.png';

const Settings = () => {
  const {
    username,
    setUsername,
    password,
    token,
    setToken,
    setPassword,
    picture,
    setPicture,
  } = useContext(Context);
  const navigation = useNavigation();

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(username);
  const [editedPassword, setEditedPassword] = useState(password);
  const [avatarUri, setAvatarUri] = useState(null);

  useEffect(() => {
    setEditedName(username);
    setEditedPassword(password);
  }, [username, password]);

  const handleLogout = async () => {
    try {
      await axios.get(`http://localhost:8080/bookswap/logout?token=${token}`);
    } catch (err) {
      console.warn('Logout fallido:', err);
    } finally {
      setToken(null);
      setUsername('');
      setPassword('');
      navigation.navigate('Login');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Eliminar cuenta',
      '¿Estás seguro de que quieres eliminar tu cuenta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await axios.delete(
                'http://localhost:8080/bookswap/deleteAccount',
                {
                  params: { name: username, password, token },
                }
              );

              if (res.status === 204) {
                setToken(null);
                setUsername('');
                setPassword('');
                navigation.navigate('Login');
              } else {
                Alert.alert('Error', 'No se pudo eliminar la cuenta.');
              }
            } catch (err) {
              console.error('Error al eliminar cuenta:', err);
              Alert.alert('Error', 'Fallo al eliminar la cuenta.');
            }
          },
        },
      ]
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);
      return (
        granted['android.permission.CAMERA'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.READ_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED
      );
    }
    return true;
  };

  const handleImageSelection = async () => {
    const granted = await requestPermissions();
    if (!granted) {
      Alert.alert(
        'Permisos requeridos',
        'Se necesitan permisos para acceder a la cámara o galería.'
      );
      return;
    }

    Alert.alert('Cambiar foto', 'Selecciona el origen de la imagen', [
      {
        text: 'Cámara',
        onPress: () => {
          launchCamera({ mediaType: 'photo' }, async (response) => {
            if (response.assets && response.assets[0]) {
              const uri = response.assets[0].uri;
              setAvatarUri(uri);
              const base64Image = await imageToBase64(uri);
              setPicture(base64Image);
            }
          });
        },
      },
      {
        text: 'Galería',
        onPress: () => {
          launchImageLibrary({ mediaType: 'photo' }, async (response) => {
            if (response.assets && response.assets[0]) {
              const uri = response.assets[0].uri;
              setAvatarUri(uri);
              const base64Image = await imageToBase64(uri);
              setPicture(base64Image);
            }
          });
        },
      },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const handleSave = async () => {
    const noChanges =
      editedName === username &&
      editedPassword === password &&
      (avatarUri === null || avatarUri === picture);

    if (noChanges) {
      Alert.alert('Sin cambios', 'No se han realizado cambios en tu perfil.');
      return;
    }

    try {
      let base64Image = picture;
      if (avatarUri && avatarUri !== picture) {
        base64Image = await imageToBase64(avatarUri);
      }

      const res = await axios.put(
        `http://localhost:8080/bookswap/updateUser?token=${token}`,
        {
          oldName: username,
          newName: editedName,
          password: editedPassword,
          profilePicture: base64Image,
        }
      );

      if (res.status === 204) {
        setUsername(editedName);
        setPassword(editedPassword);
        setIsEditing(false);
        setPicture(base64Image);
        Alert.alert('Actualizado', 'Tu perfil ha sido actualizado.');
      }
    } catch (err) {
      console.error('Error actualizando usuario:', err);
      Alert.alert('Error', 'No se pudo actualizar tu perfil.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
        <Image
          source={picture ? { uri: picture } : logo}
          style={styles.avatar}
        />
      </View>
      <View style={styles.card}>
        <View style={styles.inputRow}>
          <Icon name="person-outline" size={20} color="#888" />
          <TextInput
            style={styles.input}
            value={editedName}
            onChangeText={setEditedName}
            editable={isEditing}
            placeholder="Nombre"
          />
        </View>
        <View style={styles.inputRow}>
          <Icon name="lock-closed-outline" size={20} color="#888" />
          <TextInput
            style={styles.input}
            value={editedPassword}
            onChangeText={setEditedPassword}
            editable={isEditing}
            secureTextEntry
            placeholder="Contraseña"
          />
        </View>
      </View>

      {isEditing && (
        <TouchableOpacity
          style={styles.pictureButton}
          onPress={handleImageSelection}>
          <Text style={styles.pictureButtonText}>
            Actualizar foto de perfil
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.editSection}>
        {!isEditing ? (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}>
            <Icon name="create-outline" size={20} color="#007bff" />
            <Text style={styles.editButtonText}>Editar perfil</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Icon name="checkmark-done-outline" size={20} color="#fff" />
            <Text style={styles.saveButtonText}>Guardar cambios</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>

        <TouchableOpacity style={styles.item} onPress={handleLogout}>
          <Icon name="log-out-outline" size={20} color="#555" />
          <Text style={styles.itemText}>Cerrar sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={handleDeleteAccount}>
          <Icon name="trash-outline" size={20} color="red" />
          <Text style={[styles.itemText, { color: 'red' }]}>
            Eliminar cuenta
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacidad</Text>
        <Text style={styles.policyText}>
          En BookSwap respetamos tu privacidad. Tus datos personales no serán
          compartidos con terceros y puedes solicitar su eliminación en
          cualquier momento.
        </Text>
      </View>
    </ScrollView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 100,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#a0c4ff',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  input: {
    marginLeft: 8,
    fontSize: 16,
    flex: 1,
    color: '#333',
  },
  pictureButton: {
    backgroundColor: '#e5dbff',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 20,
  },
  pictureButtonText: {
    fontSize: 14,
    color: '#5f3dc4',
    fontWeight: '600',
  },
  editSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderColor: '#d3a3ff',
    borderWidth: 1.5,
    backgroundColor: '#fff',
  },
  editButtonText: {
    marginLeft: 8,
    color: '#7b2cbf',
    fontWeight: '600',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#7b2cbf',
    borderRadius: 8,
  },
  saveButtonText: {
    marginLeft: 8,
    color: '#fff',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#7b2cbf',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  itemText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  policyText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
  },
});
