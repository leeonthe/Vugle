import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://sandbox-api.va.gov/services/veteran_verification/v2';
const API_LETTER_URL = 'https://sandbox-api.va.gov/services/va-letter-generator/v1';
const endpoints = {
  disabilityRating: '/disability_rating',
  serviceHistory: '/service_history',
  status: '/status',
  eligibleLetters: '/eligible-letters',
};

const fetchVeteranData = async (accessToken, endpoint) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  if (response.status === 401) {
    console.error(`Access token is invalid or expired. Fetching a new token...`);
    const newAccessToken = await fetchLetterAccessToken();
    return fetchVeteranData(newAccessToken, endpoint);
  }

  if (response.status !== 200) {
    console.log(`Failed to fetch ${endpoint}: ${response.statusText}, response status is:`, response.status);
    throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
  }
  return response.json();
};

const fetchUserIDFromDisabilityRating = async (accessToken) => {
  const response = await fetch(`${API_BASE_URL}${endpoints.disabilityRating}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.status !== 200) {
    throw new Error(`Failed to fetch disability rating: ${response.statusText}`);
  }
  const data = await response.json();
  return data.id;
};

const fetchEligibleLetters = async (accessToken, icn) => {
  if (!icn) {
    console.error('ICN is required to fetch eligible letters');
    throw new Error('ICN is required to fetch eligible letters');
  }
  console.log(`Fetching eligible letters with ICN: ${icn}`);
  const response = await fetch(`${API_LETTER_URL}${endpoints.eligibleLetters}?icn=${icn}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  if (response.status === 401) {
    console.error('Access token is invalid or expired. Fetching a new token...');
    const newAccessToken = await fetchLetterAccessToken();
    return fetchEligibleLetters(newAccessToken, icn);
  }
  
  if (response.status !== 200) {
    console.error(`Failed to fetch eligible letters: ${response.statusText}`);
    console.log('[ELIGIBLE]Response', response);
    throw new Error(`Failed to fetch eligible letters: ${response.statusText}`);
  }
  return response.json();
};

const fetchLetterAccessToken = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/get-access-token/');
    if (response.status !== 200) {
      console.error('Failed to fetch access token, due to response status:', response.status);
      throw new Error('Failed to fetch access token, due to response status');
    }

    const data = await response.json();
    const accessToken = data.access_token;
    await AsyncStorage.setItem('letters_access_token', accessToken);
    return accessToken;
  } catch (error) {
    console.error('Failed to fetch access token:', error);
    throw error;
  }
};

const VeteranDataContext = createContext();

export const VeteranDataProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({});
  const [disabilityRatingId, setDisabilityRatingId] = useState(null);
  const [eligibleLetters, setEligibleLetters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        setError('Access token not found');
        setLoading(false);
        return;
      }

      try {
        const [disabilityRating, serviceHistory, status] = await Promise.all([
          fetchVeteranData(token, endpoints.disabilityRating),
          fetchVeteranData(token, endpoints.serviceHistory),
          fetchVeteranData(token, endpoints.status),
        ]);

        // Set userInfo and extract disabilityRatingId
        setUserInfo({ disabilityRating, serviceHistory, status });
        if (disabilityRating && disabilityRating.data && disabilityRating.data.id) {
          const icn = disabilityRating.data.id;
          setDisabilityRatingId(icn);
          
          let lettersAccessToken = await AsyncStorage.getItem('letters_access_token');
          if (!lettersAccessToken) {
            lettersAccessToken = await fetchLetterAccessToken();
          }

          // Fetch eligible letters
          const letters = await fetchEligibleLetters(lettersAccessToken, icn);
          console.log("LETTER: ", letters);
          setEligibleLetters(letters);
        }

        console.log('UserInfo', { disabilityRating, serviceHistory, status });
      } catch (error) {
        setError(`Error: ${error.message}`);
      }
      setLoading(false);
    };

    const waitForTokenAndFetchData = async () => {
      let token = await AsyncStorage.getItem('access_token');
      while (!token) {
        await new Promise(resolve => setTimeout(resolve, 100));
        token = await AsyncStorage.getItem('access_token');
      }
      await fetchAllData();
    };

    waitForTokenAndFetchData();
  }, []);

  return (
    <VeteranDataContext.Provider value={{ userInfo, disabilityRatingId, eligibleLetters, loading, error }}>
      {children}
    </VeteranDataContext.Provider>
  );
};

export const useVeteranData = () => useContext(VeteranDataContext);
