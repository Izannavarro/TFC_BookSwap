import React, { useState, useEffect } from 'react'; 
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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Context from './Context';

export default Books = () => {
  const {
    username,
  } = useContext(Context);
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    description: '',
    image_url: '',
  });
  const [bookToDelete, setBookToDelete] = useState('');

  useEffect(() => {
    // Simulamos la obtención de libros
    fetch('http://localhost:8080/bookswap/get_books')
      .then(res => res.json())
      .then(setBooks)
      .catch(console.warn);
  }, []);

  const handleAddBook = async () => {
    if (!user) {
      Alert.alert('Error', 'Debes estar logueado para añadir un libro');
      return;
    }

    // Asignamos automáticamente el username del usuario actual
    const bookData = { ...formData, owner_username: username };

    try {
      const response = await fetch('http://localhost:8080/bookswap/add_book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) throw new Error('Error al añadir libro');

      const newBook = await response.json();
      setBooks([...books, newBook]);

      setFormData({
        title: '',
        author: '',
        genre: '',
        description: '',
        image_url: '',
        owner_username: '', // Limpiar
      });

      setAddModalVisible(false);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDeleteBook = async () => {
    try {
      const response = await fetch('http://localhost:8080/bookswap/delete_book', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: bookToDelete }),
      });

      if (!response.ok) throw new Error('Error al eliminar libro');

      setBooks(books.filter((b) => b.title !== bookToDelete));
      setDeleteModalVisible(false);
    } catch (error) {
      Alert.alert('Error', error.message);
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
      {books.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Añade un libro</Text>
        </View>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.title}
          renderItem={renderBookItem}
          contentContainerStyle={styles.list}
        />
      )}

      <View style={styles.buttonContainer}>
        {books.length < 5 && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => setAddModalVisible(true)}>
            <Text style={styles.buttonText}>Add Book</Text>
          </TouchableOpacity>
        )}
        {books.length > 0 && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: 'red' }]}
            onPress={() => setDeleteModalVisible(true)}>
            <Text style={styles.buttonText}>Delete Book</Text>
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
                <Text>Owner: {selectedBook.owner_username}</Text> {/* Aquí se muestra el username */}
                <Text>
                  Published:{' '}
                  {new Date(selectedBook.publication_date).toDateString()}
                </Text>
              </>
            )}
            <Button title="Cerrar" onPress={() => setDetailModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Modal Añadir Libro */}
      <Modal visible={addModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nuevo Libro</Text>
            {['title', 'author', 'genre', 'description', 'image_url'].map(
              (field) => (
                <TextInput
                  key={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={formData[field]}
                  onChangeText={(text) =>
                    setFormData({ ...formData, [field]: text })
                  }
                  style={styles.input}
                />
              )
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
            <Text style={styles.modalTitle}>Selecciona un libro a eliminar</Text>
            <Picker
              selectedValue={bookToDelete}
              onValueChange={(itemValue) => setBookToDelete(itemValue)}>
              {books.map((book) => (
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
});
