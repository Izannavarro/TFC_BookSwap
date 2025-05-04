import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Context from './Context';

const Settings = () => {
  const {
    name,
    password,
    setToken,
    setName,
    setPassword,
  } = useContext(Context);
  const navigation = useNavigation();

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedPassword, setEditedPassword] = useState(password);
  const [avatarUri, setAvatarUri] = useState('https://i.pravatar.cc/150?img=3');

  const handleLogout = () => {
    setToken(null);
    setName('');
    setPassword('');
    navigation.navigate('Login');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, delete it',
          style: 'destructive',
          onPress: () => {
            setToken(null);
            setName('');
            setPassword('');
            navigation.navigate('Login');
          },
        },
      ]
    );
  };

  const handleUpdate = () => {
    setIsEditing(true);
    Alert.alert(
      'Change Photo',
      'Choose a method to update your profile photo:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Camera',
          onPress: () => {
            launchCamera({ mediaType: 'photo' }, (response) => {
              if (response.assets && response.assets[0]) {
                setAvatarUri(response.assets[0].uri);
              }
            });
          },
        },
        {
          text: 'Gallery',
          onPress: () => {
            launchImageLibrary({ mediaType: 'photo' }, (response) => {
              if (response.assets && response.assets[0]) {
                setAvatarUri(response.assets[0].uri);
              }
            });
          },
        },
      ]
    );
  };

  const handleSave = () => {
    setName(editedName);
    setPassword(editedPassword);
    setIsEditing(false);
    Alert.alert('Updated', 'Your profile has been updated.');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity disabled={!isEditing} onPress={handleUpdate}>
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <View style={styles.inputRow}>
            <Icon name="person-outline" size={20} color="#888" />
            <TextInput
              style={styles.input}
              value={editedName}
              onChangeText={setEditedName}
              editable={isEditing}
              placeholder="Name"
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
              placeholder="Password"
            />
          </View>
        </View>
        {!isEditing ? (
          <TouchableOpacity style={styles.editButton} onPress={handleUpdate}>
            <Icon name="create-outline" size={20} color="#007bff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.editButton} onPress={handleSave}>
            <Icon name="checkmark-done-outline" size={20} color="#28a745" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>

        <TouchableOpacity style={styles.item} onPress={handleLogout}>
          <Icon name="log-out-outline" size={20} color="#555" />
          <Text style={styles.itemText}>Log out</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={handleDeleteAccount}>
          <Icon name="trash-outline" size={20} color="red" />
          <Text style={[styles.itemText, { color: 'red' }]}>Delete Account</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy</Text>
        <Text style={styles.policyText}>
          En BookSwap respetamos tu privacidad. Tus datos personales no serán compartidos con terceros y puedes solicitar su eliminación en cualquier momento.
        </Text>
      </View>
    </ScrollView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  editButton: {
    padding: 8,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#555',
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
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 8,
    paddingBottom: 4,
  },
  input: {
    marginLeft: 8,
    fontSize: 16,
    flex: 1,
    color: '#333',
  },
});
