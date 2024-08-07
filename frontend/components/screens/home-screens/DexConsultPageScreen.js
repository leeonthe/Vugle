import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';

const DexConsultPageScreen = () => {
  const route = useRoute();
  const { firstName } = route.params;
  const [chatFlow, setChatFlow] = useState(null);
  const [currentStep, setCurrentStep] = useState('start');
  const [chatHistory, setChatHistory] = useState([]);
  const [csrfToken, setCsrfToken] = useState('');
  const scrollViewRef = useRef();
  const messageHeights = useRef([]);
  const userMessageIndices = useRef([]); // To track the indices of user messages

  useEffect(() => {
    axios.get('http://localhost:8000/chatbot/')
      .then(response => {
        setChatFlow(response.data.chatbot_flow);
        setCsrfToken(response.data.csrf_token);
        handleStepChange('start', response.data.chatbot_flow.start.prompt, response.data.chatbot_flow.start.options);
      })
      .catch(error => console.error(error));
  }, []);

  const handleStepChange = (step, prompt, options = []) => {
    if (!prompt) return;
    const processedPrompt = prompt.replace('{user_name}', firstName);
    const prompts = processedPrompt.split('\n');
    prompts.forEach((text, index) => {
      const isImagePlaceholder = text.includes('[[IMAGE]]');
      setChatHistory(prevChatHistory => [
        ...prevChatHistory,
        {
          type: 'bot',
          text: isImagePlaceholder ? '' : text,
          options: index === prompts.length - 1 ? options : [],
          isImagePlaceholder
        }
      ]);
    });
  };

  const handleOptionClick = async (option, index) => {
    const userMessageIndex = chatHistory.length;
    setChatHistory(prevChatHistory => [
      ...prevChatHistory,
      { type: 'user', text: option.text }
    ]);
    userMessageIndices.current.push(userMessageIndex);

    try {
      const response = await axios.post('http://localhost:8000/chatbot/', 
        { response: index, current_step: currentStep }, 
        { headers: { 'X-CSRFToken': csrfToken } }
      );
      const { prompts, options } = response.data;
      if (prompts) {
        prompts.forEach((text, idx) => {
          const isImagePlaceholder = text.includes('[[IMAGE]]');
          setChatHistory(prevChatHistory => [
            ...prevChatHistory,
            {
              type: 'bot',
              text: isImagePlaceholder ? '' : text,
              options: idx === prompts.length - 1 ? options : [],
              isImagePlaceholder
            }
          ]);
        });
      }
      setCurrentStep(option.next);
    //   setTimeout(() => {
    //     const lastUserMessageIndex = userMessageIndices.current[userMessageIndices.current.length - 1];
    //     // let scrollToY = messageHeights.current.slice(0, lastUserMessageIndex).reduce((acc, height) => acc + height, 0);
    //     // if (scrollToY > 4000) {
    //     //   scrollToY = 500;
    //     // }
    //     const scrollToY = 1500;
    //     console.log('scrollToY value:', scrollToY);
    //     scrollViewRef.current.scrollTo({ y: scrollToY, animated: true });
    //   }, 100);
    } catch (error) {
      console.error(error);
    }
  };

  const measureView = (event, index) => {
    const { height } = event.nativeEvent.layout;
    messageHeights.current[index] = height;
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      ref={scrollViewRef}
    >
      <View style={styles.header}></View>

      {chatHistory.map((chat, index) => (
        <Animatable.View
          key={index}
          animation="fadeIn"
          duration={1000}
          style={[
            styles.messageContainer,
            chat.type === 'user' ? styles.userMessage : styles.botMessage,
          ]}
          onLayout={(event) => measureView(event, index)}
        >
          {chat.isImagePlaceholder && (
            <Image source={require('../../../assets/vugle.png')} style={styles.image} />
          )}
          {chat.text && (
            <Text
              style={[
                styles.messageText,
                chat.type === 'user' ? styles.userText : styles.botText,
              ]}
            >
              {chat.text}
            </Text>
          )}
          {chat.options && chat.options.length > 0 && chat.options.map((option, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.optionButton}
              onPress={() => handleOptionClick(option, idx)}
            >
              <Text style={styles.optionText}>{option.text}</Text>
            </TouchableOpacity>
          ))}
        </Animatable.View>
      ))}
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
  messageContainer: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#F5F6F8',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 8,
    maxWidth: '80%',
    flexDirection: 'column',
    alignItems: 'flex-start',
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
    marginBottom: 16,
  },
  botText: {
    color: '#323D4C',
  },
  userText: {
    color: '#fff',
  },
  image: {
    width: 24,
    height: 24,
    marginRight: 8,
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
  chatContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 16,
  },
  optionButton: {
    alignSelf: 'stretch',
    paddingVertical: 8,  // Reduced padding to make the button smaller
    paddingHorizontal: 16,  // Reduced padding to make the button smaller
    backgroundColor: 'white',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#191F28',
    fontFamily: 'SF Pro',
    fontWeight: '510',
    lineHeight: 28,
    textAlign: 'center',
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
});

export default DexConsultPageScreen;
