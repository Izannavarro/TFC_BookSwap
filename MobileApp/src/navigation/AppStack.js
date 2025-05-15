
import { createStackNavigator } from '@react-navigation/stack';
import AppTabs from './AppTabs';
import ChatDetails from '../screens/ChatDetails';

const Stack = createStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={AppTabs} />
      <Stack.Screen name="ChatDetails" component={ChatDetails} /> 
    </Stack.Navigator>
  );
}
