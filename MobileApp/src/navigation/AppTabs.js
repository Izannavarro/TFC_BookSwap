
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import Books from '../screens/Books';
import Exchanges from '../screens/Exchanges';
import Chat from '../screens/ChatList';
import Settings from '../screens/Settings';

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Books" component={Books} />
      <Tab.Screen name="Exchanges" component={Exchanges} />
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}
