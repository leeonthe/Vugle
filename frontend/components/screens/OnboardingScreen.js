import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';

const { width, height } = Dimensions.get('window');

function OnboardingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Swiper
        style={styles.wrapper}
        showsButtons={false}
        dot={<View style={styles.dot} />}
        activeDot={<View style={styles.activeDot} />
      }
      >
        <View style={styles.slide}>
          <Image source={require('../../assets/assets-userStart/max_benefits.png')} style={styles.image} />
          <Text style={styles.title}>Maximize your benefits</Text>
          <Text style={styles.subtitle}>AI-based claims and appeals.</Text>
          <Text style={styles.subtitle}> Faster & efficient processes. </Text>
        </View>
        <View style={styles.slide}>
          <Image source={require('../../assets/logo.png')} style={styles.image} />
          <Text style={styles.title}>Benefits at a glance</Text>
          <Text style={styles.subtitle}>Explore tons of benefits you might love. </Text>
          <Text style={styles.subtitle}>No need to check eligibility all the time.</Text>
        </View>
        <View style={styles.slide}>
          <Image source={require('../../assets/logo.png')} style={styles.image} />
          <Text style={styles.title}>More Benefits</Text>
          <Text style={styles.subtitle}>Details about more benefits.</Text>
        </View>
        <View style={styles.slide}>
          <Image source={require('../../assets/logo.png')} style={styles.image} />
          <Text style={styles.title}>Get Started Now</Text>
          <Text style={styles.subtitle}>Final slide description.</Text>
        </View>
      </Swiper>
      <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Login')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.continueButton, styles.testButton]} onPress={() => navigation.navigate('HospitalPageScreen')}>
        <Text style={styles.continueButtonText}>Go to Hospital Page</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'SF Pro Display',
    fontWeight: '600',
    lineHeight: 22,
    textAlign: 'center',
    marginVertical: 10,
  },
  subtitle: {
    color: '#8F8F8F',
    fontSize: 14,
    fontFamily: 'SF Pro',
    fontWeight: '510',
    lineHeight: 22,
    wordWrap: 'break-word'
  },
  dot: {
    backgroundColor: 'rgba(0,0,0,.2)',
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,

  },
  activeDot: {
    backgroundColor: '#007AFF',
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  button: {
    width: '90%',
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  continueButton:{
    width: '90%',
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  
});

export default OnboardingScreen;
