import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import Context from './Context';

export default ChatDetails = () => {
  const route = useRoute();
  const { token } = useContext(Context);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const {
    chatId,
    otherUsername,
    otherUserProfilePicture,
    receiverId,
    senderId,
  } = route.params;

  const navigation = useNavigation();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        `http://3.219.75.18:8080/bookswap/getMessages?chatId=${chatId}&token=${token}`
      );
      const msgs = res.data;

      setMessages(msgs);

      const toMarkViewed = msgs.filter(
        (msg) => msg.receiverId === senderId && msg.status !== 'viewed'
      );

      if (toMarkViewed.length > 0) {
        await axios.post(
          `http://3.219.75.18:8080/bookswap/markMessagesViewed`,
          {
            chatId: chatId,
            receiverId: receiverId,
          }
        );
      }
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  const renderMessage = ({ item }) => {
    const isSender = item.senderId === senderId;

    return (
      <View
        style={[
          styles.messageBubble,
          isSender ? styles.messageRight : styles.messageLeft,
        ]}>
        <Text style={styles.messageText}>{item.content}</Text>
        <View style={styles.metaInfo}>
          <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
          {isSender && (
            <Text
              style={{
                color: item.status === 'viewed' ? 'blue' : 'gray',
                marginLeft: 5,
              }}>
              ✓
            </Text>
          )}
        </View>
      </View>
    );
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;

    const newMsg = {
      chatId: chatId,
      senderId: senderId,
      receiverId: receiverId,
      content: newMessage,
    };

    try {
      await axios.post(`http://3.219.75.18:8080/bookswap/addMessage`, newMsg);
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            setMessages([]);
            setNewMessage('');
            navigation.goBack();
          }}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Image
          source={
            otherUserProfilePicture
              ? { uri: `data:image/png;base64,${otherUserProfilePicture}` }
              : require('../assets/LOGO_BOOKSWAP.png')
          }
          style={styles.avatar}
        />

        <Text style={styles.headerText}>{otherUsername}</Text>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item, index) =>
          item.message_id?.toString() || index.toString()
        }
        renderItem={renderMessage}
        contentContainerStyle={{ padding: 10 }}
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={{ color: 'white' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBEBEB', // gris claro de fondo general
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#FFBD77', // Naranja claro
    borderBottomWidth: 1,
    borderColor: '#B25B00', // Marrón oscuro
    elevation: 3,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: '#B25B00',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  backButton: {
    fontSize: 24,
    marginRight: 12,
    color: '#006838', // verde oscuro
  },

  messageBubble: {
    maxWidth: '75%',
    borderRadius: 16,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  messageLeft: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
    borderColor: '#FFBD77',
    borderWidth: 1,
  },
  messageRight: {
    backgroundColor: '#96cf24', // Verde claro
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
  },
  messageText: {
    fontSize: 15,
    color: '#222',
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 5,
  },
  timestamp: {
    fontSize: 10,
    color: '#777',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#CCCCCC',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 10,
    fontSize: 15,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  sendButton: {
    backgroundColor: '#006838', // Verde oscuro
    marginLeft: 10,
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

