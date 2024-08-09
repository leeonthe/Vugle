import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HospitalPageScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.successText}>Success</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'green',
  },
});

export default HospitalPageScreen;
