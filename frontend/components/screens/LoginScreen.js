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

  useEffect(() => {
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

      await AsyncStorage.setItem('state', state);
      setShowWebView(true); // Show WebView to handle OAuth flow
    } catch (error) {
      console.error('Failed to initiate OAuth flow', error);
    }
  };

  const handleWebViewMessage = async (event) => {
    const accessToken = event.nativeEvent.data;
    if (accessToken) {
      await AsyncStorage.setItem('access_token', accessToken);
      setShowWebView(false); // Hide WebView after receiving the token
      navigation.navigate('UserStart', { tokenData: { access_token: accessToken } });
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
      <View style={styles.infoContainer}>
        <Image source={require('../../assets/logo.png')} style={styles.icon} />
        <Text style={styles.infoText}>We use 128-bit encryption for added security and do not share your data.</Text>
      </View>
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
