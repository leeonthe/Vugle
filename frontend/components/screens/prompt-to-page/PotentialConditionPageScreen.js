import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const PotentialConditionPageScreen = () => {
  const [selectedConditions, setSelectedConditions] = useState({});
  const [conditions, setConditions] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    if (route.params && route.params.potentialConditions) {
      setConditions(route.params.potentialConditions);
    }
  }, [route.params]);

  const toggleCondition = (conditionName) => {
    setSelectedConditions((prevSelected) => ({
      ...prevSelected,
      [conditionName]: !prevSelected[conditionName],
    }));
  };

  const handleContinue = () => {
    const addedConditions = Object.keys(selectedConditions).filter(key => selectedConditions[key]);

    if (route.params && route.params.onReturn) {
      route.params.onReturn(addedConditions);
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

      {conditions.map((condition, index) => (
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
              <Text style={styles.addButtonText}>
                {selectedConditions[condition.name] ? 'Added' : 'Add'}
              </Text>
              {selectedConditions[condition.name] && (
                <View style={styles.checkIcon}>
                  <View style={styles.checkIconPart} />
                  <View style={styles.checkIconPart} style={{ transform: [{ rotate: '45deg' }] }} />
                </View>
              )}
              {!selectedConditions[condition.name] && (
                <View style={styles.addIcon}>
                  <View style={styles.addHorizontal} />
                  <View style={styles.addVertical} />
                </View>
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
    backgroundColor: '#F7F9FD',
    padding: 20,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    color: '#191F28',
    fontSize: 20,
    fontFamily: 'SF Pro',
    fontWeight: '590',
    lineHeight: 28,
  },
  subtitle: {
    color: '#6B7685',
    fontSize: 14,
    fontFamily: 'SF Pro',
    fontWeight: '400',
    lineHeight: 21,
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
    backgroundColor: '#237AF2', // Green color when added
  },
  addButtonText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'SF Pro',
    fontWeight: '510',
    lineHeight: 22.65,
    marginRight: 4,
  },
  addIcon: {
    width: 10,
    height: 10,
    position: 'relative',
  },
  addHorizontal: {
    width: 10,
    height: 1.25,
    backgroundColor: 'white',
    position: 'absolute',
    top: 4.38,
  },
  addVertical: {
    width: 1.25,
    height: 10,
    backgroundColor: 'white',
    position: 'absolute',
    left: 4.38,
  },
  checkIcon: {
    width: 10,
    height: 10,
    backgroundColor: 'white',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIconPart: {
    width: 7,
    height: 1.5,
    backgroundColor: '#237AF2', // Green color for check
  },
  continueButton: {
    backgroundColor: '#237AF2',
    borderRadius: 8,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'SF Pro',
    fontWeight: '500',
  },
});

export default PotentialConditionPageScreen;
