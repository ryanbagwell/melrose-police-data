import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../Modal';
import moment from 'moment';
import honk from '../../utils/honk';
import SpeedLimitSign from '../SpeedLimitSign';

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
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
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

        {this.state.segments.length &&
        <small>Updated every 2 minutes. Last updated {moment(this.state.segments[0].lastSpeedDate).format('h:mm a')}</small>
        }
      </div>
    )

  }

}