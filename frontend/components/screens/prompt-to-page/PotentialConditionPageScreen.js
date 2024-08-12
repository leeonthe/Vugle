import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PotentialConditionPageScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { potentialConditions, onReturn } = route.params;  // Receive onReturn directly as a prop
  const [selectedConditions, setSelectedConditions] = useState({});

  const toggleCondition = (conditionName) => {
    setSelectedConditions((prevSelected) => ({
      ...prevSelected,
      [conditionName]: !prevSelected[conditionName],
    }));
  };

  const handleContinue = () => {
    const addedConditions = Object.keys(selectedConditions).filter(key => selectedConditions[key]);
    if (onReturn) {
      onReturn(addedConditions);  // Pass the selected conditions back
    }
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Potential affected conditions</Text>
        <Text style={styles.subtitle}>
          Please check the following symptoms and select if you are having any.
        </Text>
      </View>

      {potentialConditions.map((condition, index) => (
        <View key={index} style={styles.conditionContainer}>
          <View style={styles.conditionHeader}>
            <View style={styles.iconPlaceholder} />
            <View style={styles.conditionDetails}>
              <Text style={styles.conditionName}>{condition.name}</Text>
              <Text style={[styles.riskText, { color: condition.riskColor }]}>{condition.risk}</Text>
              <Text style={styles.description}>{condition.description}</Text>
            </View>
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.viewButton}>
              <Text style={styles.viewButtonText}>View</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.addButton,
                selectedConditions[condition.name] && styles.addedButton
              ]}
              onPress={() => toggleCondition(condition.name)}
            >
              {selectedConditions[condition.name] ? (
                <>
                  <Icon name="check" size={16} color="white" style={styles.icon} />
                  <Text style={styles.addButtonText}>Added</Text>
                </>
              ) : (
                <>
                  <Icon name="add" size={16} color="white" style={styles.icon} />
                  <Text style={styles.addButtonText}>Add</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  header: {
    marginTop: 60,
    backgroundColor: '#F7F9FD',
    padding: 20,
    marginBottom: 35,
    borderRadius: 8, 
    flexDirection: 'column', 
    justifyContent: 'center', alignItems: 'flex-start', gap: 16, display: 'inline-flex'
  },
  title: {
    color: '#191F28',
    fontSize: 20,
    fontFamily: 'SF Pro',
    fontWeight: 'bold',
    lineHeight: 25,
    wordWrap: 'break-word',
    marginBottom: 16,
  },
  subtitle: {
    color: '#6B7685',
    fontSize: 14,
    fontFamily: 'SF Pro',
    fontWeight: '400',
    lineHeight: 21,

    wordWrap: 'break-word',
  },
  conditionContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  conditionHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  iconPlaceholder: {
    width: 48,
    height: 48,
    backgroundColor: '#AFB0CC',
    borderRadius: 24,
    marginRight: 16,
  },
  conditionDetails: {
    flex: 1,
  },
  conditionName: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'SF Pro',
    fontWeight: '510',
    lineHeight: 22.65,
  },
  riskText: {
    fontSize: 12,
    fontFamily: 'SF Pro',
    fontWeight: '510',
    lineHeight: 28,
  },
  description: {
    color: '#323D4C',
    fontSize: 13,
    fontFamily: 'SF Pro',
    fontWeight: '400',
    lineHeight: 22.65,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  viewButton: {
    borderColor: '#237AF2',
    borderWidth: 1,
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  viewButtonText: {
    color: '#237AF2',
    fontSize: 12,
    fontFamily: 'SF Pro',
    fontWeight: '510',
    lineHeight: 22.65,
  },
  addButton: {
    backgroundColor: '#237AF2',
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addedButton: {
    backgroundColor: '#237AF2',
  },
  addButtonText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'SF Pro',
    fontWeight: '510',
    lineHeight: 22.65,
    marginRight: 4,
  },
  continueButton: {
    backgroundColor: '#237AF2',
    borderRadius: 8,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'SF Pro',
    fontWeight: '500',
  },
  icon: {
    marginRight: 4,  // Adds space between the icon and the text
  },
});

export default PotentialConditionPageScreen;
