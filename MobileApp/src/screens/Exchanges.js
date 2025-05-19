import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  Button,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
  const [loadingUserBooks, setLoadingUserBooks] = useState(true);
  const [loadingUsersInfo, setLoadingUsersInfo] = useState(true);
  const [selectedReceiverUsername, setSelectedReceiverUsername] = useState('');

  const { token, username, usersInfo, setUsersInfo, userBooks, setUserBooks } =
    useContext(Context);

  useEffect(() => {
    setLoadingUserBooks(true);
    setLoadingUsersInfo(true);

    fetch(
      `http://3.219.75.18:8080/bookswap/getBooks?ownerUsername=${username}&token=${token}`
    )
      .then((res) => res.json())
      .then((data) => {
        setUserBooks(data);
        setLoadingUserBooks(false);
      })
      .catch(() => setLoadingUserBooks(false));

    fetch(`http://3.219.75.18:8080/bookswap/getUsersInfo?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        setUsersInfo(data);
        setLoadingUsersInfo(false);
      })
      .catch(() => setLoadingUsersInfo(false));

    fetchMyExchanges();
  }, [username, token]);

  useEffect(() => {
    if (
      route.params?.showCreateModal &&
      !loadingUserBooks &&
      !loadingUsersInfo
    ) {
      setTargetUser(route.params.selectedUser || null);
      setFormVisible(true);
    }
  }, [route.params, loadingUserBooks, loadingUsersInfo]);

  const fetchMyExchanges = () => {
    fetch(
      `http://3.219.75.18:8080/bookswap/getMyExchanges?ownerUsername=${username}&token=${token}`
    )
      .then((res) => res.json())
      .then((exchangesData) => setExchanges(exchangesData))
      .catch(console.warn);

    console.log(exchanges);
  };

  const renderStatus = (status) => {
    switch (status) {
      case 'pending':
        return <Icon name="clock-outline" size={24} color="orange" />;
      case 'accepted':
        return <Icon name="clock-check-outline" size={24} color="green" />;
      case 'denied':
        return (
          <TouchableOpacity
            style={styles.deniedButton}
            onPress={() => Alert.alert('Exchange denied')}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Denied</Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  const updateExchangeStatus = async (exchangeId, ownerId, newStatus) => {
    try {
      const exchange = receivedExchanges.find((ex) => ex._id === exchangeId);
      if (!exchange) {
        Alert.alert('Error', 'Exchange not found.');
        return;
      }

      await fetch(`http://3.219.75.18:8080/bookswap/updateExchangeStatus`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: exchangeId, ownerId, status: newStatus }),
      });

      fetchReceivedExchanges();

      Alert.alert('Success', `Exchange  ${newStatus}`);
    } catch (err) {
      Alert.alert(
        'Error',
        'Could not update status or remove the book.'
      );
    }
  };

  const fetchReceivedExchanges = async () => {
    try {
      const response = await fetch(
        `http://3.219.75.18:8080/bookswap/getReceivedExchanges?receiverUsername=${username}&token=${token}`
      );
      const data = await response.json();
      setReceivedExchanges(data);
      setReceivedModalVisible(true);
    } catch (error) {
      Alert.alert('Error', 'Could not load received exchanges.');
    }
  };

  const handleCreateExchange = async () => {
    const receiverName = targetUser?.username || selectedReceiverUsername;

    if (!offeredBook || !receiverName) {
      Alert.alert('Error', 'Please select a book and a receiver.');
      return;
    }

    const data = {
      bookTitle: offeredBook,
      ownerName: username,
      receiverName: receiverName,
      status: 'Pending',
    };

    try {
      const res = await fetch(
        'http://3.219.75.18:8080/bookswap/addExchange?token=' + token,
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
      setTargetUser(null);
      setSelectedReceiverUsername('');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const getUser = (userId) => {
    return usersInfo.find((user) => user.id === userId || user._id === userId);
  };

  const getBookById = (bookId) => {
    return userBooks.find((book) => book.id === bookId || book._id === bookId);
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
          {book?.image_url ? (
            <Image source={{ uri: book.image_url }} style={styles.bookImage} />
          ) : (
            <Text>No image</Text>
          )}
          <Text style={styles.label}>
            <Icon name="book-open-page-variant" size={14} /> Book:
          </Text>
          <Text>{book?.title || 'Unknown Book'}</Text>
          <Text style={styles.label}>
            <Icon name="calendar" size={14} /> Date:
          </Text>
          <Text>{new Date(item.exchange_date).toLocaleString()}</Text>
        </View>
        <View style={styles.right}>
          {receiver ? (
            <>
              <Image
                source={{
                  uri: `data:image/png;base64,${receiver.profilePicture}`,
                }}
                style={styles.avatar}
              />
              <Text style={styles.label}>
                <Icon name="account" size={14} /> Receiver:
              </Text>
              <Text>{receiver.username || 'Unknown User'}</Text>
            </>
          ) : (
            <Text>No receiver data</Text>
          )}
          <View style={{ marginTop: 8 }}>
            {renderStatus(item.status, item._id)}
          </View>
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

      {!loadingUserBooks && !loadingUsersInfo && (
        <View style={styles.buttonContainer}>
          {userBooks.length === 0 ? (
            <Text style={styles.errorText}>
              You need to Add 1 Book to do an Exchange
            </Text>
          ) : usersInfo.length === 0 ? (
            <Text style={styles.errorText}>
              There are no Users Near Your Location
            </Text>
          ) : (
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => setFormVisible(true)}>
              <Icon name="plus-box" size={20} color="#fff" />
              <Text style={styles.buttonText}> Create Exchange</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.createButton, styles.pendingButton]}
            onPress={fetchReceivedExchanges}>
            <Icon name="clock-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}> Pending Exchanges</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal Crear */}
      <Modal visible={formVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Exchange</Text>

            {targetUser?.username && (
              <Text style={styles.label}>With: {targetUser.username}</Text>
            )}

            <Text style={styles.label}>Select Book:</Text>
            <Picker
              selectedValue={offeredBook}
              onValueChange={(itemValue) => setOfferedBook(itemValue)}
              style={styles.picker}>
              <Picker.Item label="Select a book" value="" />
              {userBooks.map((book) => (
                <Picker.Item
                  key={book._id}
                  label={book.title}
                  value={book.title}
                />
              ))}
            </Picker>

            {!targetUser && (
              <>
                <Text style={styles.label}>Select Receiver:</Text>
                <Picker
                  selectedValue={selectedReceiverUsername}
                  onValueChange={(itemValue) =>
                    setSelectedReceiverUsername(itemValue)
                  }
                  style={styles.picker}>
                  <Picker.Item label="Select a user" value="" />
                  {usersInfo
                    .filter((user) => user.username !== username)
                    .map((user) => (
                      <Picker.Item
                        key={user._id}
                        label={user.username}
                        value={user.username}
                      />
                    ))}
                </Picker>
              </>
            )}

            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateExchange}>
              <Text style={styles.buttonText}>Create</Text>
            </TouchableOpacity>
            <Button
              title="Cancel"
              color="gray"
              onPress={() => {
                setFormVisible(false);
                setOfferedBook('');
                setTargetUser(null);
                setSelectedReceiverUsername('');
              }}
            />
          </View>
        </View>
      </Modal>

      {/* Modal de intercambios recibidos */}
      <Modal visible={receivedModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pending Exchanges</Text>
            {receivedExchanges.length === 0 ? (
              <Text style={styles.emptyText}>
                You aren't waiting for any exchange.
              </Text>
            ) : (
              receivedExchanges.map((ex, i) => (
                <View key={i} style={{ marginBottom: 10 }}>
                  <AsyncBookTitle
                    exchange={ex}
                    usersInfo={usersInfo}
                    token={token}
                  />
                  <Text>{new Date(ex.exchange_date).toLocaleString()}</Text>
                  <View style={styles.acceptDenyButtons}>
                    <TouchableOpacity
                      style={[
                        styles.createButton,
                        { backgroundColor: '#6C63FF' },
                      ]}
                      onPress={() =>
                        updateExchangeStatus(ex._id, ex.owner_id, 'accepted')
                      }>
                      <Text style={styles.buttonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.createButton,
                        { backgroundColor: '#FF4D4D' },
                      ]}
                      onPress={() =>
                        updateExchangeStatus(ex._id, ex.owner_id, 'denied')
                      }>
                      <Text style={styles.buttonText}>Deny</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => {
                setReceivedModalVisible(false);
                setReceivedExchanges([]);
              }}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const AsyncBookTitle = ({ exchange, usersInfo, token }) => {
  const [title, setTitle] = useState('Loading...');

  useEffect(() => {
    const fetchTitle = async () => {
      const ownerUser = usersInfo.find(
        (user) =>
          user.id === exchange.owner_id || user._id === exchange.owner_id
      );
      if (!ownerUser) return setTitle('User not Found');

      const books = await fetch(
        `http://3.219.75.18:8080/bookswap/getBooks?ownerUsername=${ownerUser.username}&token=${token}`
      ).then((res) => res.json());

      const book = books.find(
        (b) => b.id === exchange.book_id || b._id === exchange.book_id
      );

      setTitle(book?.title || 'Title not available');
    };

    fetchTitle();
  }, [exchange, usersInfo, token]);

  return <Text>{title}</Text>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9F9FC',
  },
  exchangeItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  left: {
    flex: 1,
  },
  right: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontWeight: '600',
    marginTop: 4,
    color: '#333',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  createButton: {
    backgroundColor: '#96cf24',
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
  pendingButton: {
    backgroundColor: '#FFBD77',
    shadowColor: '#B25B00',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    width: '90%',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 18,
    color: '#006838', // Verde oscuro
    textAlign: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
    marginVertical: 10,
  },
  bookImage: {
    width: 70,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'center',
    resizeMode: 'cover',
  },
  acceptDenyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 12,
  },
  errorText: {
    color: '#B25B00', // Naranja oscuro
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  deniedButton: {
    backgroundColor: '#B25B00', // Naranja oscuro
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
