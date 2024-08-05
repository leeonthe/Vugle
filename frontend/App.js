import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LogoScreen from './components/screens/LogoScreen';
import OnboardingScreen from './components/screens/OnboardingScreen';
import LoginScreen from './components/screens/LoginScreen';
import UserStartScreen from './components/screens/UserStartScreen';
import HomePage from './components/screens/HomePageScreen';
import ExplorePageScreen from './components/screens/home-screens/ExplorePageScreen';
import ConsultPageScreen from './components/screens/home-screens/ConsultPageScreen';
import LoanPageScreen from './components/screens/home-screens/LoanPageScreen';
import StatsDisabilityPage from './components/screens/home-screens/StatsDisabilityPage';
import StatsCompPage from './components/screens/home-screens/StatsCompPage';
import AllPageScreen from './components/screens/home-screens/AllPageScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Logo">
        <Stack.Screen name="Logo" component={LogoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UserStart" component={UserStartScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HomePage" component={HomePage} options={{ headerShown: false }} />
        <Stack.Screen name="ExplorePageScreen" component={ExplorePageScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ConsultPageScreen" component={ConsultPageScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LoanPageScreen" component={LoanPageScreen} options={{ headerShown: false }} />
        <Stack.Screen name="StatsDisabilityPage" component={StatsDisabilityPage} options={{ headerShown: false }} />
        <Stack.Screen name="StatsCompPage" component={StatsCompPage} options={{ headerShown: false }} />
        <Stack.Screen name="AllPageScreen" component={AllPageScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
