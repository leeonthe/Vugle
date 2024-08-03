import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://sandbox-api.va.gov/services/veteran_verification/v2';

const endpoints = {
  disabilityRating: '/disability_rating',
  // profile: '/profile',
  // enrolledBenefits: '/enrolled_benefits',
  // flashes: '/flashes',
  // serviceHistory: '/service_history',
  // status: '/status',
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

function UserStartScreen({ route }) {
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
        const [disabilityRating, enrolledBenefits, flashes, serviceHistory, status] = await Promise.all(
          Object.values(endpoints).map(endpoint => fetchVeteranData(token, endpoint))
        );
        setUserInfo({ disabilityRating, enrolledBenefits, flashes, serviceHistory, status });
      } catch (error) {
        setError(`Error: ${error.message}`);
      }
      setLoading(false);
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Fuck yea</Text>
      {userInfo.profile && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>User Profile</Text>
          <Text style={styles.infoText}>{JSON.stringify(userInfo.profile, null, 2)}</Text>
        </View>
      )}
      {userInfo.disabilityRating && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Disability Rating:</Text>
          <Text style={styles.infoText}>{JSON.stringify(userInfo.disabilityRating, null, 2)}</Text>
        </View>
      )}
      {userInfo.enrolledBenefits && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Enrolled Benefits:</Text>
          <Text style={styles.infoText}>{JSON.stringify(userInfo.enrolledBenefits, null, 2)}</Text>
        </View>
      )}
      {userInfo.flashes && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Benefit Flashes:</Text>
          <Text style={styles.infoText}>{JSON.stringify(userInfo.flashes, null, 2)}</Text>
        </View>
      )}
      {userInfo.serviceHistory && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Service History:</Text>
          <Text style={styles.infoText}>{JSON.stringify(userInfo.serviceHistory, null, 2)}</Text>
        </View>
      )}
      {userInfo.status && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Veteran Status:</Text>
          <Text style={styles.infoText}>{JSON.stringify(userInfo.status, null, 2)}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default UserStartScreen;
