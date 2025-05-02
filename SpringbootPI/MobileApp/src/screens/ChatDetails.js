import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { Context } from './Context';

export default ChatDetail = () => {
  const route = useRoute();
  const { chatId, userId } = route.params;
  const { name } = useContext(Context);
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`https://tu-api.com/api/chats/${chatId}/messages`);
      const msgs = res.data;

      setMessages(msgs);

      // Determinar el otro usuario
      if (msgs.length > 0) {
        const sampleMsg = msgs[0];
        const otherId =
          sampleMsg.sender_id === userId
            ? sampleMsg.receiver_id
            : sampleMsg.sender_id;
        setOtherUser(otherId);
      }

      // Marcar como vistos si hay mensajes para este usuario
      const toMarkViewed = msgs.filter(
        (msg) => msg.receiver_id === userId && msg.status !== 'viewed'
      );

      if (toMarkViewed.length > 0) {
        await axios.post(`https://tu-api.com/api/chats/${chatId}/mark-viewed`, {
          userId,
        });
      }
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  const renderMessage = ({ item }) => {
    const isSender = item.sender_id === userId;

    return (
      <View
        style={[
          styles.messageBubble,
          isSender ? styles.messageRight : styles.messageLeft,
        ]}
      >
        <Text style={styles.messageText}>{item.content}</Text>
        <View style={styles.metaInfo}>
          <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
          {isSender && (
            <Text
              style={{
                color: item.status === 'viewed' ? 'blue' : 'gray',
                marginLeft: 5,
              }}
            >
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
      sender_id: userId,
      receiver_id: otherUser,
      content: newMessage,
      timestamp: new Date().toISOString(),
      status: 'delivered',
    };

    try {
      await axios.post(`https://tu-api.com/api/chats/${chatId}/messages`, newMsg);
      setMessages((prev) => [...prev, newMsg]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <View style={styles.container}>
      {/* Cabecera */}
      <View style={styles.header}>
        <Image
          source={{ uri: `https://tu-api.com/users/${otherUser}/avatar` }}
          style={styles.avatar}
        />
        <Text style={styles.headerText}>Usuario {otherUser}</Text>
      </View>

      {/* Mensajes */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.message_id}
        renderItem={renderMessage}
        contentContainerStyle={{ padding: 10 }}
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Escribe un mensaje..."
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={{ color: 'white' }}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerText: { fontSize: 16, fontWeight: 'bold' },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 12,
    padding: 10,
    marginVertical: 4,
  },
  messageLeft: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
  },
  messageRight: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
  },
  messageText: { fontSize: 14 },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timestamp: { fontSize: 10, color: '#555' },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    backgroundColor: '#eee',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    marginLeft: 8,
    borderRadius: 20,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
});

