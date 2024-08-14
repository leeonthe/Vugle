import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { useVeteranData } from '../../../APIHandler'; // Adjust the import path as needed
import axios from 'axios';
import Logo from '../../../assets/logo.svg'
import Back from '../../../assets/back.svg'


const ConsultPageScreen = () => {
  const navigation = useNavigation();
  const { userInfo, loading, error } = useVeteranData();
  const [showInitialButton, setShowInitialButton] = useState(true);

  const navigateToDexConsultPage = () => {
    navigation.navigate('DexConsultPage', { firstName: userInfo.serviceHistory?.data?.[0]?.attributes?.first_name });
  };

  const navigateToHomePage = () => {
    navigation.navigate('HomePage'); // Navigate to HomePageScreen
  };
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
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
      <View style={styles.back}>
        <TouchableOpacity onPress={navigateToHomePage}>
          <Back name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.header}></View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Meet </Text>
          <Text style={styles.titleHighlight}>Dex,</Text>
          <Text style={styles.title}>Your AI compensation buddy.</Text>
        </View>
        
        <Animatable.View animation="fadeIn" duration={1000} style={styles.logoContainer}>
          <View style={styles.logoBackground}>
            <Logo style={styles.logo} />
          </View>
        </Animatable.View>
        
        <View style={styles.chatContainer}>
          <Animatable.View animation="fadeIn" duration={1000} delay={1000} style={styles.messageContainer}>
            <Text style={styles.messageText}>Hello, {firstName} 👋</Text>
          </Animatable.View>
          
          <Animatable.View animation="fadeIn" duration={1000} delay={2000} style={styles.messageContainer}>
            <Text style={styles.messageText}>
            I will help you understand your condition, evaluate the best approach, and file out your application.          </Text>
          </Animatable.View>
          
          <Animatable.View animation="fadeIn" duration={1000} delay={3000} style={styles.messageContainer}>
            <Text style={styles.messageText}>
            After that, I will guide you through the rest of the claim process!          </Text>
          </Animatable.View>
      </View>


      
      {showInitialButton && (
        <Animatable.View animation="fadeIn" duration={1000} delay={4000} style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={navigateToDexConsultPage}>
            <Text style={styles.buttonText}>Sounds good!</Text>
          </TouchableOpacity>
        </Animatable.View>
      )}
    </ScrollView>
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
  back:{
    marginTop: 80,
    marginLeft: 10,
  },
    container: {
    flexGrow: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  titleContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 45,
    marginTop: -20,
    marginLeft: 10,
  },
  title: {
    color: '#222222',
    fontSize: 24,
    fontFamily: 'SF Pro Display',
    fontWeight: '600',
    lineHeight: 38,
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
    marginBottom: 10,
    marginLeft: 10,
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
    gap: 2,
    marginBottom: 150,
    marginLeft: 10,

  },

  messageContainer: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#F5F6F8',
    borderRadius: 16,
    alignItems: 'flex-start',
    padding:16,
    marginBottom: 8,
    maxWidth: '80%',
    display: 'inline-flex',
    gap: 10,
  },
  botMessage: {
    alignSelf: 'flex-start',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#3182F6',
  },
  messageText: {
    color: '#323D4C',
    fontSize: 16,
    fontFamily: 'SF Pro',
    fontWeight: '400',
    lineHeight: 28,
    wordWrap: 'break-word',
  },
  botText: {
    color: '#323D4C',
  },
  userText: {
    color: '#fff',
  },
  buttonContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  button: {
    width: 357,
    height: 52,
    backgroundColor: '#237AF2',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'inline-flex',
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