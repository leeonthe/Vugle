import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

function UserStartScreen({ route }) {
  const { tokenData } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello, Welcome to UserStartScreen!</Text>
      {tokenData && (
        <Text style={styles.tokenInfo}>
          Token: {tokenData.access_token}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  tokenInfo: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
});

export default UserStartScreen;
