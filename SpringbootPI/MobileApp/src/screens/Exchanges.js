import React, { useEffect, useState } from 'react';
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

export default Exchanges = () => {
  const [exchanges, setExchanges] = useState([]);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  const [formData, setFormData] = useState({
    book_id: '',
    owner_id: '',
    receiver_id: '',
  });

  useEffect(() => {
    fetch('http://localhost:8080/bookswap/get_exchanges')
      .then(res => res.json())
      .then(setExchanges)
      .catch(console.warn);

    fetch('http://localhost:8080/bookswap/get_books')
      .then(res => res.json())
      .then(setBooks)
      .catch(console.warn);

    fetch('http://localhost:8080/bookswap/get_users')
      .then(res => res.json())
      .then(setUsers)
      .catch(console.warn);
  }, []);

  const getBookTitle = (bookId) => {
    const book = books.find(b => b._id === bookId);
    return book ? book.title : 'Unknown Book';
  };

  const getUser = (userId) => users.find(u => u._id === userId);

  const handleCreateExchange = async () => {
    try {
      const res = await fetch('http://localhost:8080/bookswap/add_exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to create exchange');
      const newExchange = await res.json();
      setExchanges([...exchanges, newExchange]);
      setFormVisible(false);
      setFormData({ book_id: '', owner_id: '', receiver_id: '' });
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const renderItem = ({ item }) => {
    const receiver = getUser(item.receiver_id);
    return (
      <TouchableOpacity
        style={styles.exchangeItem}
        onPress={() => {
          setSelectedExchange(item);
          setModalVisible(true);
        }}>
        <View style={styles.left}>
          <Text style={styles.label}>Book:</Text>
          <Text>{getBookTitle(item.book_id)}</Text>
          <Text style={styles.label}>Date:</Text>
          <Text>{new Date(item.exchange_date).toLocaleString()}</Text>
        </View>
        <View style={styles.right}>
          {receiver && (
            <>
              <Image
                source={{ uri: `data:image/png;base64,${receiver.profilePicture}` }}
                style={styles.avatar}
              />
              <Text style={styles.label}>Receiver:</Text>
              <Text>{receiver.name}</Text>
            </>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={exchanges}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.createButton} onPress={() => setFormVisible(true)}>
          <Text style={styles.buttonText}>Create Exchange</Text>
        </TouchableOpacity>
      </View>

      {/* Modal Detalles */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedExchange && (
              <>
                <Text style={styles.modalTitle}>Exchange Details</Text>
                <Text><Text style={styles.label}>Book:</Text> {getBookTitle(selectedExchange.book_id)}</Text>
                <Text><Text style={styles.label}>Owner ID:</Text> {selectedExchange.owner_id}</Text>
                <Text><Text style={styles.label}>Receiver ID:</Text> {selectedExchange.receiver_id}</Text>
                <Text><Text style={styles.label}>Date:</Text> {new Date(selectedExchange.exchange_date).toLocaleString()}</Text>
              </>
            )}
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Modal Crear Intercambio */}
      <Modal visible={formVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Exchange</Text>

            <Text style={styles.label}>Book</Text>
            <Picker
              selectedValue={formData.book_id}
              onValueChange={(val) => setFormData({ ...formData, book_id: val })}>
              <Picker.Item label="Select a book" value="" />
              {books.map(book => (
                <Picker.Item key={book._id} label={book.title} value={book._id} />
              ))}
            </Picker>

            <Text style={styles.label}>Owner</Text>
            <Picker
              selectedValue={formData.owner_id}
              onValueChange={(val) => setFormData({ ...formData, owner_id: val })}>
              <Picker.Item label="Select owner" value="" />
              {users.map(user => (
                <Picker.Item key={user._id} label={user.name} value={user._id} />
              ))}
            </Picker>

            <Text style={styles.label}>Receiver</Text>
            <Picker
              selectedValue={formData.receiver_id}
              onValueChange={(val) => setFormData({ ...formData, receiver_id: val })}>
              <Picker.Item label="Select receiver" value="" />
              {users.map(user => (
                <Picker.Item key={user._id} label={user.name} value={user._id} />
              ))}
            </Picker>

            <Button title="Create" onPress={handleCreateExchange} />
            <Button title="Cancel" color="gray" onPress={() => setFormVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  exchangeItem: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flex: 1,
  },
  right: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 6,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  createButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    width: '90%',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
});
