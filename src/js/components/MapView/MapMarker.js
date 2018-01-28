import React from 'react';
import PropTypes from 'prop-types';
import {Marker, InfoWindow} from "react-google-maps";


export class IncidentContent extends React.Component {

  static propTypes = {
    id: PropTypes.number,
    incidentDate: PropTypes.string,
    incidentTime: PropTypes.string,
    incidentTitle: PropTypes.string,
    location: PropTypes.object,
    narrative: PropTypes.string,
    referToIncident: PropTypes.any,
    referToSummons: PropTypes.any,
    officer: PropTypes.any,
    sourceFile: PropTypes.string,
    handleClose: PropTypes.func,
  }

  render() {

    return (
      <div style={{maxWidth: '320px'}}>
        <h5>{this.props.incidentTitle}</h5>
        <address>
          {this.props.incidentDate} {this.props.incidentTime}<br />
          {this.props.incidentNumber}<br />
          {this.props.location.description}
        </address>
        <p>
          {this.props.narrative}<br />
        </p>
      </div>
    )


  }


}



export class IncidentInfoWindow extends React.Component {

  static propTypes = {
    handleClose: PropTypes.func,
    incidents: PropTypes.array,
  }

  render() {

    let {lat, lng} = this.props.incidents[0].location.position;

    return (
      <InfoWindow
        onCloseClick={this.props.handleClose}
        zIndex={100}
        position={{
          lat: parseFloat(lat),
          lng: parseFloat(lng),
        }}>
        <span>
        {
          this.props.incidents.map((incident, i) => {
            return <IncidentContent key={i} {...incident} />
          })
        }
        </span>
      </InfoWindow>
    )
  }

}


class IncidentMapMarker extends Marker {

  constructor(props, context) {
    super(props, context);
    this.state['__SECRET_MARKER_DO_NOT_USE_OR_YOU_WILL_BE_FIRED'].incidents = props.incidents;
  }

}



export class MapMarker extends React.Component {

  static propTypes = {
    incidents: PropTypes.array,
  }

  constructor(props) {
    super(props);

    this.state = {
      open: false,
    }
  }

  open = () => {
    this.setState({
      open: true,
    })
  }

  close = () => {
    this.setState({
      open: false,
    })
  }

  render() {
    return (
      <IncidentMapMarker
        incidents={this.props.incidents}
        title={this.props.incidents[0].incidentNumber}
        onClick={this.open}
        key={this.props.incidents[0].id}
        icon={{
          url: "https://png.icons8.com/office/50/000000/siren.png",
          scaledSize: new google.maps.Size(30, 30),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(0, 30)
        }}
        position={{
          lat: parseFloat(this.props.incidents[0].location.position.lat),
          lng: parseFloat(this.props.incidents[0].location.position.lng),
        }}>
        {
          this.state.open && (
            <IncidentInfoWindow handleClose={this.close} {...this.props} />
          )
        }
      </IncidentMapMarker>
    )

  }
}