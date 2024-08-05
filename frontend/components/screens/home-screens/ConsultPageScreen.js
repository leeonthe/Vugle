import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
function ConsultPageScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Consult Page</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HomePage')}>
        <Text style={styles.buttonText}>Go to Home Page</Text>
      </TouchableOpacity>
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
});

export default ConsultPageScreen;
