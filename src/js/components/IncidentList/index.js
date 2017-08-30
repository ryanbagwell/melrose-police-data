import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';



export default class IncidentList extends React.Component {

  static propTypes = {
    incidents: PropTypes.array,
  }

  constructor(props) {
    super(props);

    this.state = {
      incidents: this.props.incidents,
    }
  }

  componentWillReceiveProps(nextProps) {

    this.setState({
      incidents: nextProps.incidents,
    })

  }

  render() {

    return (
      <table className="table">

        <caption>Search results</caption>

        <thead>
          <tr>
            <th>
              Date
            </th>

            <th>
              Time
            </th>

            <th>
              Type
            </th>

            <th>
              Incident No.
            </th>

            <th>
              Location
            </th>

            <th>
              Details
            </th>
          </tr>
        </thead>

        <tbody className="table-striped">
        {
          this.state.incidents.map((incident, i) => {
            return (
              <tr key={i}>
                <td>
                  {incident.date}
                </td>

                <td>
                  {moment(incident.isotime).format('LT')}
                </td>

                <td>
                  {incident.incidentName}
                </td>

                <td>
                  {incident.incidentNumber}
                </td>

                <td>
                  {incident.finalLocation}
                </td>

                <td>
                  {incident.narrative}
                </td>

              </tr>
            );

          })
        }
        </tbody>
      </table>
    )

  }

}