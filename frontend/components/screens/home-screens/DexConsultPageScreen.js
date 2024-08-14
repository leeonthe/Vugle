import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Button } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import PainScaleSlider from './PainScaleSlider';  
import Logo from '../../../assets/logo.svg'


const DexConsultPageScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { firstName } = route.params;
  const [chatFlow, setChatFlow] = useState(null);
  const [currentStep, setCurrentStep] = useState('start');
  const [chatHistory, setChatHistory] = useState([]);
  const [csrfToken, setCsrfToken] = useState('');
  const [userInput, setUserInput] = useState(''); 
  const [painScale, setPainScale] = useState(0);
  const [pdfFileName, setPdfFileName] = useState(null);
  const scrollViewRef = useRef([]);
  const messageHeights = useRef([]);
  const userMessageIndices = useRef([]);
  const inputRef = useRef(null);

  const [inputSubmitted, setInputSubmitted] = useState(false);


  useEffect(() => {
    axios.get('http://localhost:8000/chatbot/')
      .then(response => {
        setChatFlow(response.data.chatbot_flow);
        setCsrfToken(response.data.csrf_token);
        handleStepChange('start', response.data.chatbot_flow.start.prompt, response.data.chatbot_flow.start.options);
      })
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    if (currentStep === 'new_condition') {
      inputRef.current?.focus();
    }
  }, [currentStep]);

  // Set the onReturn callback in navigation options
  useEffect(() => {
    navigation.setOptions({
      onReturn: handlePotentialConditionsReturn,
    });
  }, [navigation]);



  const ExpandingDot = ({ delay }) => {
    return (
        <Animatable.Text
            animation={{
                0: { scale: 1 },
                0.5: { scale: 1.5 },
                1: { scale: 1 }
            }}
            iterationCount="infinite"
            direction="alternate"
            delay={delay}
            style={styles.dot}
        >
            .
        </Animatable.Text>
    );
};

const LoadingAnimation = () => {
  return (
      <View style={styles.loadingContainer}>
          <ExpandingDot delay={0} />
          <ExpandingDot delay={200} />
          <ExpandingDot delay={400} />
      </View>
  );
};

const handleStepChange = (step, prompt, options = []) => {
  if (!prompt) return;

  const processedPrompt = prompt
      .replace('{user_name}', firstName)
      .replace(/\[NEWLINE\]/g, '\n')
      .replace(/\[BOLD\](.*?)\[CLOSE\]/g, (_, match) => `<b>${match}</b>`)
      .replace(/\[LINK_START\](.*?)\[LINK_END\]/g, (_, match) => `<a href="#">${match}</a>`)
      .replace(/\[IMAGE\]/g, 'IMAGE_PLACEHOLDER');

  const messages = processedPrompt.split('[BR]');

  // Ensure that only one loading message exists at a time
  setChatHistory(prevChatHistory => 
    prevChatHistory.filter(chat => chat.type !== 'loading')
  );

  // Append the new messages
  messages.forEach((message, index) => {
    const isLastMessage = index === messages.length - 1;
    const isImagePlaceholder = message.includes('IMAGE_PLACEHOLDER');

    setChatHistory(prevChatHistory => [
        ...prevChatHistory,
        {
            type: 'bot',
            text: renderStyledText(isImagePlaceholder ? message.replace('[IMAGE]', '') : message.trim()),
            imageSource: isImagePlaceholder ? <Logo style={[styles.logoContainer, styles.logoBackground, styles.logo]}/> : null,
            options: isLastMessage ? options : [],
            isImagePlaceholder,
            animation: null  // Clear any animation when the actual response arrives
        }
    ]);
  });

  if (step === 'new_condition' || step === 'basic_assessment') {
    setInputSubmitted(false);
  }

  setCurrentStep(step);
};

