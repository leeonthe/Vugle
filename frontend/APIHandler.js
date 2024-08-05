import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://sandbox-api.va.gov/services/veteran_verification/v2';
const endpoints = {
  disabilityRating: '/disability_rating',
  serviceHistory: '/service_history',
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

const VeteranDataContext = createContext();

export const VeteranDataProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        setError('Access token not found');
        setLoading(false);
        return;
      }

      try {
        const [disabilityRating, serviceHistory] = await Promise.all(
          Object.values(endpoints).map(endpoint => fetchVeteranData(token, endpoint))
        );
        setUserInfo({ disabilityRating, serviceHistory });
      } catch (error) {
        setError(`Error: ${error.message}`);
      }
      setLoading(false);
    };

    fetchAllData();
  }, []);

  return (
    <VeteranDataContext.Provider value={{ userInfo, loading, error }}>
      {children}
    </VeteranDataContext.Provider>
  );
};

export const useVeteranData = () => useContext(VeteranDataContext);
