import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { useVeteranData } from '../../../APIHandler'; // Adjust the import path as needed
import axios from 'axios';

const ConsultPageScreen = () => {
  const navigation = useNavigation();
  const { userInfo, loading, error } = useVeteranData();
  const [chatFlow, setChatFlow] = useState(null);
  const [currentStep, setCurrentStep] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [showInitialButton, setShowInitialButton] = useState(true);
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/chatbot/')
      .then(response => {
        setChatFlow(response.data.chatbot_flow);
        setCsrfToken(response.data.csrf_token);
      })
      .catch(error => console.error(error));
  }, []);

  const handleOptionClick = (option, index) => {
    const nextStep = chatFlow[option.next];
    setChatHistory(prevChatHistory => [
      ...prevChatHistory,
      { type: 'user', text: option.text },
      { type: 'bot', text: nextStep.prompt }
    ]);
    setCurrentStep(option.next);

    // Send the response to the server to get the next step
    axios.post('http://localhost:8000/chatbot/', 
      { response: index, current_step: currentStep }, 
      { headers: { 'X-CSRFToken': csrfToken } }
    )
    .then(response => {
      setChatFlow(prevChatFlow => ({
        ...prevChatFlow,
        [option.next]: response.data
      }));
    })
    .catch(error => console.error(error));
  };

  const handleInitialButtonClick = () => {
    setShowInitialButton(false);
    const startStep = chatFlow['start'];
    setChatHistory(prevChatHistory => [
      ...prevChatHistory,
      { type: 'bot', text: startStep.prompt }
    ]);
    setCurrentStep('question_1');
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

  const step = currentStep && chatFlow ? chatFlow[currentStep] : null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}></View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Meet </Text>
        <Text style={styles.titleHighlight}>Dex,</Text>
        <Text style={styles.title}>Your AI compensation buddy.</Text>
      </View>
      
      <Animatable.View animation="fadeIn" duration={1000} style={styles.logoContainer}>
        <View style={styles.logoBackground}>
          <Image source={require('../../../assets/vugle.png')} style={styles.logo} />
        </View>
      </Animatable.View>
      
      <View style={styles.chatContainer}>
        <Animatable.View animation="fadeIn" duration={1000} delay={1000} style={styles.messageContainer}>
          <Text style={styles.messageText}>Hello, {firstName} 👋</Text>
        </Animatable.View>
        
        <Animatable.View animation="fadeIn" duration={1000} delay={2000} style={styles.messageContainer}>
          <Text style={styles.messageText}>
            I will help you understand your condition, evaluate your best approach, and file out your application.
          </Text>
        </Animatable.View>
        
        <Animatable.View animation="fadeIn" duration={1000} delay={3000} style={styles.messageContainer}>
          <Text style={styles.messageText}>
            After that, Dex will guide you through the rest of the claim process.
          </Text>
        </Animatable.View>
      </View>
      
      {showInitialButton && (
        <Animatable.View animation="fadeIn" duration={1000} delay={4000} style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleInitialButtonClick}>
            <Text style={styles.buttonText}>Sounds good!</Text>
          </TouchableOpacity>
        </Animatable.View>
      )}

      {chatFlow && (
        <View style={styles.chatContainer}>
          {chatHistory.map((chat, index) => (
            <Animatable.View
              key={index}
              animation="fadeIn"
              duration={1000}
              style={[
                styles.messageContainer,
                chat.type === 'user' ? styles.userMessage : styles.botMessage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  chat.type === 'user' ? styles.userText : styles.botText,
                ]}
              >
                {chat.text}
              </Text>
            </Animatable.View>
          ))}
          {step && step.options && step.options.map((option, index) => (
            <Animatable.View animation="fadeIn" duration={1000} delay={index * 500} key={index}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => handleOptionClick(option, index)}
              >
                <Text style={styles.optionText}>{option.text}</Text>
              </TouchableOpacity>
            </Animatable.View>
          ))}
        </View>
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
  container: {
    flexGrow: 1,
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
    fontWeight: '510',
    lineHeight: 28,
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
  optionButton: {
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderColor: '#e6e6e6',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 13,
    color: '#191F28',
    fontFamily: 'SF Pro',
    fontWeight: '510',
    lineHeight: 28,
    textAlign: 'center',
  },
});

export default ConsultPageScreen;
