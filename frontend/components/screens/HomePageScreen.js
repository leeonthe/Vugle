import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Rect } from 'react-native-svg';
import { useVeteranData } from '../../APIHandler';



// SVG for home 
import DisabilityIcon from '../../assets/assets-home/disability_icon.svg';
import CompensationIcon from '../../assets/assets-home/monthly_compensation.svg';
import NotificationIcon from '../../assets/assets-home/notification_icon.svg';
import ExploreIcon from '../../assets/assets-home/explore_icon.svg';

import Document from '../../assets/assets-home/document-icon.svg';
import CloseIcon from '../../assets/assets-home/closeIcon.svg';
import Home from '../../assets/assets-home/home-icon.svg';
import Explore from '../../assets/assets-home/explore_icon.svg';
import Consult from '../../assets/assets-home/consult-icon.svg';
import Loan from '../../assets/assets-home/loan-icon.svg';
function HomePage() {
  const { userInfo, eligibleLetters, statusInfo, loading, error } = useVeteranData();
  const navigation = useNavigation();
  let combinedDisabilityRating = 'N/A';
  let veteranStatus = 'N/A';
  let monthlyCompensation = 'NULL';

  if (userInfo.disabilityRating) {
    const parsedDisabilityRating = JSON.parse(JSON.stringify(userInfo.disabilityRating));
    if (parsedDisabilityRating.data && parsedDisabilityRating.data.attributes) {
      combinedDisabilityRating = parsedDisabilityRating.data.attributes.combined_disability_rating;
      veteranStatus = parsedDisabilityRating.data.id; // THIS IS ICN VALUE. 
    }
  }

  
  if (eligibleLetters.benefitInformation) {
    monthlyCompensation = `${eligibleLetters.benefitInformation.monthlyAwardAmount.value}`;
  }
  if (userInfo.status) {
    const parsedStatus = JSON.parse(JSON.stringify(userInfo.status));
    if (parsedStatus.data && parsedStatus.data.attributes) {
      veteranStatus = parsedStatus.data.attributes.veteran_status;
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Home</Text>
        <NotificationIcon style={styles.notificationIcon} />

      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderText}>
                Earn additional {'\n'}
                <Text style={styles.cardHeaderHighlight}>$28,511 </Text>
                benefits annually
              </Text>
              
              <CloseIcon />
              
            </View>
            <View style={styles.averageIncrease}>
              <Text style={styles.averageIncreaseText}>
                <Text style={styles.averageIncreaseHighlight}>Average increase </Text>
                for our veterans
              </Text>
            </View>
            <View style={styles.graphContainer}>
              <View style={styles.graphItem}>
                <View style={styles.barsContainer}>
                  <View style={styles.barGroup}>
                    <Text style={styles.barLabel}>60%</Text>
                    <View style={styles.barLow} />
                  </View>
                  <View style={styles.barGroup}>
                    <Text style={styles.barLabelHighlight}>90%</Text>
                    <View style={styles.barHigh} />
                  </View>
                </View>
                <Text style={styles.graphLabel}>Disability rating</Text>
              </View>
              <View style={[styles.graphItem, styles.graphItemMargin]}>
                <View style={styles.barsContainer}>
                  <View style={styles.barGroup}>
                    <Text style={styles.barLabel}>$1,362</Text>
                    <View style={styles.barLow} />
                  </View>
                  <View style={styles.barGroup}>
                    <Text style={styles.barLabelHighlight}>$3,737</Text>
                    <View style={styles.barHigh} />
                  </View>
                </View>
                <Text style={styles.graphLabel}>Monthly comp.</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ConsultPageScreen')}>
            <Text style={styles.buttonText}>How much I can earn?</Text>
          </TouchableOpacity>
        </View>

        {/* New Section */}
        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <View style={styles.infoLeft}>
             {/* SVG HERE */}
              <DisabilityIcon style={styles.infoIcon} />

              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>Disability rating</Text>
                <Text style={styles.infoValue}>{combinedDisabilityRating}%</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.infoRight} onPress={() => navigation.navigate('StatsDisabilityPage')}>
              <Text style={styles.viewText}>View</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoLeft}>
              <CompensationIcon style={styles.infoIcon} />  
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>Monthly compensation</Text>
                <Text style={styles.infoValue}>{monthlyCompensation !== 'NULL' ? `$${monthlyCompensation}` : 'NULL'}</Text>


              </View>
            </View>
            <TouchableOpacity style={styles.infoRight} onPress={() => navigation.navigate('StatsCompPage')}>
              <Text style={styles.viewText}>View</Text>
            </TouchableOpacity>
          </View>
        </View>
              

        {/* Claims Status */}
        <View style={styles.claimsStatusContainer}>
          <View style={styles.claimsStatusHeader}>
            <Text style={styles.claimsStatusTitle}>Claims status</Text>
            <View style={styles.claimsStatusIcon} />
          </View>
          <View style={styles.claimsStatusContent}>
            <View style={styles.claimsStatusRow}>
              <View style={styles.claimStatusIconContainer}>
                <Text>💌</Text> 
              </View>
              <View style={styles.claimsStatusTextContainer}>
                <Text style={styles.claimsStatusTextGray}>Aug 4 Sunday</Text>
                <Text style={styles.claimsStatusTextBlack}>VA received your medical evidence</Text>
              </View>
            </View>
          </View>
        </View>

        {/* My Documents */}
        <View style={styles.myDocumentsContainer}>
          <View style={styles.myDocumentsContent}>
            <View style={styles.myDocumentsRow}>
              <View style={styles.myDocumentsTextContainer}>
                
                <Text style={styles.myDocumentsTitle}>My documents</Text>
                <Text style={styles.myDocumentsSubtitle}>Sevice treatment records</Text>
                <Text style={styles.myDocumentsSubtitle}>Medical records</Text>
                
              </View>
            <Document style={styles.myDocumentsIcon} />

            </View>
          </View>
        </View>

        {/* Current Resources */}
        <View style={styles.currentResourcesContainer}>
          <View style={styles.currentResourcesHeader}>
            <Text style={styles.currentResourcesTitle}>Current resources</Text>
            <View style={styles.currentResourcesIcon} />
          </View>
          <View style={styles.currentResourcesContent}>
            {/* GI Bill */}
            <View style={styles.resourceRow}>
              <View style={styles.resourceRowContent}>
              <Image style={styles.resourceIcon} source={require('../../assets/assets-home/giBill.png')} />
              <View style={styles.resourceTextContainer}>
                  <Text style={styles.resourceTitle}>GI Bill 2024</Text>

                  <Text style={styles.resourceAmount}>$2,680</Text>
                </View>
              </View>
              <View style={styles.resourceIconArrow} />
            </View>
            {/* Housing Support */}
            <View style={styles.resourceRow}>
              <View style={styles.resourceRowContent}>
                <Image style={styles.resourceIcon} source={require('../../assets/assets-home/HomeLoan.png')} />
                <View style={styles.resourceTextContainer}>
                  <Text style={styles.resourceTitle}>VA Home Loan Guaranty</Text>
                  <Text style={styles.resourceAmount}>$1,808</Text>
                </View>
              </View>
              <View style={styles.resourceIconArrow} />
            </View>
            {/* Travel Reimbursement */}
            <View style={styles.resourceRow}>
              <View style={styles.resourceRowContent}>
              <Image style={styles.resourceIcon} source={require('../../assets/assets-home/Reimburse.png')} />
              <View style={styles.resourceTextContainer}>
                  <Text style={styles.resourceTitle}>Travel reimbursement</Text>
                  <Text style={styles.resourceAmount}>$586</Text>
                </View>
              </View>
              <View style={styles.resourceIconArrow} />
            </View>
            {/* Explore More Benefits */}
            <View style={styles.exploreMoreContainer}>
              <View style={styles.exploreMoreContent}>
                <View style={styles.exploreMoreIconContainer}>
                  <View style={styles.exploreMoreIcon} />
                </View>
                <Text style={styles.exploreMoreText}>Explore more benefits you’re eligible</Text>
                <View style={styles.resourceIconArrow} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('HomePage')}>

          <Home style={styles.navIcon} />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ConsultPageScreen')}>
          <Consult style={styles.navIcon} />
          <Text style={styles.navTextInactive}>Consult</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ExplorePageScreen')}>
          <Explore style={styles.navIcon} />
          <Text style={styles.navTextInactive}>Benefits</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('LoanPageScreen')}>
          <Loan style={styles.navIcon} />
          <Text style={styles.navTextInactive}>Loan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FD',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 30, //placing container: Earn additional $16,286 benefits annually
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
  },
  notificationIcon: {
    width: 25,
    height: 25,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 24,
  },
  cardContent: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  cardHeaderText: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 26,
    color: '#1B1F23',
  },
  cardHeaderHighlight: {
    color: '#237AF2',
  },
 
  averageIncrease: {
    backgroundColor: '#F2F7FE',
    borderRadius: 8,
    padding: 8,
    marginBottom: 24,
    marginRight: 119, 
  },
  averageIncreaseText: {
    fontSize: 10.5,
    fontWeight: '510',
    lineHeight: 12,
    textAlign: 'center',

  },
  averageIncreaseHighlight: {
    color: '#237AF2',
  },
  graphContainer: {
    color: '#F7F9FD',
    flexDirection: 'row',
    justifyContent: 'space-around', 
    width: '100%',
    marginBottom: 22,
  },
  graphItem: {
    alignItems: 'center',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  barGroup: {
    alignItems: 'center',
    marginHorizontal: 2, 
  },
  barLabel: {
    color: '#575757',
    fontSize: 10.5,
    lineHeight: 22,
    marginBottom: 4,
  },
  barLabelHighlight: {
    color: '#237AF2',
    fontSize: 10.5,
    lineHeight: 22,
    marginBottom: 4,
  },
  barLow: {
    width: 18,
    height: 66,
    backgroundColor: '#D0D6DA',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  barHigh: {
    width: 18,
    height: 100,
    backgroundColor: '#237AF2',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },

  graphLabel: {
    color: '#6B7685',
    fontSize: 10.5,
    lineHeight: 22,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#237AF2',
    borderRadius: 8,
    paddingVertical: 11,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '510',
    lineHeight: 15,
    textAlign: 'center',
    width: '100%',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    width: 24,
    height: 24,
    marginRight: 16,
    // backgroundColor: '#red',
  },
  infoTextContainer: {
    justifyContent: 'center',
  },
  infoTitle: {
    fontSize: 13,
    color: '#6B7685',
    fontFamily: 'SF Pro',
    fontWeight: '400',
    lineHeight: 22,
    wordWrap: 'break-word',
  },
  infoValue: {
    fontSize: 16,
    color: '#191F28',
    fontWeight: '590',
    lineHeight: 22,
    wordWrap: 'break-word',
  },
  infoRight: {
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewText: {
    fontSize: 12,
    color: '#323D4C',
    fontWeight: '510',
    lineHeight: 22,
  },
  bottomNavigation: {
    width: '100%',
    paddingVertical: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 2,
    marginTop: 8,
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  navText: {
    fontSize: 8.5,
    fontWeight: '510',
    color: '#323D4C',
  },
  navTextInactive: {
    fontSize: 8.5,
    fontWeight: '510',
    color: '#ADB3BA',
  },
  // Add these styles to your StyleSheet

  claimsStatusContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 24,
  },
  claimsStatusHeader: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
  },
  claimsStatusTitle: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'SF Pro',
    fontWeight: '510',
    lineHeight: 22,
    wordWrap: 'break-word',
    textAlign: 'left',
  },
  claimsStatusIcon: {
    width: 5.87,
    height: 10,
    backgroundColor: '#ADB3BA',
  },
  claimsStatusContent: {
    alignSelf: 'stretch',
    padding: 10,
    backgroundColor: '#F6F7F9',
    borderRadius: 8,
    flexDirection: 'row', 
    justifyContent: 'flex-start',
    alignItems: 'center', 
  },
  claimsStatusRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 16,
  },
  claimsStatusIconGreen: {
    width: 20,
    height: 20,
    backgroundColor: '#5EAC24',
    marginRight: 5, 
  },
  claimsStatusTextContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',

  },
  claimStatusIconContainer: {
    marginRight: 8, 
    marginBottom: 20,
    marginRight: -5,
  },
  claimsStatusTextGray: {
    color: '#6B7685',
    fontSize: 13,
    fontFamily: 'SF Pro',
    fontWeight: '510',
    lineHeight: 22,
    wordWrap: 'break-word',
  },
  claimsStatusTextBlack: {
    color: '#323D4C',
    fontSize: 14,
    fontFamily: 'SF Pro',
    fontWeight: '510',
    lineHeight: 20,
    wordWrap: 'break-word',
  },

  // DOCUMENT STYLING
  myDocumentsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 24,
  },
  myDocumentsRow: {
    flexDirection: 'row', 
    alignItems: 'center',
     justifyContent: 'space-between',
  },

