import React from 'react';
import PropTypes from 'prop-types';
import {withScriptjs, withGoogleMap, GoogleMap, Marker} from "react-google-maps";
import cache from '../../utils/cache';
import HeatmapLayer from "react-google-maps/lib/components/visualization/HeatmapLayer";



const incidentsToPoints = (incidents) => {

  return incidents.map((incident) => {
    let {lat, lng} = incident.location.position;
    return new google.maps.LatLng(lat, lng);
  });
}

const BaseMap = withScriptjs(withGoogleMap(props => {
    return (
      <GoogleMap
        defaultZoom={14}
        defaultCenter={{lat: 42.4584, lng: -71.0662}}>
        <HeatmapLayer
          data={incidentsToPoints(props.incidents)}
          options={{
            radius: 22,
            opacity: 0.8,
            maxIntensity: 2,
            dissipating: true,
          }}
        />
      </GoogleMap>
    )
  }
));

export default class MapView extends React.Component {

  static propTypes = {
    incidents: PropTypes.array,
  }

  constructor(props) {
    super(props);

    this.state = {
      incidents: props.incidents,
    }

  }

  componentWillReceiveProps = (nextProps, nextState) => {
    this.setState({
      incidents: nextProps.incidents.filter(i => i.location.position),
    });
  }

  render() {

    return (
      <div>
        <span>
          <BaseMap
            ref={x => this.instance = x}
            incidents={this.state.incidents}
            loadingElement={<div style={{ height: `100%` }} />}
            googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places,visualization&key=AIzaSyDq4M2J5jyKxYipxkTH0fs9Npq_NlV1VGM"
            containerElement={
              <div style={{
                width: '100%',
                height: 0,
                paddingBottom: '50%',
                position: 'relative',
              }} />
            }
            mapElement={
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
               }} />
            }>
          </BaseMap>
          {this.state.incidents.length && (
            <h4>
              *Showing {this.state.incidents.length} incidents with position data
            </h4>
           )
          }
        </span>

      </div>

    )

  }

}