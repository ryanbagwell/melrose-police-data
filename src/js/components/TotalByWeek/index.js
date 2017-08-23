import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';



export default class WeeklyDataTable extends React.Component {

  static propTypes = {
    incidents: PropTypes.array,
  }

  render() {

    let incidentsByWeek = this.props.incidents.reduce((reduced, report, i) => {

      let time = moment(report.isotime);
      let week = time.format('w');
      let year = time.format('YYYY');

      if (!reduced[year]) reduced[year] = [];

      if (!reduced[year][week]) reduced[year][week] = [];

      reduced[year][week].push(report)

      return reduced

    }, []);

    return (
      <table className="table">

        <caption>Indicents by week</caption>

        <thead>
          <tr>
            <th>
              Year
            </th>

            <th>
              Week No.
            </th>

            <th>
              Week of
            </th>

            <th>
              Total
            </th>

            <th>
              Avg. Per<br />Ptl. Shift
            </th>

          </tr>
        </thead>

        <tbody className="table-striped">
        {
          Object.keys(incidentsByWeek).map((year, i) => {

            let weeks = incidentsByWeek[year];

            return Object.keys(weeks).map((week, i) => {

              let numIncidents = weeks[week].length;

              return (
                <tr>
                  <td>
                    {year}
                  </td>

                  <td>
                    {week}
                  </td>

                  <td>
                    {moment(week, 'w').format('MMM D')}
                  </td>

                  <td>{numIncidents}</td>

                  <td>{(numIncidents / 63).toPrecision(2)}</td>

                </tr>
              )

            });

          })
        }
        </tbody>
      </table>
    )

  }



}