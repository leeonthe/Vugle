import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView , Modal} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Divider from '../../../assets/divider.svg';
import TimeIcon from '../../../assets/time.svg';
import DistanceIcon from '../../../assets/distance.svg';
import FullStar from '../../../assets/full-star.svg';
import HalfStar from '../../../assets/half-star.svg';
import { Ionicons } from '@expo/vector-icons'; 

const HospitalDetailScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);

  const route = useRoute();
  const { hospitalName } = route.params;

  const handleAppointmentPress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };
  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.container}>
        <Image
          source={require('../../../assets/hospital1.png')} // Use actual image from assets
          style={styles.hospitalImage}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.hospitalName}>{hospitalName}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>4.5</Text>
            {Array.from({ length: 4 }).map((_, index) => (
                  <FullStar key={index} style={styles.star} />
                ))}
                <HalfStar style={styles.halfStar} />
            <Text style={styles.ratingText}>(3)</Text>
            <Text style={styles.hospitalType}> • Veterans hospital</Text>
          </View>
          <View style={[styles.dividerLine, {marginBottom: 13, marginTop: 13}]} />
         
          <Text style={styles.distance}>  <DistanceIcon style={{marginRight: 10}}/>0.7 mi
            <Text style={styles.address}> • 401 3rd St, San Francisco</Text>
          </Text>
          <Text style={styles.availability}> <TimeIcon style={{marginRight: 10, marginBottom: -4}}/>
            Open now <Text style={styles.timeOpenText }>• Today 8 AM - 4:30 PM</Text>
          </Text>


          <View style={[styles.dividerLine, {marginBottom: 4}]} />

          <View style={styles.tagsContainer}>
            <Text style={styles.tag}>Primary care</Text>
            <Text style={styles.tag}>LGBTQ+ care</Text>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <View style={styles.tab}>
            <Text style={styles.activeTabText}>Overview</Text>
            <View style={styles.activeTabIndicator} />
          </View>
          <View style={styles.tab}>
            <Text style={styles.inactiveTabText}>Clinic</Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
            <Text style={styles.sectionTitle}>Open hours</Text>
            <Text style={styles.openNow}>Open now</Text>

            <View style={styles.hoursBox}>
                <Text style={styles.dayTodayText}>Today</Text>
                <Text style={styles.timeTodayText}>8 AM - 4:30 PM</Text>
            </View>

            <View style={styles.weekHoursContainer}>
                <View style={styles.rowContainer}>
                <View style={styles.dayContainer}>
                    <Text style={styles.dayText}>Wednesday</Text>
                    <Text style={styles.timeText}>8 AM - 4:30 PM</Text>
                </View>
                <View style={styles.dayContainer}>
                    <Text style={styles.dayText}>Thursday</Text>
                    <Text style={styles.timeText}>8 AM - 4:30 PM</Text>
                </View>
                </View>
                <View style={styles.rowContainer}>
                <View style={styles.dayContainer}>
                    <Text style={styles.dayText}>Friday</Text>
                    <Text style={styles.timeText}>8 AM - 4:30 PM</Text>
                </View>
                <View style={styles.dayContainer}>
                    <Text style={{ color: 'blue', paddingBottom: 8, paddingTop: 2}}>Saturday</Text>
                    <Text style={styles.closedText}>Closed</Text>
                </View>
                </View>
                <View style={styles.rowContainer}>
                <View style={styles.dayContainer}>
                    <Text style={[styles.closedText, {paddingBottom: 8, paddingTop: 2}]}>Sunday</Text>
                    <Text style={styles.closedText}>Closed</Text>
                </View>
                <View style={styles.dayContainer}>
                    <Text style={styles.dayText}>Monday</Text>
                    <Text style={styles.timeText}>8 AM - 4:30 PM</Text>
                </View>
                </View>
            </View>
        </View>

        <View style={styles.dividerLine} />

        {/* About Us Section */}
        <View style={styles.aboutUsContainer}>
          <Text style={styles.aboutUsTitle}>About us</Text>
          <View style={styles.aboutUsContentContainer}>
            <Text style={styles.aboutUsText}>
              At San Francisco VA Health Care System, our mission is to honor Veterans, their families, and caregivers by offering exceptional care that improves their health and well-being.
              {"\n\n"}
              With an unparalleled reputation as providers of the most complex care across VHA, we have a long-history of conducting cutting-edge research, establishing innovative medical programs, and providing compassionate care. Notably, for over 60 years, the Medical Center's affiliation with the University of California, San Francisco (UCSF) ensures that all physicians are jointly recruited with UCSF School of Medicine.
            </Text>
          </View>
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <View style={styles.dividerCircle}>
                <Divider />
              {/* <View style={styles.arrow} /> */}
            </View>
            <View style={styles.dividerLine} />
          </View>
        </View>

        
        {/* Clinics Section */}
        <View style={styles.clinicsContainer}>
          <View style={styles.clinicsHeader}>
            <Text style={styles.clinicsTitle}>Clinics</Text>
            <Text style={styles.clinicsCount}>6</Text>
          </View>
          <View style={styles.clinicTagsContainer}>
            <View style={styles.clinicTag}>
              <Text style={styles.clinicTagText}>Primary care</Text>
            </View>
            <View style={styles.clinicTag}>
              <Text style={styles.clinicTagText}>Mental health care</Text>
            </View>
            <View style={styles.clinicTag}>
              <Text style={styles.clinicTagText}>Specialty care</Text>
            </View>
            <View style={styles.clinicTag}>
              <Text style={styles.clinicTagText}>Social programs</Text>
            </View>
            <View style={styles.clinicTag}>
              <Text style={styles.clinicTagText}>Other</Text>
            </View>
          </View>

          <View style={styles.clinicSeparator} />

          <View style={styles.subClinicsContainer}>
            <View style={styles.subClinicRow}>
              <View style={styles.subClinicTag}>
                <Text style={styles.subClinicTagText}>Geriatrics</Text>
              </View>
              <View style={styles.subClinicTag}>
                <Text style={styles.subClinicTagText}>Gynecology</Text>
              </View>
              <View style={styles.subClinicTag}>
                <Text style={styles.subClinicTagText}>Pharmacy</Text>
              </View>
              <View style={styles.subClinicTag}>
                <Text style={styles.subClinicTagText}>Pharmacy</Text>
              </View>
              <View style={styles.subClinicTag}>
                <Text style={styles.subClinicTagText}>Women Veteran care</Text>
              </View>
            </View>

            <View style={styles.subClinicRow}>
              <View style={styles.subClinicTag}>
                <Text style={styles.subClinicTagText}>PTSD care</Text>
              </View>
              <View style={styles.subClinicTag}>
                <Text style={styles.subClinicTagText}>Suicide prevention</Text>
              </View>
              <View style={styles.subClinicTag}>
                <Text style={styles.subClinicTagText}>Audiology</Text>
              </View>
              <View style={styles.subClinicTag}>
                <Text style={styles.subClinicTagText}>Cardiology</Text>
              </View>
              <View style={styles.subClinicTag}>
                <Text style={styles.subClinicTagText}>Dermatology</Text>
              </View>
            </View>

            <View style={styles.subClinicRow}>
              <View style={styles.subClinicTag}>
                <Text style={styles.subClinicTagText}>Endocrinology</Text>
              </View>
              <View style={styles.subClinicTag}>
                <Text style={styles.subClinicTagText}>Gastroenterology</Text>
              </View>
              <View style={styles.subClinicTag}>
                <Text style={styles.subClinicTagText}>Neurology</Text>
              </View>
              <View style={styles.subClinicTag}>
                <Text style={styles.subClinicTagText}>Otolaryngology</Text>
              </View>
              <View style={styles.subClinicTag}>
                <Text style={styles.subClinicTagText}>Podiatry</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.appointmentButton} onPress={handleAppointmentPress}>
          <Text style={styles.appointmentButtonText}>Schedule an appointment</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for showing phone number */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <View style={styles.phoneNumberHeader}>
              <Ionicons name="call" size={24} color="#434343" style={styles.phoneIcon} />
              <Text style={styles.phoneNumberText}>Call +1 (415) 729 9656</Text>
            </View>
            <View style={styles.separator} />
            <TouchableOpacity onPress={handleCloseModal} style={styles.cancelButtonContainer}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F2F4F7',
  },
  container: {
    flex: 1,

  },
  hospitalImage: {
    width: '100%',
    height: 200,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: 'white',
  },
  hospitalName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#191F28',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
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
  rating: {
   color: '#6B7685', fontSize: 12, fontFamily: 'SF Pro', fontWeight: '510', wordWrap: 'break-word'
  },
  ratingText: {
    color: '#6B7685', fontSize: 12, fontFamily: 'SF Pro', fontWeight: '510', wordWrap: 'break-word'

  },
  hospitalType: {
    color: '#6B7685', fontSize: 12, fontFamily: 'SF Pro', fontWeight: '510', wordWrap: 'break-word', lineHeight: 28,

  },
  distance: {
    color: 'black', fontSize: 12, fontFamily: 'SF Pro', fontWeight: '510', wordWrap: 'break-word', marginTop: 4, marginBottom: 15
  },
  address: {
    color: '#6B7685', fontSize: 12, fontFamily: 'SF Pro', fontWeight: '510', lineHeight: 28, wordWrap: 'break-word'
    ,marginTop: 4,
  },
  availability: {
    color: "#29B274", 
    fontSize: 12, 
    fontFamily: 'SF Pro', 
    fontWeight: '510', 
    wordWrap: 'break-word',
    marginBottom: 25,
  },
  timeOpenText: {
    color: "#6B7685", fontSize: 12, fontFamily: 'SF Pro', fontWeight: '510', lineHeight: 28, wordWrap: 'break-word'
  },

  tagsContainer: {
    flexDirection: 'row',
    marginTop: 8,
    borderRadius: 20,

  },
  tag: {
    backgroundColor: '#F2F4F7',
    padding: 3,
    marginRight: 8,
    fontSize: 10.50,
    color: '#6B7685',
    fontFamily: 'SF Pro',
    fontWeight: '510',
    lineHeight: 28,
    wordWrap: 'break-word',
    paddingLeft: 4, 
    paddingRight: 4,
    paddingTop: 2,
    paddingBottom: 2,
    justifyContent: 'center', alignItems: 'center', gap: 10, display: 'inline-flex',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 20,
    marginTop: 20,
    marginBottom: -8,

  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  activeTabText: {
    marginBottom: 13,
    
    fontSize: 16,
    fontWeight: 'bold',
    color: '#191F28',
  },
  inactiveTabText: {
    fontSize: 16,
    color: '#808799',
  },
  activeTabIndicator: {
    height: 2,
    backgroundColor: 'black',
    width: '100%',
    marginTop: 4,
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: 'white',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  openNow: {
    fontSize: 14,
    color: '#29B274',
    marginTop: 4,
  },
  hoursBox: {
    padding: 16,
    backgroundColor: '#E5F2FF',
    borderRadius: 8,
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
},
  dayText: {
    color: 'black',
    fontSize: 13,
    fontFamily: 'SF Pro',
    fontWeight: '590',
    lineHeight: 22,

    wordWrap: 'break-word',

  },
  timeText: {
    color: 'black',
    fontSize: 13,
    fontFamily: 'SF Pro',
    fontWeight: '510',
    lineHeight: 22,
    wordWrap: 'break-word',
  },
  dayTodayText: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'SF Pro',
    fontWeight: '590',
    lineHeight: 28,
    wordWrap: 'break-word',
    marginLeft: 13,
  },
  timeTodayText: {
    color: 'black',
    fontSize: 13,
    fontFamily: 'SF Pro',
    fontWeight: '590',
    lineHeight: 28,
    wordWrap: 'break-word',
    marginRight: 24,
    
  },
  weekHoursContainer: {
    backgroundColor: '#F2F4F7', 
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 30,
    marginLeft: 15,
  },
  dayContainer: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // marginBottom: 8,
    flex: 1,
    paddingRight: 16,
    paddingLeft: 16,

  },
  closedText: {
    fontSize: 14,
    color: '#F64F5E',
  },
  aboutUsContainer: {
    width: '100%',
    padding: 24,
    backgroundColor: 'white',
  },
  aboutUsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
    lineHeight: 22,
  },
  aboutUsContentContainer: {
    padding: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  aboutUsText: {
    width: 345,
    fontSize: 12,
    color: '#31353F',
    lineHeight: 22,
  },
  dividerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  dividerLine: {
    height: 1,
    flex: 1,
    backgroundColor: '#E5E8EB',
  },
  dividerCircle: {
    width: 26,
    height: 26,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#E9EBEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  arrow: {
    width: 6,
    height: 10,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#B0B8C1',
    transform: [{ rotate: '90deg' }],
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E8EB',
    alignItems: 'center',
  },
  appointmentButton: {
    backgroundColor: '#237AF2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  appointmentButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingBottom: 20,
    alignItems: 'center',
    width: '100%',
  },
  phoneNumberHeader: {
    width: '100%',
    paddingTop: 17,
    paddingBottom: 17,
    paddingRight: 133,
    borderBottomWidth: 0.33,
    borderBottomColor: 'rgba(128, 128, 128, 0.55) solid',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  phoneIcon: {
    marginLeft: 24,
  },
  phoneNumberText: {
    textAlign: 'center',
    color: '#007AFF',
    fontSize: 17,
    fontFamily: 'SF Pro',
    fontWeight: '400',
    lineHeight: 22,
    marginLeft: 25,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(153, 153, 153, 0.97)',
  },
  cancelButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  cancelButton: {
    fontSize: 18,
    color: '#007AFF',
  },
  clinicsContainer: {
    width: '100%',
    padding: 24,
    backgroundColor: 'white',
  },
  clinicsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 26,
  },
  clinicsTitle: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  clinicsCount: {
    color: '#7A7A7A',
    fontSize: 13,
    fontWeight: '510',
    lineHeight: 22,
    marginLeft: 4,
  },
  clinicTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 26,
  },
  clinicTag: {
    padding: 10,
    backgroundColor: '#F2F4F7',
    borderRadius: 8,
  },
  clinicTagText: {
    color: '#454545',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 22,
  },
  clinicSeparator: {
    width: '100%',
    height: 1,
    backgroundColor: '#F2F4F7',
    marginBottom: 26,
  },
  subClinicsContainer: {
    width: '100%',
  },
  subClinicRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  subClinicTag: {
    padding: 2,
    backgroundColor: '#F2F4F7',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subClinicTagText: {
    color: '#808799',
    fontSize: 9.5,
    fontWeight: '400',
    lineHeight: 22,
  },
});

export default HospitalDetailScreen;
