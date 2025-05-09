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
  Alert,
  Button,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRoute } from '@react-navigation/native';
import Context from './Context';

export default Exchanges = () => {
  const route = useRoute();

  const [exchanges, setExchanges] = useState([]);
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [targetUser, setTargetUser] = useState(null);
  const [offeredBook, setOfferedBook] = useState('');
  const [receivedExchanges, setReceivedExchanges] = useState([]);
  const [receivedModalVisible, setReceivedModalVisible] = useState(false);
  const { token, username, usersInfo, setUsersInfo, userBooks, setUserBooks } =
    useContext(Context);

  useEffect(() => {
    fetchMyExchanges();

    if (!userBooks || userBooks.length === 0) {
      fetch(
        `http://localhost:8080/bookswap/getBooks?ownerUsername=${username}&token=${token}`
      )
        .then((res) => res.json())
        .then(setUserBooks)
        .catch(console.warn);
    }

    if (!usersInfo || usersInfo.length === 0) {
      fetch(`http://localhost:8080/bookswap/getUsersInfo?token=${token}`)
        .then((res) => res.json())
        .then(setUsersInfo)
        .catch(console.warn);
    }
  }, []);

  useEffect(() => {
    if (route.params?.showCreateModal) {
      setTargetUser(route.params.selectedUser || null);
      setFormVisible(true);
    }
  }, [route.params]);

  const fetchMyExchanges = () => {
    fetch(
      `http://localhost:8080/bookswap/getMyExchanges?ownerUsername=${username}&token=${token}`
    )
      .then((res) => res.json())
      .then(setExchanges)
      .catch(console.warn);
  };

  const getBookById = (bookId) => {
    return userBooks.find((book) => book._id === bookId);
  };

  const getUser = (userId) => usersInfo.find((u) => u._id === userId);

  const fetchReceivedExchanges = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/bookswap/getReceivedExchanges?receiverUsername=${username}&token=${token}`
      );
      const data = await response.json();
      setReceivedExchanges(data);
      setReceivedModalVisible(true);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los intercambios recibidos.');
    }
  };

  const updateExchangeStatus = async (exchangeId, newStatus) => {
    try {
      await fetch(`http://localhost:8080/bookswap/updateExchangeStatus`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exchangeId, status: newStatus }),
      });
      setReceivedExchanges((prev) =>
        prev.filter((exchange) => exchange._id !== exchangeId)
      );
    } catch (err) {
      Alert.alert('Error', 'No se pudo actualizar el estado.');
    }
  };

  const handleCreateExchange = async () => {
    if (!offeredBook || !targetUser) {
      Alert.alert('Error', 'Por favor selecciona el libro ofrecido.');
      return;
    }

    const data = {
      bookTitle: offeredBook,
      ownerName: username,
      receiverName: targetUser.username,
    };

    try {
      const res = await fetch(
        'http://localhost:8080/bookswap/addExchange?token=' + token,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) throw new Error('Failed to create exchange');
      await res.json();
      fetchMyExchanges();
      setFormVisible(false);
      setOfferedBook('');

      // Eliminar el libro del backend
      await fetch('http://localhost:8080/bookswap/deleteBook', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: offeredBook,
          owner_username: username,
        }),
      });
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const renderItem = ({ item }) => {
    const receiver = getUser(item.receiver_id);
    const book = getBookById(item.book_id);

    return (
      <TouchableOpacity
        style={styles.exchangeItem}
        onPress={() => {
          setSelectedExchange(item);
          setModalVisible(true);
        }}>
        <View style={styles.left}>
          {book?.image && (
            <Image
              source={{ uri: `data:image/png;base64,${book.image}` }}
              style={styles.bookImage}
            />
          )}
          <Text style={styles.label}>Book:</Text>
          <Text>{book?.title || 'Unknown Book'}</Text>
          <Text style={styles.label}>Date:</Text>
          <Text>{new Date(item.exchange_date).toLocaleString()}</Text>
        </View>
        <View style={styles.right}>
          {receiver && (
            <>
              <Image
                source={{
                  uri: `data:image/png;base64,${receiver.profilePicture}`,
                }}
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
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setFormVisible(true)}>
          <Text style={styles.buttonText}>Create Exchange</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.createButton,
            { backgroundColor: '#FF9800', marginTop: 10 },
          ]}
          onPress={fetchReceivedExchanges}>
          <Text style={styles.buttonText}>Pending Exchanges</Text>
        </TouchableOpacity>
      </View>

      {/* Modal detalles */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedExchange && (
              <>
                <Text style={styles.modalTitle}>Exchange Details</Text>
                {getBookById(selectedExchange.book_id)?.image && (
                  <Image
                    source={{
                      uri: `data:image/png;base64,${
                        getBookById(selectedExchange.book_id).image
                      }`,
                    }}
                    style={styles.bookImage}
                  />
                )}
                <Text>
                  <Text style={styles.label}>Book:</Text>{' '}
                  {getBookById(selectedExchange.book_id)?.title ||
                    'Unknown Book'}
                </Text>
                <Text>
                  <Text style={styles.label}>Owner ID:</Text>{' '}
                  {selectedExchange.owner_id}
                </Text>
                <Text>
                  <Text style={styles.label}>Receiver ID:</Text>{' '}
                  {selectedExchange.receiver_id}
                </Text>
                <Text>
                  <Text style={styles.label}>Date:</Text>{' '}
                  {new Date(selectedExchange.exchange_date).toLocaleString()}
                </Text>
              </>
            )}
            <Button
              title="Close"
              onPress={() => {
                setSelectedExchange(null);
                setModalVisible(false);
              }}
            />
          </View>
        </View>
      </Modal>

      {/* Modal crear intercambio */}
      <Modal visible={formVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Exchange</Text>
            <Text style={styles.label}>
              Con: {targetUser?.username || 'Usuario no seleccionado'}
            </Text>

            <TextInput
              placeholder="Tu libro ofrecido"
              style={styles.input}
              value={offeredBook}
              onChangeText={setOfferedBook}
            />
            <Button title="Crear" onPress={handleCreateExchange} />
            <Button
              title="Cancelar"
              color="gray"
              onPress={() => {
                setFormVisible(false);
                setOfferedBook('');
                setTargetUser(null);
              }}
            />
          </View>
        </View>
      </Modal>

      {/* Modal de intercambios recibidos */}
      <Modal visible={receivedModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Intercambios Pendientes</Text>
            {receivedExchanges.length === 0 ? (
              <Text>No tienes intercambios pendientes.</Text>
            ) : (
              receivedExchanges.map((ex, i) => (
                <View key={i} style={{ marginBottom: 10 }}>
                  <Text>{getBookTitle(ex.book_id)}</Text>
                  <Text>{new Date(ex.exchange_date).toLocaleString()}</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Button
                      title="Accept"
                      onPress={() => updateExchangeStatus(ex._id, 'accepted')}
                    />
                    <Button
                      title="Deny"
                      onPress={() => updateExchangeStatus(ex._id, 'denied')}
                    />
                  </View>
                </View>
              ))
            )}
            <Button
              title="Cerrar"
              onPress={() => {
                setReceivedModalVisible(false);
                setReceivedExchanges([]);
              }}
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
  },
  bookImage: {
    width: 70,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'center',
  },
});
