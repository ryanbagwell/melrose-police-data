import React from 'react';
import PropTypes from 'prop-types';
import getFirebase from '../../utils/getFirebase';
import moment from 'moment';
import IncidentList from '../IncidentList';
import TotalByWeek from '../TotalByWeek';
import MapView from '../MapView';
import cache from '../../utils/cache';

const firebase = getFirebase();

const today = moment().format('M/D/YYYY');

const dates = {
  all: {
    startDate: '1/1/2016',
    endDate: today,
  },
  thisYear: {
    startDate: `1/1/${moment().format('YYYY')}`,
    endDate: today,
  },
  last7Days: {
    startDate: moment().subtract(7, 'days').format('M/D/YYYY'),
    endDate: today,
  },
  last14Days: {
    startDate: moment().subtract(14, 'days').format('M/D/YYYY'),
    endDate: today,
  },
  last30Days: {
    startDate: moment().subtract(30, 'days').format('M/D/YYYY'),
    endDate: today,
  },
  last60Days: {
    startDate: moment().subtract(60, 'days').format('M/D/YYYY'),
    endDate: today,
  },
  last90Days: {
    startDate: moment().subtract(90, 'days').format('M/D/YYYY'),
    endDate: today,
  },
  last12Months: {
    startDate: moment().subtract(12, 'months').format('M/D/YYYY'),
    endDate: today,
  }

}


export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      startDate: moment().subtract(30, 'days').format('M/D/YYYY'),
      endDate: moment().format('M/D/YYYY'),
      incidents: [],
      streetNameFilter: '',
      incidentNameFilter: '',
      viewType: 'IncidentList',
    }

  }

  showAllDates = () => {
    this.query(dates.all);
  }

  showThisYear = () => {
    this.query(dates.thisYear);
  }

  showLast7Days = () => {
    this.query(dates.last7Days)
  }

  showLast14Days = () => {
    this.query(dates.last14Days)
  }

  showLast30Days = () => {
    this.query(dates.last30Days)
  }

  showLast60Days = () => {
    this.query(dates.last60Days)
  }

  showLast90Days = () => {
    this.query(dates.last90Days)
  }

  showLast12Months = () => {
   this.query(dates.last12Months);
  }

  componentDidMount() {
    this.query(this.state);
  }

  query = ({startDate, endDate}) => {

    let startTS = moment(startDate || this.state.startDate, ['M/D/YYYY', 'MM/DD/YYYY']).unix();

    let endTS = moment(endDate || this.state.endDate, ['M/D/YYYY', 'MM/DD/YYYY']).unix();

    let cachedResults = cache.get(`${startTS}-${endTS}`);

    if (cachedResults) {
      this.updateIncidentSet(
        startDate,
        endDate,
        cachedResults,
      );
      return;
    }

    firebase.database().ref('/reports/')
      .orderByChild('timestamp')
      .startAt(startTS, 'timestamp')
      .endAt(endTS, 'timestamp')
      .once('value').then((snapshot) => {

      let filtered = Object.values(snapshot.val() || {});

      cache.set(`${startTS}-${endTS}`, filtered);

      this.updateIncidentSet(
        startDate,
        endDate,
        filtered,
      );

    });

  }

  updateIncidentSet = (startDate, endDate, incidents) => {

    this.setState({
      startDate,
      endDate,
      incidents,
    });

  }

  updateStreetNameFilter = (e) => {
    e.preventDefault();

    this.setState({
      streetNameFilter: this.streetNameFilter.value,
    });

  }


  updateIncidentName = (e) => {

    e.preventDefault();

    this.setState({
      incidentNameFilter: this.incidentNameFilter.value,
    });

  }

  updateViewType = (viewType, e) => {
    if (e) {
      e.preventDefault();
    }

    this.setState({
      viewType: viewType || IncidentList,
    });
  }

  render() {

    let filtered = this.state.incidents.filter((item) => {

      try {
        if (this.state.streetNameFilter && item.finalLocation && !item.finalLocation.toLowerCase().includes(this.state.streetNameFilter.toLowerCase())) {
          return false;
        }
      } catch (e) {
        return false;
      }

      if (this.state.incidentNameFilter && !item.incidentName.toLowerCase().includes(this.state.incidentNameFilter.toLowerCase())) return false;

      return true;


    });

    return (
      <section className="App container">

        <h1>Melrose Police Incidents (Beta)</h1>

        <div className="panel panel-default">

          <div className="panel-heading">
            <h2 className="panel-title">Filter By</h2>
          </div>

          <div className="panel-body">

            <form>

              <div className="form-group">
                <div className="btn-group" role="group">

                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={this.showLast7Days}>Last 7 Days</button>

                 <button
                    type="button"
                    className="btn btn-default"
                    onClick={this.showLast14Days}>Last Two Weeks</button>

                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={this.showLast30Days}>Last 30 Days</button>

                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={this.showLast60Days}>Last 60 Days</button>

                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={this.showLast90Days}>Last 90 Days</button>

                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={this.showThisYear}>This Year</button>

                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={this.showLast12Months}>Last 12 months</button>

                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={this.showAllDates}>Show All</button>
                </div>
              </div>

              <div className="form-group">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Street Name (e.g. howard)"
                    ref={x => this.streetNameFilter = x} />
                  <span className="input-group-btn">
                    <button
                      className="btn btn-default"
                      type="button"
                      onClick={this.updateStreetNameFilter}>Update</button>
                  </span>
                </div>
              </div>

              <div className="form-group">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Incident Name (e.g. accident)"
                    ref={x => this.incidentNameFilter = x} />
                  <span className="input-group-btn">
                    <button
                      className="btn btn-default"
                      type="button"
                      onClick={this.updateIncidentName}>Update</button>
                  </span>
                </div>
              </div>


              <div className="form-group">

                <label>Show:&nbsp;&nbsp;</label>

                <div className="btn-group" role="group">

                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={this.updateViewType.bind(null, 'IncidentList')}>Incident List</button>

                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={this.updateViewType.bind(null, 'TotalByWeek')}>Total by Week</button>

                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={this.updateViewType.bind(null, 'MapView')}>Heatmap</button>

                </div>
              </div>

            </form>

          </div>

        </div>

        <div className="panel panel-default">

          <div className="panel-heading">
            <h2 className="panel-title">{filtered.length} Results</h2>
          </div>

          <div className="panel-body">

            {
              this.state.viewType == 'IncidentList' && (
              <IncidentList incidents={filtered} />
              )
            }

            {
              this.state.viewType == 'TotalByWeek' && (
              <TotalByWeek incidents={filtered} />
              )
            }

            {
              this.state.viewType == 'MapView' && (
              <MapView incidents={filtered} />
              )
            }

          </div>

        </div>

      </section>
    )

  }


}
