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
          console.log('Sin libros registrados');
          setUserBooks([]);
        }
      })
      .catch(console.warn)
      .finally(() => setLoading(false));
  }, [username, token])
);

  const handleDeleteBook = async () => {
    if (!bookToDelete) {
      Alert.alert('Error', 'Debes seleccionar un libro para eliminar');
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
      Alert.alert('Éxito', 'El libro ha sido eliminado');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleAddBook = async () => {
    const { title, author, genre, description, image_url } = formData;

    if (!title || !author || !genre || !description || !image_url) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos');
      return;
    }

    if (!image_url.startsWith('data:image/')) {
      Alert.alert('Imagen inválida', 'Selecciona una imagen válida');
      return;
    }

    if (userBooks.some((b) => b.title === title)) {
      Alert.alert('Duplicado', 'Ya existe un libro con ese título');
      return;
    }

    const bookData = { ...formData, ownerUsername: username };

    try {
      const response = await fetch('http://3.219.75.18:8080/bookswap/addBook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) throw new Error('Error al añadir libro');

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
        'Permiso denegado',
        'Se necesita permiso para acceder a la galería.'
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
            Cargando libros...
          </Text>
        </View>
      ) : userBooks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Añade un libro</Text>
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
            <Text style={styles.buttonText}>Añadir Libro</Text>
          </TouchableOpacity>
        )}
        {userBooks.length > 0 && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: 'red' }]}
            onPress={() => setDeleteModalVisible(true)}>
            <Text style={styles.buttonText}>Eliminar Libro</Text>
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
            <Button
              title="Cerrar"
              onPress={() => setDetailModalVisible(false)}
            />
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
                {formData.image_url ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
              </Text>
            </TouchableOpacity>
            {formData.image_url && (
              <Image
                source={{ uri: formData.image_url }}
                style={[styles.image, { marginVertical: 10 }]}
              />
            )}
            <Button title="Añadir" onPress={handleAddBook} />
            <Button
              title="Cancelar"
              color="gray"
              onPress={() => setAddModalVisible(false)}
            />
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
            <Button title="Eliminar" color="red" onPress={handleDeleteBook} />
            <Button
              title="Cancelar"
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
    backgroundColor: '#fff',
  },
  list: {
    paddingBottom: 100,
  },
  bookItem: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 12,
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
    borderRadius: 6,
  },
  title: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
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
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
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
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 14,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  modalImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 15,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#222',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
    marginBottom: 12,
    fontSize: 14,
  },
  selectImageButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
