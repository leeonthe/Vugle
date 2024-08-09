import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';

const backendUrl = 'http://localhost:8000/api/oauth/login/';

const LoginScreen = () => {
  const [authUrl, setAuthUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [showWebView, setShowWebView] = useState(false);
  const navigation = useNavigation();

  const clearStoredTokens = async () => {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('letters_access_token');
    await AsyncStorage.removeItem('state');
  };
  
  useEffect(() => {
    // clearStoredTokens();
    const initiateOAuth = async () => {
      try {
        const response = await fetch(backendUrl, {
          method: 'GET',
        });
        const data = await response.json();
        setAuthUrl(data.auth_url);
        setLoading(false);
      } catch (error) {
        console.error('Failed to initiate OAuth flow', error);
      }
    };

    initiateOAuth();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch(backendUrl, {
        method: 'GET',
      });
      const data = await response.json();
      const { auth_url, state } = data;
      console.log('auth_url:', auth_url);
      await AsyncStorage.setItem('state', state);
      setShowWebView(true); // Show WebView to handle OAuth flow
    } catch (error) {
      console.error('Failed to initiate OAuth flow', error);
    }
  };

  const handleWebViewMessage = async (event) => {
    const accessToken = event.nativeEvent.data;
    if (accessToken) {
      console.log("accessToken:", accessToken);
      await AsyncStorage.setItem('access_token', accessToken);
      setShowWebView(false); // Hide WebView after receiving the token
      navigation.navigate('UserStart', { tokenData: { access_token: accessToken } });
    } else {
      console.error('No access token received from WebView');
    }
  };
  

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (showWebView) {
    return (
      <WebView
        source={{ uri: authUrl }}
        onMessage={handleWebViewMessage}
        style={{ marginTop: 20 }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.image} />
      <Text style={styles.title}>Connect your records with VA</Text>
      <Text style={styles.subtitle}>
        US regulations require us to get consent for utilizing your STRs and EHR before we can proceed with our service.
      </Text>
      
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Continue with VA.gov</Text>
      </TouchableOpacity>
    </View>
  );
};

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
  
  button: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    backgroundColor: '#162E52',
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
