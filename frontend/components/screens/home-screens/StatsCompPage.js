import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useVeteranData } from '../../../APIHandler';

function StatsCompPage() {
  const navigation = useNavigation();
  const { userInfo, eligibleLetters, statusInfo, loading, error } = useVeteranData();

  const renderData = (data) => {
    if (typeof data === 'object' && data !== null) {
      return Object.entries(data).map(([key, value]) => (
        <View key={key} style={styles.dataItem}>
          <Text style={styles.dataKey}>{key}:</Text>
          <Text style={styles.dataValue}>{typeof value === 'object' ? JSON.stringify(value) : value}</Text>
        </View>
      ));
    }
    return <Text>{data}</Text>;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Stats Comp Page</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HomePage')}>
        <Text style={styles.buttonText}>Go to Home Page</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.dataContainer}>
        {renderData(eligibleLetters)}
      </ScrollView>
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
    marginBottom: 20,
  },
  button: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#237AF2',
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  dataContainer: {
    width: '100%',
    fontSzie: 10,
    paddingHorizontal: 20,
  },
  dataItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    paddingBottom: 5,
  },
  dataKey: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dataValue: {
    fontSize: 16,
    flexShrink: 1,
    textAlign: 'right',
  },
});

export default StatsCompPage;
