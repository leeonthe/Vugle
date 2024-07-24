import React, { useContext } from 'react';
import { StyleSheet, Dimensions } from 'react-native';

const fonts = (appSettings) => StyleSheet.create({

  h1: {
    color: ("foregroundColor" in appSettings)? appSettings['foregroundColor'] : "black",
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: "center",
    width: "100%",
    margin: 0
  },

  p: {
    color: ("foregroundColor" in appSettings)? appSettings['foregroundColor'] : "black",
    fontSize: 12,
    width: "100%",
    textAlign: "center",
    margin: 0
  },

  inputLabel: {
    color: ("foregroundColor" in appSettings)? appSettings['foregroundColor'] : "black",
    fontSize: 12,
    width: "100%",
    margin: 0
  },
  errorLabel: {
    width: "100%",
    textAlign: "center",
    color: "black"
  }





});

export default fonts;