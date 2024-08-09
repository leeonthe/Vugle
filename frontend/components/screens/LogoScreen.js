import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import LOGO from '../../assets/logo.svg';
function LogoScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2000); 

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <LOGO></LOGO>
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
  logo: {
    width: 200,
    height: 200, 

  },
});

export default LogoScreen;
