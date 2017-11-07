import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../Modal';
import moment from 'moment';
import honk from '../../utils/honk';

import prom from 'es6-promise';
prom.polyfill();
import 'isomorphic-fetch'
import formatNumber from 'number-formatter'



export default class SpeedList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      segments: [],
      alerts: [],
    }

  }

  componentDidMount() {

    this.refreshSpeeds()

    this.timer = setTimeout(
      this.refreshSpeeds.bind(this), 1200)

    // this.firebase.database().ref('speeds').on('value', (snapshot) => {
    //   let data = snapshot.val();

    //   let segments = Object.values(data).map((obj) => {

    //     let speeds = Object.values(obj).reverse();

    //     let val = speeds[0],
    //       prevVal = speeds[1],
    //       last6 = speeds.slice(0, 6);


    //     if (val.speed < 30) {
    //       val.status = 'success';
    //     } else if (val.speed >= 30 && val.speed < 35) {
    //       val.status = 'warning';
    //     } else if (val.speed >= 35) {
    //       val.status = 'danger';
    //     }

    //     let trend = val.speed - prevVal.speed;

    //     if (trend > 1) {
    //       val.trend = 'increasing';
    //     } else if (trend < -1) {
    //       val.trend = 'decreasing';
    //     } else {
    //       val.trend = 'holding steady';
    //     }

    //     val.prevSpeed = prevVal.speed;

    //     let total = last6.reduce((total, item) => {
    //       return total + item.speed;
    //     }, 0);

    //     val.average = total / 6;

    //     return val;

    //   });

    //   let alerts = segments.reduce((alerts, seg) => {

    //     if (seg.trend === 'increasing') {
    //       alerts.push(`Speed on ${seg.name} is increasing`);
    //     }

    //     return alerts;

    //   }, []);

    //   this.setState({
    //     segments: segments,
    //     alerts: alerts,
    //   });

    //   console.info('Firebase updated')

    // })

  }

  refreshSpeeds() {

    let url = `//data.cosmicautomation.com/api/1.0/speed-data/`;

    fetch(url)
      .then(response => {
          if (response.status >= 400) {
              throw new Error("Bad response from server");
          }
          return response.json();
      })
      .then(response => {

        this.setState({
          segments: response.results,
          alerts: [],
        });

        this.timer = setTimeout(
          this.refreshSpeeds.bind(this), 1200)

      });

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

              let status = 'danger';

              let diff = segment.lastSpeed - segment.speedLimit;

              if (diff <= 3) {
                status = 'success';
              } else if (diff <= 10) {
                status = 'warning';
              }

              return (
                <tr>
                  <td>
                    <p className="lead">{segment.name}</p>
                    <p>{segment.description}</p>
                  </td>

                  <td className="">
                    <div className={`panel-body bg-${status}`}>

                      <p className="lead">
                        {segment.lastSpeed.toFixed(1)} mph
                      </p>

                      { segment.tenMinuteDailyAverage && (

                        <small>Usually {segment.tenMinuteDailyAverage.toFixed(1)} mph at this time of day</small>
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