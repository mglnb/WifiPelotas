import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  AsyncStorage,
  NetInfo
} from 'react-native';
import firebase from 'react-native-firebase'
import MapView from 'react-native-maps'
import Geo from './Geo'
export default class App extends Component {

  constructor (props) {
    super(props)
    this.state = {
      me: {
        latitude: -31.765488,
        longitude: -52.33823,
      },
      firebase: firebase.app(),
      data: {}
    }
  }


  componentWillMount () {
    navigator.geolocation.watchPosition(value => {
      this.setState({me: value.coords})
    }, err => {
      console.log(err)
    })

    NetInfo.isConnected.fetch().then(isConnected => {
      if (!isConnected) {
        this.getOfflineData()
        console.log(this.state.data)
      } else {
        this.state.firebase.database().ref('WifiLocations').on('value', snapshot => {
          this.setData(snapshot.val())
          console.log(snapshot.val())
        })
      }
    })


  }

  async setData (data) {
    this.setState({data: data})
    await AsyncStorage.setItem('data', JSON.stringify(data))
  }

  async getOfflineData () {
    AsyncStorage.getItem('data')
      .then(async => JSON.parse(async))
      .then(json => this.setState({data: json}))
      .catch(err => console.log(err))

    await AsyncStorage.getAllKeys()
      .then(keys => console.log(keys))
  }

  getPosition () {

  }

  render () {


    return (
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -31.765488,
          longitude: -52.33823,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        <MapView.Marker
          coordinate={this.state.me}
          title={"Você"}
        >
          <Image
            style={{width: 35, height: 35}}
            source={{uri: 'https://png.icons8.com/metro/540/street-view.png'}} />
        </MapView.Marker>
        {
          Object.entries(this.state.data).map(value => (

            <MapView.Marker
              key={value[0]}
              coordinate={{
                latitude: value[1].geolocation.geometry.location.lat,
                longitude: value[1].geolocation.geometry.location.lng
              }}
              title={`${value[1].location}`}
              description={`Senha: ${value[1].password}`}
            />
          ))
        }
      </MapView>
    );
  }
}


const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
})