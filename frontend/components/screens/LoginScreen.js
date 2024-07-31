import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Linking , Image, TouchableOpacity} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';

const backendUrl = 'http://localhost:8000/api/oauth/login/';

function LoginScreen({ navigation }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [tokenData, setTokenData] = useState(null);

  useEffect(() => {
    const handleRedirect = async (event) => {
      let { url } = event;
      if (url) {
        const urlParams = new URLSearchParams(url.split('?')[1]);
        const code = urlParams.get('code');
        const state = urlParams.get('state');

        const storedState = await AsyncStorage.getItem('state');

        console.log('urlParams:', urlParams);
        console.log('Code [react]:', code);
        console.log('State [react]:', state);
        console.log('Stored State [react]:', storedState);
        if (state !== storedState) {
          console.error('State mismatch');
          return;
        }

        const callbackUrl = `http://localhost:8000/api/oauth/callback/?code=${code}&state=${state}`;
        try {
          const tokenResponse = await fetch(callbackUrl, {
            method: 'GET',
          });
          if (tokenResponse.status === 200) {
            const tokenData = await tokenResponse.json();
            console.log('Token Data:', tokenData);
            setTokenData(tokenData);
            setLoggedIn(true);
            navigation.navigate('Example', { tokenData });
          } else {
            console.error('Token exchange failed', tokenResponse.status);
          }
        } catch (error) {
          console.error('Failed to complete OAuth flow', error);
        }
      }
    };

    const subscription = Linking.addEventListener('url', handleRedirect);

    return () => {
      subscription.remove();
    };
  }, [navigation]);

  const handleLogin = async () => {
    console.log('Logging in...');
    try {
      const response = await fetch(backendUrl, {
        method: 'GET',
      });
      const data = await response.json();
      const { auth_url, state } = data;

      console.log('auth_url:', auth_url);
      console.log('state [react]:', state);

      await AsyncStorage.setItem('state', state);

      const result = await WebBrowser.openBrowserAsync(auth_url);
      console.log(result);
    } catch (error) {
      console.error('Failed to initiate OAuth flow', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.image} />
      <Text style={styles.title}>Connect your records with VA</Text>
      <Text style={styles.subtitle}>
        US regulations require us to get consent for utilizing your STRs and EHR before we can proceed with our service.
      </Text>
      <View style={styles.infoContainer}>
        <Image source={require('../../assets/logo.png')} style={styles.icon} />
        <Text style={styles.infoText}>We use 128-bit encryption for added security and do not share your data.</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Continue with VA.gov</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', 
  },
  image: {
    width: 200,
    height: 200, 
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    bottom: -50,
    width: '100%',
    padding: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 40,
  },
  icon: {
    width: 24,
    height: 24, 
    marginRight: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    textAlign: 'left',
    lineHeight: 20,
  },
  button: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    backgroundColor: '#004990',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
