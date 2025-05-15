import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Context from './Context';

const ChatList = () => {
  const { username, token, usersInfo, setUsersInfo, picture } = useContext(Context);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    initializeChats();
  }, []);

  const initializeChats = async () => {
  try {
    
    const response = await axios.get(
      `http://3.219.75.18:8080/bookswap/getUsersInfo?token=${token}`
    );
    const userInfos = response.data || [];
    setUsersInfo(userInfos);

    if (userInfos.length === 0) {
      console.warn('No se pudo obtener información de usuarios.');
      setLoading(false);
      return;
    }

    const otherUsernames = userInfos
      .map((user) => user.username)
      .filter((uname) => uname !== username);

    await axios.post('http://3.219.75.18:8080/bookswap/createChats', {
      currentUsername: username,
      usernames: otherUsernames,
    });

    await fetchChats(userInfos);
  } catch (error) {
    console.error('Error inicializando chats:', error);
  } finally {
    setLoading(false);
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

  const currentUserInfo = usersInfo.find((u) => u.username === username);

  const renderItem = ({ item }) => {
    const lastMessage = item.last_message || {};

    const canNavigate = item.otherUser?.id && currentUserInfo?.id && item._id;

    const otherUserProfilePicture = item.otherUserProfilePicture;
    const isValidBase64 =
      otherUserProfilePicture && otherUserProfilePicture.length > 0;

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => {
          if (!canNavigate) {
            alert(
              'No se puede acceder a este chat porque faltan datos del usuario.'
            );
            return;
          }

          const chatParams = {
            chatId: item._id,
            otherUsername: item.otherUser?.username,
            otherUserProfilePicture: otherUserProfilePicture,
            receiverId: item.otherUser?.id,
            senderId: currentUserInfo?.id,
          };

          console.log('Navegando a ChatDetails con:', chatParams);

          navigation.navigate('ChatDetails', chatParams);
        }}>
        <Image
          source={
            isValidBase64
              ? { uri: `data:image/png;base64,${otherUserProfilePicture}` }
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
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={
            picture
              ? {
                  uri: picture,
                }
              : require('../assets/LOGO_BOOKSWAP.png')
          }
          style={styles.headerAvatar}
        />
        <View>
          <Text style={styles.headerTitle}>My Chats</Text>
          <Text style={styles.headerSubtitle}>{username}</Text>
        </View>
      </View>

      {/* Chat List */}
      {loading ? (
        <Text style={styles.noChatsText}>Cargando chats...</Text>
      ) : chats.length === 0 ? (
        <Text style={styles.noChatsText}>No hay chats disponibles</Text>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.chatList}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBEBEB', // Gris claro
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#006838', // Verde oscuro
    borderBottomWidth: 1,
    borderBottomColor: '#B25B00', // Marrón oscuro
    elevation: 4,
  },
  headerAvatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#FFBD77', // Naranja
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFBD77', // Naranja
  },
  chatList: {
    paddingBottom: 20,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: '#96cf24', // Verde claro
  },
  chatInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#006838', // Verde oscuro
  },
  lastMessage: {
    color: '#444',
    marginTop: 4,
    fontSize: 14,
  },
  timestamp: {
    fontSize: 12,
    color: '#B25B00', // Marrón oscuro
    marginLeft: 6,
  },
  noChatsText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#777',
    fontSize: 16,
  },
});


export default ChatList;
