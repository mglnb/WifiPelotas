import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  AsyncStorage,
  NetInfo,
  TouchableOpacity 
} from 'react-native';
import firebase from 'react-native-firebase'
import Map from './screens/Map'
import watchPosition from './Geo'
export default class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      me: {
        latitude: -31.765488,
        longitude: -52.33823,
      },
      firebase: firebase.app(),
      data: {},
      destinations: ''
    }


  }

  componentWillMount() {
    this.getPosition() 
    navigator.geolocation.watchPosition(value => {
      this.setState({ me: value.coords })
    }, err => {
      console.log(err)
    })   


    NetInfo.isConnected.fetch().then(isConnected => {
      if (!isConnected) {
        console.log(this.state.data)
      } else {
        this.state.firebase.database().ref('WifiLocations').on('value', snapshot => {
          this.setState({ data: snapshot.val() })
          console.log(snapshot.val())
        })
      }
    })
  }

  getPosition() {
    navigator.geolocation.getCurrentPosition(value => {
      this.setState({ me: value.coords })
    }, err => {
      console.log(err)
    })
  }
  render() {


    return (
      <View style={{ flex: 1 }}>
        <Map
          myPosition={this.state.me}
          data={this.state.data}
        />
        <View>
          {/* <TouchableOpacity 
            style={{backgroundColor: '#841584', height: 30, alignItems: 'center', justifyContent: 'center'}}
            onPress={(e) => this.getPosition()}
          >
            <Text style={{fontWeight: 'bold', color: 'white'}}>Pegar posição</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    )
  }
}


