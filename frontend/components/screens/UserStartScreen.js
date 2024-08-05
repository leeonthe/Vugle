import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

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

function UserStartScreen({ route }) {
  const navigation = useNavigation();
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

  const firstName = userInfo.serviceHistory?.data?.[0]?.attributes?.first_name;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome {firstName}</Text>
      <Text style={styles.subtitle}>We thank you for your service.</Text>

      <View style={styles.listContainer}>
        <View style={styles.listItem}>
          <Image source={require('../../assets/Discharge_status.png')} style={styles.icon} />
          <Text style={styles.listItemText}>Discharge status</Text>
          <Text style={styles.checkmark}>✓</Text>
        </View>
        <View style={styles.listItem}>
          <Image source={require('../../assets/service_treatment.png')} style={styles.icon} />
          <Text style={styles.listItemText}>Service Treatment Records</Text>
          <Text style={styles.checkmark}>✓</Text>
        </View>
        <View style={styles.listItem}>
          <Image source={require('../../assets/Medical_records.png')} style={styles.icon} />
          <Text style={styles.listItemText}>VA Medical Records</Text>
          <Text style={styles.checkmark}>✓</Text>
        </View>
        <View style={styles.listItem}>
          <Image source={require('../../assets/Benefits_info.png')} style={styles.icon} />
          <Text style={styles.listItemText}>Benefits Information</Text>
          <Text style={styles.checkmark}>✓</Text>
        </View>
        <View style={styles.listItem}>
          <Image source={require('../../assets/claims_appeal.png')} style={styles.icon} />
          <Text style={styles.listItemText}>Claims & Appeals Status</Text>
          <Text style={styles.checkmark}>✓</Text>
        </View>
      </View>

      <View style={styles.securityContainer}>
        <Text style={styles.securityText}>We use 128-bit encryption for added security and do not share your data.</Text>
      </View>

      <TouchableOpacity style={styles.continueButton} onPress={() => navigation.navigate('HomePage')}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
  },
  listContainer: {
    width: '100%',
    backgroundColor: '#f0f4f7',
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  listItemText: {
    fontWeight: 510,
    fontFamily: "SF Pro",
    fontSize: 13,
    flex: 1,
  },
  checkmark: {
    fontSize: 16,
    color: '#4CAF50',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  securityContainer: {
    marginBottom: 20,
  },
  securityText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  continueButtonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default UserStartScreen;
