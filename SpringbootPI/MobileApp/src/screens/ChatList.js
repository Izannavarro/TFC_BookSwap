import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Context from './Context'; 

export default ChatList = () => {
  const { name } = useContext(Context); // Suponiendo que "name" es el userId
  const userId = name;
  const [chats, setChats] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    if (userId) {
      fetchChats();
    }
  }, [userId]);

  const fetchChats = async () => {
    try {
      const response = await axios.get(`https://tu-api.com/api/chats/${userId}`);
      setChats(response.data);
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  };

  const getOtherParticipant = (participants) => {
    return participants.find((id) => id !== userId);
  };

  const renderItem = ({ item }) => {
    const otherUserId = getOtherParticipant(item.participants);
    const lastMessage = item.last_message || {};

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() =>
          navigation.navigate('ChatDetail', {
            chatId: item._id,
            userId,
          })
        }
      >
        <Image
          source={{ uri: `https://tu-api.com/users/${otherUserId}/avatar` }}
          style={styles.avatar}
        />
        <View style={styles.chatInfo}>
          <Text style={styles.userName}>Usuario {otherUserId}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {lastMessage.content || 'Sin mensajes'}
          </Text>
        </View>
        <Text style={styles.timestamp}>
          {lastMessage.timestamp ? formatTime(lastMessage.timestamp) : ''}
        </Text>
      </TouchableOpacity>
    );
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
    </View>
  );
};