import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:8000/api';
const endpoints = {
  eligibleLetters: '/eligible-letters/',
};

const fetchEligibleLetters = async (icn) => {
  const token = await AsyncStorage.getItem('access_token');
  if (!token) {
    throw new Error('Access token not found');
  }

  const response = await fetch(`${API_BASE_URL}${endpoints.eligibleLetters}?icn=${icn}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.status !== 200) {
    throw new Error(`Failed to fetch ${endpoints.eligibleLetters}: ${response.statusText}`);
  }
  return response.json();
};

const EligibleLettersContext = createContext();

export const EligibleLettersProvider = ({ children }) => {
  const [eligibleLetters, setEligibleLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const icn = '1012667145V762142'; // Replace with the actual ICN
        const data = await fetchEligibleLetters(icn);
        setEligibleLetters(data);
      } catch (error) {
        setError(`Error: ${error.message}`);
      }
      setLoading(false);
    };
// as
    fetchData();
  }, []);

  return (
    <EligibleLettersContext.Provider value={{ eligibleLetters, loading, error }}>
      {children}
    </EligibleLettersContext.Provider>
  );
};

export const useEligibleLetters = () => useContext(EligibleLettersContext);