myDocumentsTextContainer: {
  flexDirection: 'column',
  justifyContent: 'center',  // Align text in the center vertically if needed
  marginLeft: 10,  // Add some space between the icon and the text
},
  myDocumentsIcon: {
  
},
  myDocumentsTitle: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'SF Pro',
    fontWeight: '590',
    lineHeight: 20,
    wordWrap: 'break-word',
    marginBottom: 10,
  },
  myDocumentsSubtitle: {
    color: '#ADB3BA',
    fontSize: 12,
    fontFamily: 'SF Pro',
    fontWeight: '510',
    lineHeight: 15,
    wordWrap: 'break-word',
  },
  myDocumentsIcon:{

  },

  // CURRENT RESOURCES STYLING
  
  currentResourcesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 24,
  },
  currentResourcesHeader: {
    flexDirection: 'row', 
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentResourcesTitle: {
    color: '#191F28',
    fontSize: 16,
    fontFamily: 'SF Pro',
    fontWeight: '510',
    lineHeight: 22,
    wordWrap: 'break-word',
  },
  currentResourcesIcon: {
    width: 7,
    height: 11.92,
    backgroundColor: '#ADB3BA',
  },
  currentResourcesContent: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 20,
    display: 'flex',
    marginTop: 10,
  },
  resourceRow: {
    width: '100%',
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8, // Add vertical padding for spacing
  },
  resourceRowContent: {
    flexDirection: 'row', 
    alignItems: 'center',
    flex: 1, 
  },
  resourceIcon: {
    width: 20,
    height: 20,
    marginRight: 16, // Add some space between icon and text
  },
  resourceTextContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1, // Allow the text container to stretch
  },
  resourceTitle: {
    color: '#6B7685',
    fontSize: 12,
    fontFamily: 'SF Pro',
    fontWeight: '510',
    lineHeight: 22,
    wordWrap: 'break-word',
  },
  resourceAmount: {
    color: '#191F28',
    fontSize: 16,
    fontFamily: 'SF Pro',
    fontWeight: '590',
    lineHeight: 22,
    wordWrap: 'break-word',
  },
  resourceIconArrow: {
    width: 5.87,
    height: 10,
    backgroundColor: '#ADB3BA',
  },
  exploreMoreContainer: {
    width: '100%',
    padding: 12,
    backgroundColor: '#F2F9FF',
    borderRadius: 8,
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exploreMoreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Allow the content to stretch and fill the space
  },
  exploreMoreIconContainer: {
    marginRight: 10, // Add some space between icon and text
  },
  exploreMoreIcon: {
    width: 16,
    height: 13.71,
    backgroundColor: '#006DC3',
  },
  exploreMoreText: {
    color: '#323D4C',
    fontSize: 12,
    fontFamily: 'SF Pro',
    fontWeight: '510',
    lineHeight: 22,
    wordWrap: 'break-word',
  },
});

export default HomePage;
