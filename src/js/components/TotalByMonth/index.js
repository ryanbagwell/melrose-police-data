import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import formatNumber from 'number-formatter'


const MonthRow = (props) => {

  return (
    <tr>
      <td>
        {props.year}
      </td>

      <td>
        {moment(`${props.month}/01/2017`).format('MMM')}
      </td>

      <td>
        {formatNumber('#,###.', props.numIncidents)}
      </td>

      <td>
        <span style={{
          display: 'inline-block',
          height: '20',
          background: '#B8101F',
          width: `${props.numIncidents / props.maxIncidents * 100}%`,

        }} />
      </td>

    </tr>
  )

}



export default class MonthlyDataTable extends React.Component {

  static propTypes = {
    incidents: PropTypes.array,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }

  render() {

    let incidentsByMonth = this.props.incidents.reduce((reduced, report, i) => {

      let time = moment(report.incidentDate);
      let month = time.format('M');
      let year = time.format('YYYY');

      if (!reduced[year]) reduced[year] = [];

      if (!reduced[year][month]) reduced[year][month] = [];

      reduced[year][month].push(report)

      return reduced

    }, []);

    return (
      <table className="table">

        <caption>Incidents by month</caption>

        <thead>
          <tr>
            <th>
              Year
            </th>

            <th>
              Month
            </th>

            <th>
              Total Incidents
            </th>

            <th>
              Graph
            </th>

          </tr>
        </thead>

        <tbody className="table-striped">
        {
          Object.keys(incidentsByMonth).map((year, i) => {

            let months = incidentsByMonth[year];

            console.log(months);

            let maxIncidents = Math.max(...Object.values(months).map(x => x.length));

            return Object.keys(months).map((month, i) => {
              return (<MonthRow
                        year={year}
                        month={month}
                        numIncidents={months[month].length}
                        maxIncidents={maxIncidents} /> );
            });

          })
        }
        </tbody>
      </table>
    )

  }



}