const displayLoadingMessage = () => {
  setChatHistory(prevChatHistory => {
    // Remove any existing loading messages
    const updatedChatHistory = prevChatHistory.filter(chat => chat.type !== 'loading');

    // Add the logo in one message container
    updatedChatHistory.push({
      type: 'loading',
      text: '',  // No text for the logo container
      imageSource: <Logo style={[styles.logoContainer, styles.logoBackground, styles.logo]} />,
      options: [],
      isImagePlaceholder: true,
      animation: null  // No animation for the logo
    });

    // Add the loading animation (e.g., "...")
    updatedChatHistory.push({
      type: 'loading',
      text: '',  // No text since we're using the LoadingAnimation component
      imageSource: null,  // No image for the loading dots
      options: [],
      isImagePlaceholder: false,
      animation: <LoadingAnimation /> // Include the animated dots
    });

    return updatedChatHistory;
  });
};

const updateLoadingMessage = (newText) => {
  setChatHistory(prevChatHistory => {
    const updatedChatHistory = [...prevChatHistory];
    updatedChatHistory[updatedChatHistory.length - 1] = {
      ...updatedChatHistory[updatedChatHistory.length - 1],
      text: newText,
      animation: null  // Clear animation if the text is updated
    };
    return updatedChatHistory;
  });
};


const handleUserInputSubmit = async () => {
  if (userInput.trim()) {
    console.log("User Input Submitted:", userInput);
    setInputSubmitted(true);
    setChatHistory(prevChatHistory => [
      ...prevChatHistory,
      { type: 'user', text: userInput }
    ]);

    await displayLoadingMessage();  // Show the loading message from the backend

    try {
      const response = await axios.post('http://localhost:8000/chatbot/', {
        response: userInput,
        current_step: currentStep
      }, {
        headers: { 'X-CSRFToken': csrfToken }
      });

      console.log("Response received:", response.data);  // Log the entire response

      setTimeout(() => {
        if (currentStep === 'new_condition') {
          setCurrentStep('get_more_condition');
          handleStepChange('get_more_condition', chatFlow.get_more_condition.prompt, chatFlow.get_more_condition.options);
        } else if (currentStep === 'basic_assessment') {
          setCurrentStep('scaling_pain');
          handleStepChange('scaling_pain', chatFlow.scaling_pain.prompt, chatFlow.scaling_pain.options);
        } else if (currentStep === 'finding_right_claim') {
          setCurrentStep('service_connect');
          console.log("Navigating to service_connect");
          console.log("Service Connect Prompt:", chatFlow.service_connect.prompt);  // Debugging line
          console.log("Service Connect Options:", chatFlow.service_connect.options);  // Debugging line
          handleStepChange('service_connect', chatFlow.service_connect.prompt, chatFlow.service_connect.options);
        }
      }, 800); // Ensure loading message is displayed for at least 800ms
    } catch (error) {
      console.error("Error occurred during submission:", error);  // More descriptive error log
      updateLoadingMessage('Error: Unable to fetch response.');
    } finally {
      setUserInput('');
    }
  }
};


  const handleFileUpload = async () => {
    try {
        const res = await DocumentPicker.getDocumentAsync({});

        if (!res.canceled && res.assets && res.assets.length > 0) {
            const file = res.assets[0]; // Get the first file from the assets array
            const fileName = file.name;
            console.log("Selected file:", fileName);

            await displayLoadingMessage();
            
            const formData = new FormData();
            formData.append('dd214', {
                uri: file.uri,
                name: fileName,
                type: file.mimeType || 'application/pdf',  // Use the mimeType provided by the picker
            });

            const response = await axios.post('http://localhost:8000/chatbot/', formData, {
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'multipart/form-data'
                },
                params: { current_step: 'start' }
            });

            setPdfFileName(fileName);
            setChatHistory(prevChatHistory => [
                ...prevChatHistory,
                { type: 'user', text: fileName, isPdf: true }
            ]);
            setCurrentStep('upload_dd214');
            handleStepChange('upload_dd214', chatFlow.upload_dd214.prompt, chatFlow.upload_dd214.options);
        } else {
            console.log("Document Picker cancelled");
        }
    } catch (err) {
        console.error('DocumentPicker Error:', err);
        if (err.response) {
            console.error('Backend response:', err.response.data);
        }
    }
};


