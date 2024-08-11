import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Button, Keyboard } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import PainScaleSlider from './PainScaleSlider';  



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



  const [pdfFileName, setPdfFileName] = useState(null);  // To store the uploaded PDF file name
  const scrollViewRef = useRef([]);
  const messageHeights = useRef([]);
  const userMessageIndices = useRef([]);
  const inputRef = useRef(null); // Ref for the TextInput


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
      inputRef.current?.focus(); // Focus the TextInput when 'new_condition' step is reached
    }
  }, [currentStep]);

  const handleStepChange = (step, prompt, options = []) => {
    if (!prompt) return;

    const processedPrompt = prompt
        .replace('{user_name}', firstName)
        .replace(/\[NEWLINE\]/g, '\n')  // Replace [NEWLINE] with actual new lines within the same container
        .replace(/\[BOLD\](.*?)\[CLOSE\]/g, (_, match) => `<b>${match}</b>`)  // Convert to HTML-like bold tags for further processing
        .replace(/\[LINK_START\](.*?)\[LINK_END\]/g, (_, match) => `<a href="#">${match}</a>`) // Convert to link tags for further processing
        .replace(/\[IMAGE\]/g, 'IMAGE_PLACEHOLDER');  // Handle image placeholder

    const messages = processedPrompt.split('[BR]');

    messages.forEach((message, index) => {
        const isLastMessage = index === messages.length - 1;
        const isImagePlaceholder = message.includes('IMAGE_PLACEHOLDER');

        setChatHistory(prevChatHistory => [
            ...prevChatHistory,
            {
                type: 'bot',
                text: isImagePlaceholder ? message.replace('[IMAGE]', '') : message.trim(),
                imageSource: isImagePlaceholder ? require('../../../assets/vugle.png') : null,  // Set the image source
                options: isLastMessage ? options : [],  // Only attach options to the last message
                isImagePlaceholder
            }
        ]);
    });
};

const handleUserInputSubmit = () => {
  if (userInput.trim()) {
      // Add user input to chat history
      setChatHistory(prevChatHistory => [
          ...prevChatHistory,
          { type: 'user', text: userInput }
      ]);
      setUserInput(''); // Clear the input field
      // Keyboard.dismiss();  


      
      if (currentStep === 'new_condition') {
          // Continue the chat for 'new_condition' as before
          setCurrentStep('get_more_condition');
          handleStepChange('get_more_condition', chatFlow.get_more_condition.prompt, chatFlow.get_more_condition.options);
      }

      // Handle different steps after user input
      if (currentStep === 'basic_assessment') {
          // Transition to 'scaling_pain' after 'basic_assessment'
          setCurrentStep('scaling_pain');
          handleStepChange('scaling_pain', chatFlow.scaling_pain.prompt, chatFlow.scaling_pain.options);
      } 
  }
};

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
                    onPress={() => part.link ? console.log('LINK SKRTSKSRTSKRT!') : null}
                >
                    {part.text}
                </Text>
            ))}
        </Text>
    );
};



  const handleFileUpload = async () => {
    try {
        const res = await DocumentPicker.getDocumentAsync({});
       // if (res.type === "success") {
            const fileName = res.name || (res.assets && res.assets.length > 0 && res.assets[0].name);

            console.log('Selected file: ', fileName);  // Log the full file object
            setPdfFileName(fileName);  // Store the PDF file name
            setChatHistory(prevChatHistory => [
                ...prevChatHistory,
                { type: 'user', text: fileName, isPdf: true }
            ]);
            setCurrentStep('upload_dd214');
            handleStepChange('upload_dd214', chatFlow.upload_dd214.prompt, chatFlow.upload_dd214.options);
     //   } else{
          console.log('No file selected');
     //   }
    } catch (err) {
        console.log('DocumentPicker Error: ', err);
    }
};

const handleOptionClick = async (option, index) => {
  if (option.text === "Upload DD214") {
    handleFileUpload();  // Trigger file upload
  } else {
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
      const { prompts, options, navigation_url } = response.data;

      if (navigation_url) {

        if (navigation_url === "/hospital") {
            navigation.navigate('HospitalPageScreen');
        } else if (navigation_url === "/potential_condition") {
            navigation.navigate('PotentialConditionPageScreen', {
              
                onReturn: (addedConditions) => {

                    if (Array.isArray(addedConditions)) {
                        // Display the user's selection in the chat
                        setChatHistory(prevChatHistory => [
                            ...prevChatHistory,
                            { type: 'user', text: 'Selected Conditions: ' + addedConditions.join(', ') }
                        ]);
    
                        // Ensure chatFlow and basic_assessment are defined before proceeding
                        if (chatFlow && chatFlow.basic_assessment) {
                          setCurrentStep('basic_assessment');

                            // Continue the chat with the next step
                            handleStepChange('basic_assessment', chatFlow.basic_assessment.prompt, chatFlow.basic_assessment.options);
                            
                        } else {
                            console.error('basic_assessment is not defined in chatFlow');
                        }
                    } else {
                        console.error('addedConditions is not an array');
                    }
                }
            });
        }
    }
    else if (prompts) {
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
    } catch (error) {
      console.error(error);
    }
  }
};

const handlePainScaleSubmit = () => {
  // Add user input to chat history
  setChatHistory(prevChatHistory => [
    ...prevChatHistory,
    { type: 'user', text: painScale.toString() }
  ]);

  // Proceed to the next step
  setCurrentStep('finding_right_claim');
  handleStepChange('finding_right_claim', chatFlow.finding_right_claim.prompt, chatFlow.finding_right_claim.options);
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
          <Image source={chat.imageSource} style={styles.image} />
        ) : chat.text && (
          <Text style={[styles.messageText, chat.type === 'user' ? styles.userText : styles.botText]}>
            {renderStyledText(chat.text)}
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

    {/* Render input field for 'new_condition' or 'basic_assessment' */}
    {(currentStep === 'new_condition' || currentStep === 'basic_assessment') && (
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

    {/* Render slider for 'scaling_pain' */}
    {currentStep === 'scaling_pain' && (
        <PainScaleSlider painScale={painScale} setPainScale={setPainScale} />

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