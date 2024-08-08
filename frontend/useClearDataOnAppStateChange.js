import { useEffect } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useClearDataOnAppStateChange = () => {
  useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      if (nextAppState === 'inactive' || nextAppState === 'background') {
        // Clear all relevant data when app goes to background or inactive state
        console.log('App is going to background or inactive state, clearing user data...');
        await clearUserData();
      }
    };

    const clearUserData = async () => {
      try {
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('letters_access_token');
        // Remove other user-related data as needed
        console.log('User data cleared successfully');
      } catch (error) {
        console.error('Error clearing user data', error);
      }
    };

    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
      console.log('App is being reloaded or stopped, clearing user data...');
      clearUserData();
    };
  }, []);
};

export default useClearDataOnAppStateChange;
