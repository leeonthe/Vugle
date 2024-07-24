import React, { useContext } from 'react';
import { StyleSheet, Dimensions } from 'react-native';

const containers = (appSettings) => StyleSheet.create({

  outerPage: {
    backgroundColor: ("backgroundColor" in appSettings)? appSettings['backgroundColor'] : "#007E79",
    color: ("foregroundColor" in appSettings)? appSettings['foregroundColor'] : "#000000",
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    margin: 0
  },

  formBox: {
    width: "80%",
    height: "60%",
    backgroundColor: "white",
    margin: 0,
    borderRadius: 15,
    padding: "6%",

  }



});

export default containers;