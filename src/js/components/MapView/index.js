import React from 'react';
import PropTypes from 'prop-types';
import {withGoogleMap, GoogleMap, Marker, HeatmapLayer} from "react-google-maps";
import cache from '../../utils/cache';



const incidentsToPoints = (incidents) => {

  return incidents.reduce((final, incident, i) => {

    if (!incident.position) return final;

    if (incident.position == 'Rate Limited') return final

    if (!incident.position.lat || !incident.position.lng) return final;

    let latlng = new google.maps.LatLng(incident.position.lat, incident.position.lng);

    final.push(latlng);

    return final;

  }, []);

}

let heatmap;

const setHeatMap = (map, incidents = []) => {

  let points = incidentsToPoints(incidents);

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: points,
    map: map,
    radius: 20,
  });

}


const BaseMap = withGoogleMap(props => (

    <GoogleMap
      ref={props.onMapLoad}
      defaultZoom={14}
      defaultCenter={{lat: 42.4584, lng: -71.0662}}>

    </GoogleMap>
));


export default class MapView extends React.Component {

  static propTypes = {
    incidents: PropTypes.array,
  }

  constructor(props) {
    super(props);

    this.state = {
      incidents: props.incidents,
      mapPoints: incidentsToPoints(props.incidents),
    }

  }

  onMapLoad = () => {

    try {
      this.heatmap = new google.maps.visualization.HeatmapLayer({
        data: this.state.mapPoints,
        map: this.instance.state.map,
        radius: 18,
        opacity: 0.8,
      });
    } catch (e){}

  }

  componentWillReceiveProps = (nextProps) => {

    this.setState({
      incidents: nextProps.incidents,
      mapPoints: incidentsToPoints(nextProps.incidents),
    })

    this.heatmap.setData(incidentsToPoints(nextProps.incidents));

  }

  render() {

    return (
      <div>
        <BaseMap
          ref={x => this.instance = x}
          onMapLoad={this.onMapLoad}
          incidents={this.state.incidents}
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
          }
          />
          <h4>*Showing {this.state.mapPoints.length} incidents with position data</h4>
      </div>

    )

  }

}


// export default withGoogleMap(props => (
//   <GoogleMap
//     ref={props.onMapLoad}
//     defaultZoom={3}
//     defaultCenter={{ lat: -25.363882, lng: 131.044922 }}
//     onClick={props.onMapClick}>
//     {props.markers.map((marker, index) => (
//       <Marker
//         {...marker}
//         onRightClick={() => props.onMarkerRightClick(index)}
//       />
//     ))}
//   </GoogleMap>
// ));

// Then, render it:
// render(
//   <GettingStartedGoogleMap
//     containerElement={
//       <div style={{ height: `100%` }} />
//     }
//     mapElement={
//       <div style={{ height: `100%` }} />
//     }
//     onMapLoad={_.noop}
//     onMapClick={_.noop}
//     markers={markers}
//     onMarkerRightClick={_.noop}
//   />,
//   document.getElementById('root')
// );