import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';

const ChatbotScreen = () => {
  const [chatFlow, setChatFlow] = useState(null);
  const [currentStep, setCurrentStep] = useState('start');
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/chatbot/')
      .then(response => setChatFlow(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleOptionClick = (option) => {
    setChatHistory([
      ...chatHistory,
      { type: 'user', text: option.text },
      { type: 'bot', text: chatFlow[option.next].prompt }
    ]);
    setCurrentStep(option.next);
  };

  if (!chatFlow) {
    return <Text>Loading...</Text>;
  }

  const step = chatFlow[currentStep];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {chatHistory.map((chat, index) => (
        <View
          key={index}
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
        </View>
      ))}
      <View style={styles.messageContainer}>
        <Text style={styles.botText}>{step.prompt}</Text>
      </View>
      {step.options && step.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.optionButton}
          onPress={() => handleOptionClick(option)}
        >
          <Text style={styles.optionText}>{option.text}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  messageContainer: {
    width: '100%',
    backgroundColor: '#F5F6F8',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F5F6F8',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#3182F6',
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'SF Pro',
    fontWeight: '510',
    lineHeight: 28,
  },
  botText: {
    color: '#191F28',
  },
  userText: {
    color: '#fff',
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

export default ChatbotScreen;
