import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const SHIFTS = {
  FIRST: '7:45 a.m. - 3:45 p.m.',
  SECOND: '3:45 p.m. - 11:45 p.m.',
  THIRD: '11:45 p.m. - 7:45 a.m.',
}


export default class TotalPerShift extends React.Component {

  static propTypes = {
    incidents: PropTypes.array,
  }

  render() {

    let incidentsByShift = this.props.incidents.reduce((reduced, incident, i) => {

      let keys = Object.keys('reduced'),
        {shift} = incident;

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
              Time
            </th>

            <th>
              Total
            </th>

            <th>
              %
            </th>

          </tr>
        </thead>

        <tbody className="table-striped">
        {
          Object.keys(SHIFTS).map((shift, i) => {

            let shiftTotal = incidentsByShift[shift];

            return (
              <tr key={i}>
                <td>
                  {shift}
                </td>

                <td>
                  {SHIFTS[shift]}
                </td>

                <td>
                  {shiftTotal}
                </td>

                <td>
                  {(shiftTotal / grandTotal * 100).toPrecision(2)}%
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