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
    initializeChats();
  }, []);

  const initializeChats = async () => {
    try {
      let userInfos = usersInfo;

      // Si no tenemos info de usuarios, la pedimos
      if (userInfos.length === 0) {
        const response = await axios.get(
          `http://3.219.75.18:8080/bookswap/getUsersInfo?token=${token}`
        );
        userInfos = response.data;
        setUsersInfo(userInfos);
      }

      // Creamos chats con todos los usuarios (excepto uno mismo)
      const otherUsernames = userInfos
        .map((user) => user.username)
        .filter((uname) => uname !== username);

      await axios.post('http://3.219.75.18:8080/bookswap/createChats', {
        currentUsername: username,
        usernames: otherUsernames,
      });

      // Cargamos los chats
      await fetchChats(userInfos);
    } catch (error) {
      console.error('Error inicializando chats:', error);
    }
  };

  const fetchChats = async (userInfos) => {
    try {
      const response = await axios.get(
        `http://3.219.75.18:8080/bookswap/getChats?username=${username}&token=${token}`
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
            id: otherUser?.id || otherUser?._id || null,
          },
        };
      });

      setChats(updatedChats);
    } catch (error) {
      console.error('Error cargando chats:', error);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const renderItem = ({ item }) => {
    const lastMessage = item.last_message || {};

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() =>
          navigation.navigate('ChatDetails', {
            chatId: item._id,
            otherUsername: item.otherUser?.username,
            otherUserProfilePicture: item.otherUserProfilePicture,
            receiverId: item.otherUser?.id,
            senderId: usersInfo.find((u) => u.username === username)?.id,
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
