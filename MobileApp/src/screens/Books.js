import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Context from './Context';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default Books = () => {
  const { username, token, userBooks, setUserBooks } = useContext(Context);
  const [selectedBook, setSelectedBook] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    description: '',
    image_url: '',
  });
  const [bookToDelete, setBookToDelete] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetch(
        `http://3.219.75.18:8080/bookswap/getBooks?ownerUsername=${username}&token=${token}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setUserBooks(data);
          } else {
            setUserBooks([]);
          }
        })
        .catch(console.warn)
        .finally(() => setLoading(false));
    }, [username, token])
  );

  const handleDeleteBook = async () => {
    if (!bookToDelete) {
      Alert.alert('Error', 'You have to choose a book to delete');
      return;
    }

    try {
      const response = await fetch(
        'http://3.219.75.18:8080/bookswap/deleteBook',
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: bookToDelete,
            owner_username: username,
          }),
        }
      );

      if (!response.ok) throw new Error('Error al eliminar el libro');

      setUserBooks(userBooks.filter((book) => book.title !== bookToDelete));
      setDeleteModalVisible(false);
      setBookToDelete('');
      Alert.alert('Success', 'The book has been deleted!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleAddBook = async () => {
    const { title, author, genre, description, image_url } = formData;

    if (!title || !author || !genre || !description || !image_url) {
      Alert.alert('Incomplete Fields', 'Please complete all fields');
      return;
    }

    if (!image_url.startsWith('data:image/')) {
      Alert.alert('Invalid Image', 'Select a valid Image');
      return;
    }

    if (userBooks.some((b) => b.title === title)) {
      Alert.alert('Duplicate', 'There is an existent book with that Title.');
      return;
    }

    const bookData = { ...formData, ownerUsername: username };

    try {
      const response = await fetch('http://3.219.75.18:8080/bookswap/addBook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) throw new Error('Error adding the book');

      const newBook = await response.json();
      setUserBooks([...userBooks, newBook]);

      setFormData({
        title: '',
        author: '',
        genre: '',
        description: '',
        image_url: '',
      });

      setAddModalVisible(false);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const selectImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        'permission denied',
        'Permission is required to access the gallery.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const base64Image = `data:image/jpeg;base64,${asset.base64}`;
      setFormData({ ...formData, image_url: base64Image });
    }
  };

  const renderBookItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedBook(item);
        setDetailModalVisible(true);
      }}
      style={styles.bookItem}>
      <Image source={{ uri: item.image_url }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={{ marginTop: 10, color: '#4CAF50' }}>
            Loading books...
          </Text>
        </View>
      ) : userBooks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Add a Book</Text>
        </View>
      ) : (
        <FlatList
          data={userBooks}
          keyExtractor={(item) => item.title}
          renderItem={renderBookItem}
          contentContainerStyle={styles.list}
        />
      )}

      {/* Botones de acción */}
      <View style={styles.buttonContainer}>
        {userBooks.length < 5 && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => setAddModalVisible(true)}>
            <Text style={styles.buttonText}>Add a Book</Text>
          </TouchableOpacity>
        )}
        {userBooks.length > 0 && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: 'red' }]}
            onPress={() => setDeleteModalVisible(true)}>
            <Text style={styles.buttonText}>Delete a Book</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Modal Detalles */}
      <Modal visible={detailModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedBook && (
              <>
                <Image
                  source={{ uri: selectedBook.image_url }}
                  style={styles.modalImage}
                />
                <Text style={styles.modalTitle}>{selectedBook.title}</Text>
                <Text>Author: {selectedBook.author}</Text>
                <Text>Genre: {selectedBook.genre}</Text>
                <Text>Description: {selectedBook.description}</Text>
                <Text>Owner: {selectedBook.ownerUsername}</Text>
                <Text>
                  Published:{' '}
                  {selectedBook.publicationDate
                    ? new Date(selectedBook.publicationDate).toDateString()
                    : 'N/A'}
                </Text>
              </>
            )}
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.cancelButton}
              onPress={() => setDetailModalVisible(false)}>
              <Ionicons name="arrow-back" size={28} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Añadir Libro */}
      <Modal visible={addModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nuevo Libro</Text>
            {['title', 'author', 'genre', 'description'].map((field) => (
              <TextInput
                key={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[field]}
                onChangeText={(text) =>
                  setFormData({ ...formData, [field]: text })
                }
                style={styles.input}
              />
            ))}
            <TouchableOpacity
              style={styles.selectImageButton}
              onPress={selectImage}>
              <Text style={styles.buttonText}>
                {formData.image_url ? 'Change Image' : 'Select Image'}
              </Text>
            </TouchableOpacity>
            {formData.image_url && (
              <Image
                source={{ uri: formData.image_url }}
                style={[styles.image, { marginVertical: 10 }]}
              />
            )}
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleAddBook}>
              <Text style={styles.buttonText}>ADD</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.cancelButton}
              onPress={() => setAddModalVisible(false)}>
              <Ionicons name="arrow-back" size={22} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Eliminar Libro */}
      <Modal visible={deleteModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Selecciona un libro a eliminar
            </Text>
            <Picker
              selectedValue={bookToDelete}
              onValueChange={(itemValue) => setBookToDelete(itemValue)}>
              {userBooks.map((book) => (
                <Picker.Item
                  key={book.title}
                  label={book.title}
                  value={book.title}
                />
              ))}
            </Picker>
            <Button title="DELETE" color="red" onPress={handleDeleteBook} />
            <Button
              title="CANCEL"
              color="gray"
              onPress={() => setDeleteModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9F9FC',
  },
  list: {
    paddingBottom: 100,
  },
  bookItem: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 140,
    resizeMode: 'cover',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  title: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#006838',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 6,
    backgroundColor: '#96CF24',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#96CF24',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    padding: 22,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  modalImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 14,
    color: '#006838',
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    paddingVertical: 8,
    marginBottom: 12,
    fontSize: 15,
  },
  selectImageButton: {
    backgroundColor: '#FFBD77',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#FFBD77',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#EBEBEB',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 56, // Más grande para área táctil
    height: 56,
    alignSelf: 'flex-start', // mejor a la izquierda si es "volver"
    marginTop: 10,
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: '#96cf24', // Verde BookSwap
    padding: 14,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#96cf24',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
