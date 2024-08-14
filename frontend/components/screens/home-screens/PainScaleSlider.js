import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import Slider from '@react-native-community/slider';

const PainScaleSlider = ({ painScale, setPainScale, onSubmit }) => {

  const getPainScaleColor = (value) => {
    if (value <= 2) return '#72D8CA'; // Light green for low pain
    if (value <= 4) return '#79CFC1'; // Green for slightly higher pain
    if (value <= 6) return '#FFC107'; // Yellow for medium pain
    if (value <= 8) return '#F39189'; // Light red for higher pain
    return '#CE5476'; // Red for high pain
  };

  return (
    <View style={styles.container}>
      <View style={styles.sliderWrapper}>
        <View style={styles.sliderContainer}>
          <View style={styles.segmentedBarWrapper}>
            <View style={[styles.segment, { backgroundColor: '#72D8CA' }]} />
            <View style={[styles.segment, { backgroundColor: '#79CFC1' }]} />
            <View style={[styles.segment, { backgroundColor: '#FFC107' }]} />
            <View style={[styles.segment, { backgroundColor: '#F39189' }]} />
            <View style={[styles.segment, { backgroundColor: '#CE5476' }]} />
          </View>

          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={10}
            step={1}
            value={painScale}
            onValueChange={setPainScale}
            minimumTrackTintColor="transparent"
            maximumTrackTintColor="transparent"
            thumbTintColor={getPainScaleColor(painScale)}
          />
        </View>

        <Text style={[styles.painScaleText, { color: getPainScaleColor(painScale) }]}>
          {painScale}
        </Text>

        <View style={styles.labelWrapper}>
          <Text style={styles.labelNotSevere}>not severe</Text>
          <Text style={styles.labelVerySevere}>very severe</Text>
        </View>

        <Button title="Select severity" onPress={onSubmit} color="#3182F6" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  sliderWrapper: {
    width: '100%',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  sliderContainer: {
    width: '100%',
    height: 30,
    justifyContent: 'center',
  },
  segmentedBarWrapper: {
    flexDirection: 'row',
    height: 4,
    width: '100%',
    position: 'absolute',
    top: 10,
  },
  segment: {
    flex: 1,
    borderRadius: 2,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  painScaleText: {
    position: 'absolute',
    top: -15,
    fontSize: 23,
    fontFamily: 'SF Pro',
    fontWeight: '510',
    textAlign: 'center',
    width: '100%',
  },
  labelWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  labelNotSevere: {
    fontSize: 13,
    color: '#72D8CA',
    fontWeight: '510',
  },
  labelVerySevere: {
    fontSize: 13,
    color: '#CE5476',
    fontWeight: '510',
  },
});

export default PainScaleSlider;
