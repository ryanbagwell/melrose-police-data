import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const SHIFTS = {
  FIRST: {
    start: moment('07:45:00', 'HH:mm:ss'),
    end: moment('15:45:00', 'HH:mm:ss'),
  },
  SECOND: {
    start: moment('15:45:00', 'HH:mm:ss'),
    end: moment('23:45:00', 'HH:mm:ss'),
  },
  THIRD: {
    start: moment('23:45:00', 'HH:mm:ss').subtract(1, 'day'),
    end: moment('07:45:00', 'HH:mm:ss'),
  },
}

export default class TotalPerShift extends React.Component {

  static propTypes = {
    incidents: PropTypes.array,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }

  render() {

    let totalDays = moment(this.props.endDate, 'YYYY-MM-DD').diff(moment(this.props.startDate, 'YYYY-MM-DD'), 'days');

    if (this.props.incidents.length === 0) return null;

    let incidentsByShift = this.props.incidents.reduce((reduced, incident, i) => {

      let shift,
        incidentTime = moment(incident.incidentTime, 'HH:mm:ss')

      Object.keys(SHIFTS).map((shiftName) => {
        let shiftDetails = SHIFTS[shiftName];

        if (incidentTime.isAfter(shiftDetails.start) && incidentTime.isBefore(shiftDetails.end)) {
          shift = shiftName
        }
      })

      if (!shift) return reduced;

      let num = reduced[shift] || 0;

      reduced[shift] = num + 1;

      return reduced

    }, {});

    let grandTotal = Object.values(incidentsByShift).reduce((a, b) => a + b, 0);

    return (
      <table className="table">

        <thead>
          <tr>
            <th>
              Shift
            </th>

            <th>
              Total
            </th>

            <th>
              %
            </th>

            <th>
              Per ptl. shift
            </th>

          </tr>
        </thead>

        <tbody className="table-striped">
        {

          Object.keys(SHIFTS).map((shiftName, i) => {

            let {start, end} = SHIFTS[shiftName]

            return (
              <tr key={i}>
                <td>
                  {start.format('h:mm a')} - {end.format('h:mm a')}
                </td>

                <td>
                  {incidentsByShift[shiftName]}
                </td>

                <td>
                  {(incidentsByShift[shiftName] / grandTotal * 100).toFixed(1)}%
                </td>

                <td>
                  {(incidentsByShift[shiftName] / (3 * totalDays)).toFixed(1)}
                </td>

              </tr>
            )

          })
        }
        </tbody>
      </table>
    )

  }



}