import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useVeteranData } from '../../APIHandler'; // Adjust the import path as needed

function UserStartScreen({ route }) {
  const { userInfo, loading, error } = useVeteranData();
  const navigation = useNavigation();

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
        <View style={styles.divider} />
        <View style={styles.listItem}>
          <Image source={require('../../assets/service_treatment.png')} style={styles.icon} />
          <Text style={styles.listItemText}>Service Treatment Records</Text>
          <Text style={styles.checkmark}>✓</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.listItem}>
          <Image source={require('../../assets/Medical_records.png')} style={styles.icon} />
          <Text style={styles.listItemText}>VA Medical Records</Text>
          <Text style={styles.checkmark}>✓</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.listItem}>
          <Image source={require('../../assets/Benefits_info.png')} style={styles.icon} />
          <Text style={styles.listItemText}>Benefits Information</Text>
          <Text style={styles.checkmark}>✓</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.listItem}>
          <Image source={require('../../assets/claims_appeal.png')} style={styles.icon} />
          <Text style={styles.listItemText}>Claims & Appeals Status</Text>
          <Text style={styles.checkmark}>✓</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Image source={require('../../assets/logo.png')} style={styles.securityIcon} />
        <Text style={styles.infoText}>We use 128-bit encryption for added security and do not share your data.</Text>
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
    fontSize: 18,
    fontWeight: '400',
    alignSelf: 'flex-start',
    marginTop: 50,
    marginBottom: 13,
  },
  subtitle: {
    fontSize: 25,
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  listContainer: {
    width: '100%',
    height: 'auto',
    backgroundColor: '#F5F8FE',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  listItem: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E1E1E1',
  },
  listItemText: {
    fontSize: 13,
    fontFamily: 'SF Pro',
    fontWeight: '510',
    color: '#6B7685',
    flex: 1,
  },
  checkmark: {
    fontSize: 16,
    color: '#5CB297',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  securityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 20,
  },
  securityIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    textAlign: 'left',
    lineHeight: 20,
  },
  continueButton: {
    backgroundColor: '#237AF2',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40, // Added margin bottom for spacing
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
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 20,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    textAlign: 'left',
    lineHeight: 20,
  },
});

export default UserStartScreen;