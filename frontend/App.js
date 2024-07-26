import React, { useState, useEffect } from 'react';
import { Button, View, Text } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

const config = {
  clientId: '0oax86sg7sEgacnY52p7',
  redirectUri: 'http://localhost:8000/api/oauth/callback/',
  scopes: [
    'openid',
    'profile',
    'offline_access',
    'disability_rating.read',
    'service_history.read',
    'veteran_status.read'
  ],
  serviceConfiguration: {
    authorizationEndpoint: 'https://sandbox-api.va.gov/oauth2/veteran-verification/v1/authorization',
    tokenEndpoint: 'https://va.gov/oauth2/token',
  },
  additionalParameters: {
    code_challenge_method: 'S256'
  }
};

console.log('Redirect URI:', config.redirectUri);

export default function App() {
  const [authState, setAuthState] = useState(null);
  const [request, result, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: config.clientId,
      redirectUri: config.redirectUri,
      scopes: config.scopes,
      codeChallengeMethod: AuthSession.CodeChallengeMethod.S256,
      codeChallenge: '',
    },
    config.serviceConfiguration
  );

  useEffect(() => {
    if (result) {
      if (result.type === 'success') {
        const { code } = result.params;

        const fetchToken = async () => {
          const codeVerifier = await generateCodeVerifier();
          const tokenResponse = await fetch(config.serviceConfiguration.tokenEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `grant_type=authorization_code&code=${code}&redirect_uri=${config.redirectUri}&client_id=${config.clientId}&code_verifier=${codeVerifier}`
          });

          const tokenData = await tokenResponse.json();
          setAuthState(tokenData);
          await AsyncStorage.setItem('auth', JSON.stringify(tokenData));
        };

        fetchToken();
      } else {
        console.error('Authentication failed', result);
      }
    }
  }, [result]);

  const handleLogin = async () => {
    const codeVerifier = await generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    request.codeChallenge = codeChallenge;
    promptAsync();
  };

  return (
    <View>
      {authState ? (
        <Text>Logged in</Text>
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

async function generateCodeVerifier() {
  const randomBytes = await Crypto.getRandomBytesAsync(32);
  return base64UrlEncode(randomBytes);
}

async function generateCodeChallenge(verifier) {
  const hashBuffer = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    verifier,
    { encoding: Crypto.CryptoEncoding.BASE64 }
  );

  return hashBuffer
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
