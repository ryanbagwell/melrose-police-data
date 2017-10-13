import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../Modal';
//import getCurrentSpeed from '../../utils/getCurrentSpeed';
//import {withGoogleMap, GoogleMap, Marker, HeatmapLayer} from "react-google-maps";
import moment from 'moment';
import honk from '../../utils/honk';
import getFireBase from '../../utils/getFirebase';


const SEGMENTS = [
  {
    name: 'Upham Street Westbound',
    description: 'From E. Woodcrest Drive to Ardsmoor Road',
    origin: {lat: 42.459992, lng: -71.034596},
    destination: {lat: 42.460704, lng: -71.040024},
    speed: 0,
    status: 'ok',
    trend: 'holding steady',
  },
  {
    name: 'Upham Street Eastbound',
    description: 'Lincoln to E. Woodcrest',
    origin: {lat: 42.458298, lng: -71.053017},
    destination: {lat: 42.460704, lng: -71.040024},
    speed: 0,
    status: 'ok',
    trend: 'holding steady',
  },
  {
    name: 'Howard Street Westbound',
    description: 'Saugus to Hesseltine Ave',
    origin: 'Howard Street & Sweetwater Street, Melrose, MA',
    destination: 'Howard Street & Hesseltine Ave, Melrose, MA',
    speed: 0,
    status: 'ok',
    trend: 'holding steady',
  },
  {
    name: 'Howard Street Eastbound',
    description: 'From Hesseltine Ave to Saugus',
    origin: 'Howard Street & Hesseltine Ave, Melrose, MA',
    destination: 'Howard Street & Sweetwater Street, Melrose, MA',
    speed: 0,
    status: 'ok',
    trend: 'holding steady',
  },
  {
    name: 'Franklin Street Westbound',
    description: 'From Garden St. to Ferdinand',
    origin: {lat: 42.469212, lng: -71.072758},
    destination: {lat: 42.470621, lng: -71.078444},
    speed: 0,
    status: 'ok',
    trend: 'holding steady',
  },
  {
    name: 'Franklin Street Eastbound',
    description: 'Ferdinand to Garden St.',
    origin: {lat: 42.470621, lng: -71.078444},
    destination: {lat: 42.469212, lng: -71.072758},
    speed: 0,
    status: 'ok',
    trend: 'holding steady',
  },
  {
    name: 'Lynn Fells Parkway Westbound',
    description: 'From 802 Lynn Fells Parkway to 652 Lynn Fells Parkway',
    origin: '802 Lynn Fells Parkway, Melrose, MA',
    destination: '652 Lynn Fells Parkway, Melrose, MA',
    speed: 0,
    status: 'ok',
    trend: 'holding steady',
  },
  {
    name: 'Lynn Fells Parkway Eastbound',
    description: 'From 647 Lynn Fells Parkway to 819 Lynn Fells Parkway',
    origin: '647 Lynn Fells Parkway, Melrose, MA',
    destination: '819 Lynn Fells Parkway, Melrose, MA',
    speed: 0,
    status: 'ok',
    trend: 'holding steady',
  },

];


export default class SpeedList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      segments: SEGMENTS,
      alerts: [],
    }

  }

  componentWillMount() {
    this.firebase = getFireBase();
  }

  componentDidMount() {

    this.firebase.database().ref('speeds').on('value', (snapshot) => {
      let data = snapshot.val();

      let segments = Object.values(data).map((obj) => {

        let speeds = Object.values(obj).reverse();

        let val = speeds[0],
          prevVal = speeds[1];

        if (val.speed < 30) {
          val.status = 'success';
        } else if (val.speed >= 30 && val.speed < 35) {
          val.status = 'warning';
        } else if (val.speed >= 35) {
          val.status = 'danger';
        }

        let trend = val.speed - prevVal.speed;

        if (trend > 1) {
          val.trend = 'increasing';
        } else if (trend < -1) {
          val.trend = 'decreasing';
        } else {
          val.trend = 'holding steady';
        }

        val.prevSpeed = prevVal.speed;

        return val;

      });

      let alerts = segments.reduce((alerts, seg) => {

        if (seg.trend === 'increasing') {
          alerts.push(`Speed on ${seg.name} is increasing`);
        }

        return alerts;

      }, []);

      this.setState({
        segments: segments,
        alerts: alerts,
      });

      console.info('Firebase updated')

    })

  }

  componentDidUpdate() {

    // if (this.state.alerts.length) {
    //   honk();
    // }
  }

  render() {

    return (
      <div>

        {
          this.state.alerts.length > 0 && (
            <div class="alert alert-warning" role="alert">
              {
                this.state.alerts.map((alert) => {
                  <ul>
                    <li>{alert}</li>
                  </ul>
                })
              }
            </div>
          )

        }


        <table className="table">

          <thead>
            <tr>
              <th>
                Road
              </th>

              <th>
                Current Speed
              </th>
            </tr>
          </thead>

          <tbody className="table-striped">

          {
            this.state.segments.map((segment) => {

              return (
                <tr>
                  <td>
                    <p className="lead">{segment.name}</p>
                    <p>{segment.description}</p>
                  </td>

                  <td className="">
                    <div className={`panel-body bg-${segment.status}`}>

                      <p className="lead">
                        {segment.speed.toFixed(1)} mph
                      </p>

                      {
                        segment.prevSpeed !== 0 && (
                          <small>Trend: {segment.trend}</small>
                        )
                      }

                    </div>

                  </td>
                </tr>

              )

            })

          }

          </tbody>

        </table>

        <small>Updated every 5 minutes. Last updated {moment().format('h:mm a')}</small>
      </div>
    )

  }

}