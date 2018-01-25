import React, { Component } from 'react'
import {
  StyleSheet,
  Image
} from 'react-native';
import MapView from 'react-native-maps'

function delay(t) {
  return new Promise(resolve => {
    return setTimeout(resolve, t)
  })
}


export default class Map extends Component {

  constructor(props) {
    super(props)
    this.state = {
      me: {
        latitude: -31.765488,
        longitude: -52.33823,
      },
      destinations: '',
      destinationsResponse: []
    }
  }

  componentWillMount() {

  }

  componentWillReceiveProps(nextProps) {
    this.setState({ me: nextProps.myPosition })
    let destinations = []
    delay(0)
      .then(() => {
        Object.entries(nextProps.data).forEach(value => {
          destinations = [
            ...destinations,
            `${value[1].geolocation.geometry.location.lat},${value[1].geolocation.geometry.location.lng}`
          ]
        })
        this.setState({ destinations: destinations.join('|') })
      })
      .then(() => {
        console.log(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${this.state.me.latitude},${this.state.me.longitude}&destinations=${this.state.destinations}&key=AIzaSyAXPZYfVJSNXkAhzcOR8nUh7tsTo7A4238`)
        fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${this.state.me.latitude},${this.state.me.longitude}&destinations=${this.state.destinations}&key=AIzaSyAXPZYfVJSNXkAhzcOR8nUh7tsTo7A4238`)
          .then(res => res.json())
          .then(res => this.setState({ destinationsResponse: res }))
      })
  }


  render() {
    console.log(`${!Array.isArray(this.state.destinationsResponse) && this.state.destinationsResponse.rows.length > 0 ? this.state.destinationsResponse.rows[0].elements[value[0]].distance.text : ''}`)
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
          title={"Você"}>
          <Image
            style={{ width: 35, height: 35 }}
            source={require('../assets/street-view.png')} />
        </MapView.Marker>
        {
          Object.entries(this.props.data).map((value, index) => (
            <MapView.Marker
              key={value[0]}
              coordinate={{
                latitude: value[1].geolocation.geometry.location.lat,
                longitude: value[1].geolocation.geometry.location.lng
              }}
              title={`${value[1].location}, distancia: ${!Array.isArray(this.state.destinationsResponse) && this.state.destinationsResponse.rows.length > 0 ? this.state.destinationsResponse.rows[0].elements[value[0]].distance.text : ''}`}
              description={`Senha: ${value[1].password}`} />
          ))
        }
      </MapView>
    )
  }
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
})