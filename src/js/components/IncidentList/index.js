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
    )

  }

}