import React, { useState, useEffect } from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import axios from 'axios';

const config = {
  clientId: '0oax86sg7sEgacnY52p7',
  redirectUri: 'http://localhost:8000/api/oauth/callback/', // Use Expo's proxy for redirection
  scopes: [
    'profile',
    'openid',
    'offline_access',
    'disability_rating.read',
    'service_history.read',
    'veteran_status.read'
  ],
  serviceConfiguration: {
    authorizationEndpoint: 'https://sandbox-api.va.gov/oauth2/veteran-verification/v1/authorization',
    tokenEndpoint: 'https://va.gov/oauth2/token',
  }
};

export default function App() {
  const [authState, setAuthState] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [disabilityRating, setDisabilityRating] = useState(null);

  const generateCodeVerifier = async () => {
    const randomBytes = await Crypto.getRandomBytesAsync(32);
    return base64UrlEncode(randomBytes);
  };

  const generateCodeChallenge = async (verifier) => {
    const hashBuffer = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      verifier,
      { encoding: Crypto.CryptoEncoding.BASE64 }
    );
    return hashBuffer
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  };

  const [request, result, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: config.clientId,
      redirectUri: config.redirectUri,
      responseType: 'code',
      scopes: config.scopes,
      extraParams: {
        code_challenge_method: 'S256',
      },
    },
    config.serviceConfiguration
  );

  useEffect(() => {
    if (result) {
      if (result.type === 'success') {
        const { code } = result.params;

        const fetchToken = async () => {
          const codeVerifier = await AsyncStorage.getItem('codeVerifier');
          const tokenResponse = await fetch(config.serviceConfiguration.tokenEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `grant_type=authorization_code&code=${code}&client_id=${config.clientId}&redirect_uri=${config.redirectUri}&code_verifier=${codeVerifier}`
          });

          const tokenData = await tokenResponse.json();
          setAuthState(tokenData);
          await AsyncStorage.setItem('auth', JSON.stringify(tokenData));

          // Fetch user info and disability rating
          fetchUserInfo(tokenData.access_token);
          fetchDisabilityRating(tokenData.access_token);
        };

        fetchToken();
      } else {
        console.error('Authentication failed', result);
      }
    }
  }, [result]);

  const fetchUserInfo = async (token) => {
    const response = await fetch('https://sandbox-api.va.gov/services/veteran_verification/v0/user', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await response.json();
    setUserInfo(data);
  };

  const fetchDisabilityRating = async (token) => {
    const response = await fetch('https://sandbox-api.va.gov/services/veteran_verification/v0/disability_rating', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await response.json();
    setDisabilityRating(data);
  };

  const handleLogin = async () => {
    try {
      const codeVerifier = await generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);
  
      // Store the code verifier
      await AsyncStorage.setItem('codeVerifier', codeVerifier);
  
      console.log('Code Verifier (React Native):', codeVerifier);
      console.log('Code Challenge (React Native):', codeChallenge);
  
      // Make the OAuth login request with credentials
      const response = await axios.post(
        'http://localhost:8000/api/oauth/login/',
        {
          code_challenge: codeChallenge,
          code_challenge_method: 'S256',
          code_verifier: codeVerifier, // Include the code verifier to store in session
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
  
      console.log("Login request response:", response);
  
      promptAsync();
    } catch (error) {
      console.error("Login error:", error.response ? error.response.data : error);  // Log errors to debug
    }
  };
  
  
  

  return (
    <View style={styles.container}>
      {authState ? (
        <>
          <Text>Logged in</Text>
          {userInfo && (
            <>
              <Text>Welcome, {userInfo.profile.first_name} {userInfo.profile.last_name}</Text>
              <Text>Gender: {userInfo.profile.gender}</Text>
              <Text>Date of Birth: {userInfo.profile.birth_date}</Text>
            </>
          )}
          {disabilityRating && (
            <Text>Disability Rating: {disabilityRating.rating}%</Text>
          )}
        </>
      ) : (
        <Button title="Login with VA.gov" onPress={handleLogin} />
      )}
    </View>
  );
}

function base64UrlEncode(buffer) {
  return btoa(String.fromCharCode.apply(null, buffer))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
