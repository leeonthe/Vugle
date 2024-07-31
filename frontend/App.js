import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LogoScreen from './components/screens/LogoScreen';
import OnboardingScreen from './components/screens/OnboardingScreen';
import LoginScreen from './components/screens/LoginScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Logo">
        <Stack.Screen name="Logo" component={LogoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
       
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
