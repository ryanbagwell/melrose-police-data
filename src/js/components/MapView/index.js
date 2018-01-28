import React from 'react';
import PropTypes from 'prop-types';
import {withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow} from "react-google-maps";
import cache from '../../utils/cache';
import HeatmapLayer from "react-google-maps/lib/components/visualization/HeatmapLayer";
import {MarkerClusterer} from 'react-google-maps/lib/components/addons/MarkerClusterer';
import {IncidentInfoWindow, MapMarker} from './MapMarker';



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
        {
          props.layerType == 'markers' && (
            <MarkerClusterer
              onClick={props.handleClusterClick}
              averageCenter
              enableRetinaIcons
              zoomOnClick={false}
              gridSize={60}>
              {
                props.incidents.map(incident => {
                  return <MapMarker key={incident.incidentNumber} incidents={[incident]} />;
                })
              }

              {props.clusterInfoWindowIncidents.length && (
                <IncidentInfoWindow
                  handleClose={props.handleClusterWindowClose}
                  incidents={props.clusterInfoWindowIncidents}
                  position={props.clusterInfoWindowIncidents[0].position} />
                )
              }

            </MarkerClusterer>
          )
        }


        {
          props.layerType == 'heatmap' && (
            <HeatmapLayer
              data={incidentsToPoints(props.incidents)}
              options={{
                radius: 22,
                opacity: 0.8,
                maxIntensity: 2,
                dissipating: true,
              }}
            />
          )
        }
      </GoogleMap>
    )
  }
));

export default class MapView extends React.Component {

  static propTypes = {
    incidents: PropTypes.array,
    layerType: PropTypes.string,
  }

  constructor(props) {
    super(props);

    this.state = {
      incidents: props.incidents,
      layerType: props.layerType || 'markers',
      clusterInfoWindowIncidents: [],
    }

  }

  componentWillReceiveProps = (nextProps, nextState) => {
    this.setState({
      incidents: nextProps.incidents.filter(i => i.location.position),
    });
  }

  handleClusterClick = (cluster) => {

    let incidents = cluster.getMarkers().map(m => m.incidents[0]);

    this.setState({
      clusterInfoWindowIncidents: incidents,
    })


  }

  handleClusterWindowClose = () => {
    this.setState({
      clusterInfoWindowIncidents: [],
    })

  }

  render() {

    return (
      <div>
        <div className="form-group">
          <label dangerouslySetInnerHTML={{__html: "Display: &nbsp;"}} />

          <div className="btn-group">

            <button
              type="button"
              className={`btn btn-default ${this.state.layerType === 'markers' ? 'active' : ''}`}
              onClick={x => this.setState({layerType: 'markers'})}>
              Markers
            </button>

            <button
              type="button"
              className={`btn btn-default ${this.state.layerType === 'heatmap' ? 'active' : ''}`}
              onClick={x => this.setState({layerType: 'heatmap'})}>
              Heatmap
            </button>

          </div>

        </div>

        <span>
          <BaseMap
            handleClusterClick={this.handleClusterClick}
            layerType={this.state.layerType}
            ref={x => this.instance = x}
            handleClusterWindowClose={this.handleClusterWindowClose}
            clusterInfoWindowIncidents={this.state.clusterInfoWindowIncidents}
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