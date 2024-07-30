import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Linking, ScrollView } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';

const backendUrl = 'http://localhost:8000/api/oauth/login/';

const scopes = [
  { scope: 'profile', description: 'Granted by default, allows access to a user\'s first and last name and email.' },
  { scope: 'offline_access', description: 'This scope causes the authorization server to provide a refresh token when the access token is requested.' },
  { scope: 'openid', description: 'An id_token is available in the authorization code grant (response_type = code) token response when the \'openid\' scope is used.' },
  { scope: 'disability_rating.read', description: 'View a Veteran\'s VA disability ratings and the effective date of the rating.' },
  { scope: 'service_history.read', description: 'View a Veteran\'s service history including deployments and discharge status.' },
  { scope: 'veteran_status.read', description: 'Confirm the Veteran status of an individual.' }
];

export default function App() {
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

        if (state !== storedState) {
          console.error('State mismatch');
          return;
        }

        const callbackUrl = `http://localhost:8000/api/oauth/callback/?code=${code}&state=${state}`;
        try {
          const tokenResponse = await fetch(callbackUrl, {
            method: 'GET',
          });
          const tokenData = await tokenResponse.json();
          console.log('Token Data:', tokenData);
          setTokenData(tokenData);
          setLoggedIn(true);
        } catch (error) {
          console.error('Failed to complete OAuth flow', error);
        }
      }
    };

    const subscription = Linking.addEventListener('url', handleRedirect);

    return () => {
      subscription.remove();
    };
  }, []);

  const handleLogin = async () => {
    console.log('Logging in...');
    try {
      // Make a request to the backend to initiate the OAuth flow
      const response = await fetch(backendUrl, {
        method: 'GET',
      });
      const data = await response.json();
      const { auth_url, state } = data;

      console.log('state [react]:', state);

      // Store state in AsyncStorage
      await AsyncStorage.setItem('state', state);

      // Open the auth URL in the web browser
      const result = await WebBrowser.openBrowserAsync(auth_url);
      console.log(result);
    } catch (error) {
      console.error('Failed to initiate OAuth flow', error);
    }
  };

  if (loggedIn && tokenData) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Scopes Information</Text>
        {scopes.map((scope, index) => (
          <View key={index} style={styles.scopeContainer}>
            <Text style={styles.scopeTitle}>{scope.scope}</Text>
            <Text style={styles.scopeDescription}>{scope.description}</Text>
          </View>
        ))}
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Login to VA.gov</Text>
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scopeContainer: {
    marginBottom: 20,
  },
  scopeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scopeDescription: {
    fontSize: 16,
  },
});
