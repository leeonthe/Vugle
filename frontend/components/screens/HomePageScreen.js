import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Rect } from 'react-native-svg';

function HomePage() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Home</Text>
        <Image
          source={require('../../assets/notification_icon.png')} // Update with your notification icon path
          style={styles.notificationIcon}
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderText}>
                Earn additional {'\n'}
                <Text style={styles.cardHeaderHighlight}>$16,286 </Text>
                benefits annually
              </Text>
              <View style={styles.closeIcon}>
                <Svg width="11" height="11">
                  <Rect width="11" height="11" fill="#878F9A" />
                </Svg>
              </View>
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
                    <Text style={styles.barLabel}>$782</Text>
                    <View style={styles.barLow} />
                  </View>
                  <View style={styles.barGroup}>
                    <Text style={styles.barLabelHighlight}>$2,682</Text>
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
              <Image
                source={require('../../assets/disability_icon.png')} // Update with your disability icon path
                style={styles.infoIcon}
              />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>Disability rating</Text>
                <Text style={styles.infoValue}>70%</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.infoRight} onPress={() => navigation.navigate('StatsDisabilityPage')}>
              <Text style={styles.viewText}>View</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoLeft}>
              <Image
                source={require('../../assets/compensation_icon.png')} // Update with your compensation icon path
                style={styles.infoIcon}
              />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>Monthly compensation</Text>
                <Text style={styles.infoValue}>$782</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.infoRight} onPress={() => navigation.navigate('StatsCompPage')}>
              <Text style={styles.viewText}>View</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('HomePageScreen')}>
          <Image
            source={require('../../assets/home_icon.png')}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ExplorePageScreen')}>
          <Image
            source={require('../../assets/explore_icon.png')}
            style={styles.navIcon}
          />
          <Text style={styles.navTextInactive}>Explore</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ConsultPageScreen')}>
          <Image
            source={require('../../assets/consult_icon.png')}
            style={styles.navIcon}
          />
          <Text style={styles.navTextInactive}>Consult</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('LoanPageScreen')}>
          <Image
            source={require('../../assets/loan_icon.png')}
            style={styles.navIcon}
          />
          <Text style={styles.navTextInactive}>Loan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('AllPageScreen')}>
          <Image
            source={require('../../assets/loan_icon.png')} // Update with your all icon path
            style={styles.navIcon}
          />
          <Text style={styles.navTextInactive}>All</Text>
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
    paddingTop: 50,
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
  closeIcon: {
    width: 11,
    height: 11,
  },
  averageIncrease: {
    backgroundColor: '#F2F7FE',
    borderRadius: 8,
    padding: 8,
    marginBottom: 24,
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
    justifyContent: 'space-around', // Adjusted to bring graph items closer
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
    marginHorizontal: 2, // Adjusted to bring bars closer
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
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.02,
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
  },
  infoTextContainer: {
    justifyContent: 'center',
  },
  infoTitle: {
    fontSize: 12,
    color: '#6B7685',
    fontWeight: '510',
    lineHeight: 22,
  },
  infoValue: {
    fontSize: 16,
    color: '#191F28',
    fontWeight: '590',
    lineHeight: 22,
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
    paddingVertical: 8,
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
});

export default HomePage;
