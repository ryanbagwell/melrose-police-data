import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';


const WeekRow = (props) => {

  return (
    <tr>
      <td>
        {props.year}
      </td>

      <td>
        {props.week}
      </td>

      <td>
        {moment(props.week, 'w').format('MMM D')}
      </td>

      <td>{props.numIncidents}</td>

      <td>{(props.numIncidents / 63).toPrecision(2)}</td>

    </tr>
  )

}



export default class WeeklyDataTable extends React.Component {

  static propTypes = {
    incidents: PropTypes.array,
  }

  render() {

    let incidentsByWeek = this.props.incidents.reduce((reduced, report, i) => {

      let time = moment(report.incidentDate);
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

            let weekNumbers = Object.keys(weeks);

            let start = parseInt(weekNumbers[0]),
              end = parseInt(weekNumbers[weekNumbers.length - 1]);

            let weeksWithBlanks = {};

            while(start <= end) {
              let key = start.toString();

              if (weeks[key]) {
                weeksWithBlanks[key] = weeks[key].length;
              } else {
                weeksWithBlanks[key] = 0
              }

              start++;
            }

            return Object.keys(weeksWithBlanks).map((week, i) => {

              let numIncidents = weeksWithBlanks[week];

              return  <WeekRow {...{year, week, numIncidents}} />

            });

          })
        }
        </tbody>
      </table>
    )

  }



}