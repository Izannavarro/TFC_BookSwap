
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import Books from '../screens/Books';
import Exchanges from '../screens/Exchanges';
import Chat from '../screens/ChatList';
import Settings from '../screens/Settings';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator
  screenOptions={({ route }) => ({
    headerShown: false,
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;

      if (route.name === 'Home') {
        iconName = focused ? 'home' : 'home-outline';
      } else if (route.name === 'Books') {
        iconName = focused ? 'book-open' : 'book-outline';
      } else if (route.name === 'Exchanges') {
        iconName = focused ? 'swap-horizontal' : 'swap-horizontal-outline';
      } else if (route.name === 'Chat') {
        iconName = focused ? 'chat' : 'chat-outline';
      } else if (route.name === 'Settings') {
        iconName = focused ? 'cog' : 'cog-outline';
      }

      // Retorna el icono con tamaño y color adecuado
      return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: '#96cf24', // color activo
    tabBarInactiveTintColor: '#FFBD77',  // color inactivo
  })}
>
  <Tab.Screen name="Home" component={Home} />
  <Tab.Screen name="Books" component={Books} />
  <Tab.Screen name="Exchanges" component={Exchanges} />
  <Tab.Screen name="Chat" component={Chat} />
  <Tab.Screen name="Settings" component={Settings} />
</Tab.Navigator>
  );
}
