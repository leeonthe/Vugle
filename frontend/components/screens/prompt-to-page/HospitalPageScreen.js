import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import FilterIcon from '../../../assets/filter-icon.svg';
import FullStar from '../../../assets/full-star.svg';
import HalfStar from '../../../assets/half-star.svg';
import BlankStar from '../../../assets/blank-star.svg';
import HospitalImage from '../../../assets/hospital1.png'; // Assume this is the correct path to your image
import HospitalImage2 from '../../../assets/hospital2.png'; // Assume this is the correct path to your image
import HospitalImage3 from '../../../assets/hospital3.png'; // Assume this is the correct path to your image
import HospitalImage4 from '../../../assets/hospital4.png'; // Assume this is the correct path to your image
import HospitalImage5 from '../../../assets/hospital5.png'; // Assume this is the correct path to your image
const HospitalPageScreen = () => {
  const navigation = useNavigation();

  const handlePress = (hospitalName) => {
    navigation.navigate('HospitalDetailScreen', { hospitalName });
  };

  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>VA Medicals</Text>
          <Text style={styles.headerSubtitle}>– 1150 clay st.</Text>
        </View>
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <FilterIcon style={styles.filterIcon} />
          <Text style={styles.filterItem}>Open Now</Text>
          <Text style={styles.filterItem}>Online appointment</Text>
          <Text style={styles.filterItem}>Virtual visit</Text>
          <Text style={styles.filterItem}>Wheelchair accessible</Text>
          <Text style={styles.filterItem}>Include Private Clinics</Text>
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.resultsContainer}>
        <View style={styles.resultsHeaderContainer}>
          <Text style={styles.resultsHeader}>13 results</Text>
          <Text style={styles.availabilityHeader}>Availability</Text>
        </View>

        <TouchableOpacity onPress={() => handlePress('San Francisco VA Center')}>
          <View style={styles.resultItem}>
            <View style={styles.resultInfo}>
              <Text style={styles.resultTitle}>San Francisco VA Center</Text>
              <View style={styles.resultRatingContainer}>
                <Text style={styles.resultRating}>4.5</Text>
                <View style={styles.resultStars}>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <FullStar key={index} style={styles.star} />
                  ))}
                  <HalfStar style={styles.halfStar} />
                </View>
              </View>
              <View style={styles.resultDistanceContainer}>
                <Text style={styles.resultDistance}>0.7 mi</Text>
                <Text style={styles.resultType}>Veterans hospital</Text>
              </View>
              <Text style={styles.resultAddress}>401 3rd St, San Francisco</Text>
              <Text style={styles.resultAppointment}>Appointment by call</Text>
              <Text style={styles.resultAvailability}>Available today</Text>
            </View>
            <Image
              source={HospitalImage}
              style={styles.resultImage}
              resizeMode="cover"
            />
          </View>
        </TouchableOpacity>

        {/* Add more result items here */}
        <TouchableOpacity onPress={() => handlePress('San Francisco VA Downtown')}>
          <View style={styles.resultItem}>
            <View style={styles.resultInfo}>
              <Text style={styles.resultTitle}>San Francisco VA Downtown</Text>
              <View style={styles.resultRatingContainer}>
                <Text style={styles.resultRating}>4.3</Text>
                <View style={styles.resultStars}>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <FullStar key={index} style={styles.star} />
                  ))}
                  <BlankStar style={styles.star} />
                </View>
              </View>
              <View style={styles.resultDistanceContainer}>
                <Text style={styles.resultDistance}>5.5 mi</Text>
                <Text style={styles.resultType}>Medical clinic</Text>
              </View>
              <Text style={styles.resultAddress}>4150 Clement St, San Francisco</Text>
              <Text style={styles.resultAppointment}>Online appointment</Text>
              <Text style={styles.resultAvailability}>Available Tuesday</Text>
            </View>
            <Image
              source={HospitalImage2}
              style={styles.resultImage}
              resizeMode="cover"
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handlePress('San Bruno VA Clinic')}>                
          <View style={styles.resultItem}>
            <View style={styles.resultInfo}>
              <Text style={styles.resultTitle}>San Bruno VA Clinic</Text>
              <View style={styles.resultRatingContainer}>
                <Text style={styles.resultRating}>4.0</Text>
                <View style={styles.resultStars}>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <FullStar key={index} style={styles.star} />
                  ))}
                  <BlankStar style={styles.star} />
                  <BlankStar style={styles.star} />

                </View>
              </View>
              <View style={styles.resultDistanceContainer}>
                <Text style={styles.resultDistance}>3.7 mi</Text>
                <Text style={styles.resultType}>Medical clinic</Text>
              </View>
              <Text style={styles.resultAddress}>3801 Miranda Ave, San Francisco</Text>
              <Text style={styles.resultAppointment}>Appointment by call</Text>
              <Text style={styles.resultAvailability}>Available Wednesday</Text>
            </View>
            <Image
              source={HospitalImage5}
              style={styles.resultImage}
              resizeMode="cover"
            />
          </View>
        </TouchableOpacity>            

        <View style={styles.resultItem}>
          <View style={styles.resultInfo}>
            <Text style={styles.resultTitle}>Palo Alto VA Medical Center</Text>
            <View style={styles.resultRatingContainer}>
              <Text style={styles.resultRating}>3.5</Text>
              <View style={styles.resultStars}>
                {Array.from({ length: 3 }).map((_, index) => (
                  <FullStar key={index} style={styles.star} />
                ))}
                <HalfStar style={styles.star} />
                <BlankStar style={styles.star} />

              </View>
            </View>
            <View style={styles.resultDistanceContainer}>
              <Text style={styles.resultDistance}>11 mi</Text>
              <Text style={styles.resultType}>Veterans hospital</Text>
            </View>
            <Text style={styles.resultAddress}>5855 Silver Creek PI</Text>
            <Text style={styles.resultAppointment}>Appointment by call</Text>
            <Text style={styles.resultAvailability}>Available Friday</Text>
          </View>
          <Image
            source={HospitalImage3}
            style={styles.resultImage}
            resizeMode="cover"
          />
        </View>
        {/* Repeat for other results... */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F4F7',
  },
  header: {
    paddingTop: 54,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  headerContent: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 10,
    paddingRight: 80,
    paddingLeft: 80,
    backgroundColor: '#F2F4F7',
    borderRadius: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#323D4C',
    fontSize: 13,
    fontFamily: 'SF Pro',
    fontWeight: '590',
    lineHeight: 28,
    wordWrap: 'break-word',
  },
  headerSubtitle: {
    color: '#6B7685',
    fontSize: 13,
    fontFamily: 'SF Pro',
    fontWeight: '510',
    lineHeight: 28,
    marginLeft: 8,
    wordWrap: 'break-word',
  },
  filtersContainer: {
    backgroundColor: 'white',
    paddingVertical: 10,
  },
  filterIcon: {
    marginLeft: 20,
    marginRight: 10,
    marginTop: 3,
    
  },
  filterItem: {
    fontSize: 13,
    fontFamily: 'SF Pro',
    fontWeight: '510',
    color: '#323D4C',
    
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 15,
    borderColor: '#C8C7CC',
    borderWidth: 1,
    marginHorizontal: 5,
  },
  resultsContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  resultsHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Ensures both texts are aligned vertically in the center
    marginBottom: 19,
    marginTop: 12,
  },
  resultsHeader: {
    fontSize: 12,
    fontFamily: 'SF Pro',
    fontWeight: '510',
    color: '#6B7685',
  },
  availabilityHeader: {
    fontSize: 12,
    fontFamily: 'SF Pro',
    fontWeight: '510',
    color: '#323D4C',
  },
  resultItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    elevation: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultInfo: {
    maxWidth: '70%',
  },
  resultTitle: {
    fontSize: 16,
    fontFamily: 'SF Pro',
    fontWeight: '510',
    color: '#191F28',
    lineHeight: 28,
  },
  resultRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  resultRating: {
    fontSize: 12,
    fontFamily: 'SF Pro',
    fontWeight: '510',
    color: '#6B7685',
  },
  resultStars: {
    flexDirection: 'row',
    marginLeft: 4,
  },
  star: {
    width: 12,
    height: 11.33,
    marginLeft: 2,
  },
  halfStar: {
    width: 6,
    height: 11.33,
    marginLeft: 2,

  },
  resultDistanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  resultDistance: {
    fontSize: 12,
    fontFamily: 'SF Pro',
    fontWeight: '510',
    color: '#6B7685',
    marginRight: 4,
  },
  resultType: {
    fontSize: 12,
    fontFamily: 'SF Pro',
    fontWeight: '510',
    color: '#6B7685',
  },
  resultAddress: {
    fontSize: 12,
    fontFamily: 'SF Pro',
    fontWeight: '510',
    color: '#6B7685',
    marginTop: 4,
  },
  resultAppointment: {
    fontSize: 12,
    fontFamily: 'SF Pro',
    fontWeight: '510',
    color: '#6B7685',
    marginTop: 4,
  },
  resultAvailability: {
    fontSize: 13,
    fontFamily: 'SF Pro',
    fontWeight: '510',
    color: '#237AF2',
    marginTop: 4,
  },
  resultImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  
});

export default HospitalPageScreen;
