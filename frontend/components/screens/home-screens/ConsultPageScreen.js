import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';

const ConsultPageScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
       </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Meet </Text>
        <Text style={styles.titleHighlight}>Dex,</Text>
        <Text style={styles.title}>Your AI compensation buddy.</Text>
      </View>
      
      <Animatable.View animation="fadeIn" duration={1000} style={styles.logoContainer}>
        <View style={styles.logoBackground}>
          <Image source={ require('../../../assets/vugle.png')} style={styles.logo} />
        </View>
      </Animatable.View>
      
      <View style={styles.chatContainer}>
        <Animatable.View animation="fadeIn" duration={1000} delay={1000} style={styles.messageContainer}>
          <Text style={styles.messageText}>Hello, Robert 👋</Text>
        </Animatable.View>
        
        <Animatable.View animation="fadeIn" duration={1000} delay={2000} style={styles.messageContainer}>
          <Text style={styles.messageText}>
            I will help you understand your condition, evaluate your best approach, and file out your application.
          </Text>
        </Animatable.View>
        
        <Animatable.View animation="fadeIn" duration={1000} delay={3000} style={styles.messageContainer}>
          <Text style={styles.messageText}>
            After that, Erica will guide you through the rest of the claim process.
          </Text>
        </Animatable.View>
      </View>
      
      <Animatable.View animation="fadeIn" duration={1000} delay={4000} style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UserStart')}>
          <Text style={styles.buttonText}>Sounds good!</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 54,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  titleContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  title: {
    color: '#222222',
    fontSize: 24,
    fontFamily: 'SF Pro Display',
    fontWeight: '600',
    lineHeight: 36,
  },
  titleHighlight: {
    color: '#3182F6',
    fontSize: 24,
    fontFamily: 'SF Pro Display',
    fontWeight: '600',
    lineHeight: 36,
  },
  logoContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  logoBackground: {
    width: 36,
    height: 36,
    backgroundColor: '#F6F6F6',
    borderRadius: 24,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 24,
    height: 24,
  },
  chatContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 16,
  },
  messageContainer: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#F5F6F8',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 8,
    maxWidth: '80%',
  },
  messageText: {
    color: '#323D4C',
    fontSize: 16,
    fontFamily: 'SF Pro',
    fontWeight: '510',
    lineHeight: 28,
  },
  buttonContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  button: {
    width: 357,
    height: 52,
    backgroundColor: '#191F28',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'SF Pro Display',
    fontWeight: '500',
    lineHeight: 16,
  },
});

export default ConsultPageScreen;
