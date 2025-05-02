
import { createStackNavigator } from '@react-navigation/stack';
import AppTabs from './AppTabs';

const Stack = createStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={AppTabs} />
    </Stack.Navigator>
  );
}
