import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

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
 if (response.status !== 200) {
   throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
 }
 return response.json();
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


 const sendVeteranDataToBackend = async (veteranData) => {
  const csrfToken = await AsyncStorage.getItem('csrf_token');

  // Log each piece of data to confirm it's being passed correctly
  // console.log('Disability Rating:', veteranData.disabilityRating);
  // console.log('Service History:', veteranData.serviceHistory);
  // console.log('Status:', veteranData.status);
  // console.log('Letters:', veteranData.letters);

  try {
    // Ensure that all required fields are included in the veteranData object
    const requiredKeys = ['disabilityRating', 'serviceHistory', 'status', 'letters'];
    const missingKeys = requiredKeys.filter(key => !veteranData[key]);

    if (missingKeys.length > 0) {
      console.error('Missing required data fields:', missingKeys.join(', '));
      throw new Error(`Missing required data fields: ${missingKeys.join(', ')}`);
    }

    console.log("SENDING DATA TO BACKEND: ", veteranData);

    // Send the data to the backend
    const response = await axios.post('http://localhost:8000/api/save-veteran-data/', veteranData, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken, // Include the CSRF token in the headers
      },
    });

    // Check if the response is JSON
    if (response.headers['content-type'].includes('application/json') && response.status === 200) {
      console.log('Data successfully sent to the backend:', response.data);
    } else {
      console.error('Unexpected content-type, expected JSON but got:', response.headers['content-type']);
    }
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Backend error:', error.response.data);
      console.error('Backend response status:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from backend:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error in setting up the request:', error.message);
    }
  }
};



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
        setEligibleLetters(letters);

        // Combine all fetched data into a single object
        const veteranData = {
          disabilityRating,
          serviceHistory,
          status,
          letters
        };

        // Send the combined data to the backend
        await sendVeteranDataToBackend(veteranData);
      }

    } catch (error) {
      setError(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  fetchAllData();
}, []);


 return (
   <VeteranDataContext.Provider value={{ userInfo, disabilityRatingId, eligibleLetters, loading, error }}>
     {children}
   </VeteranDataContext.Provider>
 );
};


export const useVeteranData = () => useContext(VeteranDataContext);



