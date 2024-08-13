import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import ConnectRecord from '../../assets/assets-userStart/connect_record.svg';
import { useVeteranData } from '../../APIHandler';

const backendUrl = 'http://localhost:8000/api/oauth/login/';

const LoginScreen = () => {
  const [authUrl, setAuthUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [showWebView, setShowWebView] = useState(false);
  const navigation = useNavigation();
  const { resetVeteranData } = useVeteranData();

  useEffect(() => {
    const checkTokenAndInitiate = async () => {
      const storedToken = await AsyncStorage.getItem('access_token');
      if (storedToken) {
        console.log("Using stored access token:", storedToken);
        navigation.navigate('UserStart', { tokenData: { access_token: storedToken } });
      } else {
        console.log("No stored access token found, initiating OAuth flow...");
        initiateOAuth();
      }
    };

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

    checkTokenAndInitiate();
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

      setShowWebView(false); // Hide WebView immediately after receiving the token

      // Navigate after WebView is hidden
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

  return (
    <View style={styles.container}>
      {showWebView ? (
        <WebView
          source={{ uri: authUrl }}
          onMessage={handleWebViewMessage}
          style={{ marginTop: 20 }}
        />
      ) : (
        <>
          <View style={styles.svgContainer}>
            <ConnectRecord />
          </View>
          <Text style={styles.title}>Connect your records</Text>
          <Text style={styles.subtitle}>
            We utilize VA.gov for a faster and efficient information collection. Information will be stored securely and we will not share your data.
          </Text>
          <View style={styles.continueContainer}>
            <Text style={styles.text}>
              By continuing, you agree to our{' '}
              <Text style={styles.link}>Privacy Policy</Text> and{' '}
              <Text style={styles.link}>Terms of Service</Text>.
            </Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>VA Continue with VA.gov</Text>
            </View>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  svgContainer: {
    paddingTop: 150,
    marginBottom: 50,
  },
  title: {
    color: '#0B0B0E',
    fontFamily: 'SF Pro Display',
    width: '100%',
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 16,
    wordWrap: 'break-word',
  },
  subtitle: {
    width: '100%',
    fontFamily: 'SF Pro',
    fontSize: 14,
    color: '#636467',
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingLeft: 42,
    paddingRight: 42,
    fontWeight: '400',
    lineHeight: 22,
    wordWrap: 'break-word',
    marginBottom: 70,
  },
  button: {
    width: '90%',
    backgroundColor: '#162E52',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  continueContainer: {
    width: '100%',
    textAlign: 'center',
    color: '#636467',
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 110,
    lineHeight: 20,
  },
  text: {
    color: '#636467',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'SF Pro',
    fontWeight: '400',
    lineHeight: 18,
    wordWrap: 'break-word',
    marginBottom: 20,
  },
  link: {
    color: '#3182F6',
    fontSize: 12,
    fontFamily: 'SF Pro',
    fontWeight: '400',
    lineHeight: 18,
  },
});

export default LoginScreen;
