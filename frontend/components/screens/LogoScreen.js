import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import LOGO from '../../assets/assets-userStart/logo.svg';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

function LogoScreen({ navigation }) {
  useEffect(() => {
    // Fetch the CSRF token when the app starts
    const fetchCSRFToken = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/get-csrf-token/');
        const csrfToken = response.data.csrf_token;
        // Save the CSRF token in AsyncStorage
        await AsyncStorage.setItem('csrf_token', csrfToken);
        console.log('CSRF token saved:', csrfToken);
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    // Call the function to fetch CSRF token
    fetchCSRFToken();

    // Redirect to the Onboarding screen after 2 seconds
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2000); 

    // Cleanup the timer
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <LOGO></LOGO>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', 
  },
  logo: {
    width: 200,
    height: 200, 
  },
});

export default LogoScreen;
