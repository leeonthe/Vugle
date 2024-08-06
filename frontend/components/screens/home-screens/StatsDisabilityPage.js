import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useVeteranData } from '../../../APIHandler';

function StatsDisabilityPage() {
  const { userInfo, loading, error } = useVeteranData();
  const navigation = useNavigation();
  console.log(userInfo.disabilityRating);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Stats Disability Page</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HomePage')}>
        <Text style={styles.buttonText}>Go to Home Page</Text>
      </TouchableOpacity>
      <Text style={styles.infoText}>Disability Rating: {userInfo.disabilityRating ? JSON.stringify(userInfo.disabilityRating) : 'N/A'}</Text>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F9FD',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
});

export default StatsDisabilityPage;
