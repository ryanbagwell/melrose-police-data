import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import getFirebase from '../../utils/getFirebase';
import DetailForm from '../DetailForm';
import Modal from '../Modal';

const fb = getFirebase();


export default class IncidentList extends React.Component {

  static propTypes = {
    incidents: PropTypes.array,
  }

  constructor(props) {
    super(props);

    this.state = {
      incidents: this.props.incidents,
      editing: null,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      incidents: nextProps.incidents,
    })
  }

  handleClick = (incident, e) => {
    if (!fb.currentUser) return;

    this.setState({
      editing: incident,
    })
  }

  stopEditing = () => {
    this.setState({
      editing: false,
    })
  }

  render() {

    return (
      <div className="table-responsive">
        <table
          className={`table ${fb.currentUser ? 'authenticated' : ''}`}>

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

              <th>
                Disposition
              </th>
            </tr>
          </thead>

          <tbody className="table-striped">
          {
            this.state.incidents.map((incident, i) => {
              return (
                <tr
                  key={i}
                  onClick={x => this.handleClick(incident) }>

                  <td>
                    {incident.incidentDate}
                  </td>

                  <td>
                    {moment(incident.incidentTime, 'HH:mm:ss').format('LT')}
                  </td>

                  <td>
                    {incident.incidentTitle}
                  </td>

                  <td>
                    {incident.incidentNumber}
                  </td>

                  <td>
                    {incident.location.description}
                  </td>

                  <td>
                    {incident.narrative}
                    {incident.referToSummons &&
                      <span>
                        <br />Refer to Summons: {incident.referToSummons}
                      </span>
                    }
                    {incident.referToIncident &&
                      <span>
                        <br />Refer to Incident: {incident.referToIncident}
                      </span>
                    }
                  </td>

                  <td>
                    {incident.disposition}
                  </td>

                </tr>
              );

            })
          }
          </tbody>

          {
            this.state.editing && (
              <Modal
                open={true}
                afterClose={this.stopEditing}>
                <DetailForm
                  incident={this.state.editing} />
              </Modal>
            )
          }

        </table>
      </div>
    )

  }

}