const handleOptionClick = async (option, index) => {
  console.log("User Selected Option:", option.text);
  if (option.text === "Upload DD214") {
    handleFileUpload();  // Trigger file upload
  } else {
    setChatHistory(prevChatHistory => [
      ...prevChatHistory,
      { type: 'user', text: option.text }
    ]);

    await displayLoadingMessage();  // Show the loading message from the backend

    try {
      const response = await axios.post('http://localhost:8000/chatbot/', {
        response: index,
        current_step: currentStep
      }, {
        headers: { 'X-CSRFToken': csrfToken }
      });
    
      const { prompts, options, navigation_url, potential_conditions } = response.data;
    
      setTimeout(() => {
        if (navigation_url) {
          if (navigation_url === "/potential_condition") {
            const formattedConditions = potential_conditions.map(cond => {
              const [name, risk, description] = cond.split('\n').map(line => line.split(': ')[1]);
              return { name, risk, description, riskColor: risk === 'High risk' ? 'red' : risk === 'Medium risk' ? 'orange' : 'green' };
            });
    
            navigation.navigate('PotentialConditionPageScreen', {
              potentialConditions: formattedConditions,
              onReturn: handlePotentialConditionsReturn,
            });
    
          } else if (navigation_url === "/hospital") {
            navigation.navigate('HospitalPageScreen');
          }
        } else if (prompts) {
          prompts.forEach((text, idx) => {
            const isImagePlaceholder = text.includes('[[IMAGE]]');
            handleStepChange('bot_response', text, idx === prompts.length - 1 ? options : []);
          });
        }
        
        setCurrentStep(option.next);
      }, 800); // Ensure loading message is displayed for at least 800ms
    } catch (error) {
      console.error("Error during option click:", error);
      updateLoadingMessage('Error: Unable to fetch response.');
    }
    
  }
};


const handlePotentialConditionsReturn = (addedConditions) => {
  if (addedConditions && addedConditions.length > 0) {
    // Update chat history with the added conditions
    setChatHistory(prevChatHistory => [
      ...prevChatHistory,
      { type: 'user', text: 'Selected Conditions: ' + addedConditions.join(', ') }
    ]);

    // Move to the next step after adding the conditions
    if (chatFlow && chatFlow.basic_assessment) {
      setCurrentStep('basic_assessment');
      handleStepChange('basic_assessment', chatFlow.basic_assessment.prompt, chatFlow.basic_assessment.options);
    }
  }
};
const handlePainScaleSubmit = async () => {
  setChatHistory(prevChatHistory => [
    ...prevChatHistory,
    { type: 'user', text: painScale.toString() }
  ]);

  // Display 'finding_right_claim' prompt
  handleStepChange('finding_right_claim', chatFlow.finding_right_claim.prompt);
  displayLoadingMessage();

  try {
    const response = await axios.post('http://localhost:8000/chatbot/', {
      response: painScale,
      current_step: 'scaling_pain'
    }, {
      headers: { 'X-CSRFToken': csrfToken }
    });

    console.log('Setting currentStep to finding_right_claim');
    setCurrentStep('finding_right_claim');
    console.log("AFTER SETTING, THE CURRENT STEP IS: ", currentStep);
  } catch (error) {
    console.error("Error during pain scale submissioㅇn:", error);
    updateLoadingMessage('Error: Unable to fetch response.');
  }
};


// 
const handleFindingRightClaim = async () => {
  try {
    // Display the loading animation
    await displayLoadingMessage();
    console.log("CURRENT STEP for finding right claim:", currentStep);

    // Make a GET request to retrieve the GPT response stored in the session
    const response = await axios.get('http://localhost:8000/chatbot/finding_right_claim/', {
      headers: { 'X-CSRFToken': csrfToken }
    });

    console.log("RESPONSE for finding right claim:", response.data);
    
    const { claim_response, error } = response.data;

    if (error) {
      updateLoadingMessage(`Error: ${error}`);
    } else {
      const content = claim_response.choices[0].message.content;
      handleStepChange('service_connect', content, chatFlow.service_connect.options);
    }

  } catch (error) {
    console.error("Error fetching GPT response for finding_right_claim:", error);
    // updateLoadingMessage('Error: Unable to fetch response.');
  } finally {
    setCurrentStep('service_connect');  // Move to the next step
  }
};

useEffect(() => {
  if (currentStep === 'finding_right_claim') {
    handleFindingRightClaim();
  }
}, [currentStep]);







