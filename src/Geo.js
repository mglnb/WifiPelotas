import React, {Component} from "react";
import { Geolocation } from 'react-native'

export default class Geo extends Component {

  constructor (props) {
    super(props)
  } 

  static init () {
    Geolocation.requestAuthorization()
  }
}