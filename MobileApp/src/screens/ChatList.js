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

const ChatList = () => {
  const { username, token, usersInfo, setUsersInfo } = useContext(Context);
  const [chats, setChats] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Llamar a fetchUserInfosIfNeeded y luego fetchChats
    fetchUserInfosIfNeeded();
  }, []);

  // Cargar la información de los usuarios si es necesario
  const fetchUserInfosIfNeeded = async () => {
    if (usersInfo.length === 0) {
      try {
        const response = await axios.get(
          `http://localhost:8080/bookswap/getUsersInfo?token=${token}`
        );
        setUsersInfo(response.data);
        fetchChats(response.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    } else {
      fetchChats(usersInfo);
    }
  };

  const fetchChats = async (userInfos) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/bookswap/getChats?username=${username}`
      );
      const chatsData = response.data;

      const updatedChats = chatsData.map((chat) => {
        const otherUserUsername = chat.participants.find(
          (participant) => participant !== username
        );

        const otherUser = userInfos.find(
          (user) => user.username === otherUserUsername
        );

        return {
          ...chat,
          otherUserProfilePicture: otherUser?.profilePicture || null,
          otherUser: {
            username: otherUser?.username || 'Usuario Desconocido',
            id: otherUser?.id || otherUser?._id || null, // 👈 Asegúrate de incluir el ID
          },
        };
      });

      setChats(updatedChats);
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  // Renderizar cada chat
  const renderItem = ({ item }) => {
    const lastMessage = item.last_message || {};

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() =>
          navigation.navigate('ChatDetail', {
            chatId: item._id,
            otherUsername: item.otherUser?.username,
            otherUserProfilePicture: item.otherUserProfilePicture,
            receiverId: item.otherUser?.id, // 👈 Este es el usuario con quien estoy hablando
            senderId: usersInfo.find((u) => u.username === username)?.id, // 👈 Este eres tú (emisor)
          })
        }>
        <Image
          source={
            item.otherUserProfilePicture
              ? { uri: `data:image/png;base64,${item.otherUserProfilePicture}` }
              : require('../assets/LOGO_BOOKSWAP.png')
          }
          style={styles.avatar}
        />
        <View style={styles.chatInfo}>
          <Text style={styles.userName}>
            {item.otherUser?.username || 'Usuario Desconocido'}
          </Text>
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  chatInfo: { flex: 1 },
  userName: { fontWeight: 'bold', fontSize: 16 },
  lastMessage: { color: '#555', marginTop: 4 },
  timestamp: { fontSize: 12, color: '#888' },
});

export default ChatList;