const renderStyledText = (text) => {
  const parts = [];
  let lastIndex = 0;

  // Combine regex for both bold and link processing
  const combinedRegex = /<b>(.*?)<\/b>|<a href="#">(.*?)<\/a>/g;
  let match;
  while ((match = combinedRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
          parts.push({ text: text.substring(lastIndex, match.index), bold: false, link: false });
      }
      if (match[1]) {  // Bold
          parts.push({ text: match[1], bold: true, link: false });
      } else if (match[2]) {  // Link
          parts.push({ text: match[2], bold: false, link: true });
      }
      lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
      parts.push({ text: text.substring(lastIndex), bold: false, link: false });
  }

  return (
      <Text>
          {parts.map((part, index) => (
              <Text
                  key={index}
                  style={part.bold ? styles.boldText : (part.link ? styles.linkText : styles.normalText)}
                  onPress={() => part.link ? console.log('LINK Clicked!') : null}
              >
                  {part.text}
              </Text>
          ))}
      </Text>
  );
};

return (
  <ScrollView contentContainerStyle={styles.container} ref={scrollViewRef}>
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
      >
        {chat.isImagePlaceholder && chat.imageSource ? (
          <View style={styles.logoBackground}>
            <Logo style={styles.logo} />
          </View>
        ) : chat.text && (
          <Text style={[styles.messageText, chat.type === 'user' ? styles.userText : styles.botText]}>
            {chat.text}
          </Text>
        )}

        {chat.animation ? (
          <View style={styles.loadingAnimationContainer}>
            {chat.animation}
          </View>
        ) : null}

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

  {(currentStep === 'new_condition' || currentStep === 'basic_assessment') && !inputSubmitted && (
    <View style={styles.inputContainer}>
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder={currentStep === 'basic_assessment' ? "Describe your condition..." : "Type your condition here..."}
        value={userInput}
        onChangeText={setUserInput}
        autoFocus={true}
      />
      <Button title="Submit" onPress={handleUserInputSubmit} />
    </View>
  )}
{/*  */}

    {currentStep === 'scaling_pain' && (
      <PainScaleSlider painScale={painScale} setPainScale={setPainScale} onSubmit={handlePainScaleSubmit} />
    )}
  </ScrollView>
);
};


const styles = StyleSheet.create({
  loadingContainer: {
      flexDirection: 'row',
      justifyContent: 'center',  
      alignItems: 'center',
      padding: 0,
      marginTop: -10,
      marginBottom: -10, 
      borderRadius: 24,
  },
  dot: {
      fontSize: 30,
      marginHorizontal: 2,
      color: '#D7D7D7',
      marginBottom: 15,
  },
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
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 16,
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#F5F6F8',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 8,
    maxWidth: '80%',
    display: 'inline-flex',


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
    marginTop: 4,
    marginBottom: 12,
    wordWrap: 'break-word',
    marginLeft: 4,
  },
  botText: {
    color: '#323D4C',
  },
  userText: {
    color: '#fff',
  },
  boldText: {
    fontWeight: 'bold',
  },
  linkText: {
    color: '#3182F6',
    textDecorationLine: 'underline',
  },
  normalText: {
    fontWeight: 'normal',
  },
  image: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  pdfContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6F8',
    padding: 8,
    borderRadius: 8,
  },
  pdfIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  pdfText: {
    color: '#323D4C',
    fontSize: 16,
    fontFamily: 'SF Pro',
    fontWeight: '510',
    lineHeight: 28,
  },
  optionButton: {
    alignSelf: 'stretch',
    paddingVertical: 8,
    paddingHorizontal: 16,
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
  logoBackground: {
    width: 36,
    height: 36,
    backgroundColor: '#F6F6F6',
    borderRadius: 24,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    // marginBottom: 16,
    marginBottom: 10,
    marginLeft: 10,
  },

  logo: {
    width: 24,
    height: 24,
  },
  sliderContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  slider: {
    width: 200,
    height: 40,
  },
  painScaleText: {
    fontSize: 16,
    color: '#3182F6',
    marginVertical: 10,
  },
});

export default DexConsultPageScreen;