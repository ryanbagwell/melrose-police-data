import React from 'react';
import PropTypes from 'prop-types';
import getFirebase from '../../utils/getFirebase';
import moment from 'moment';
import IncidentList from '../IncidentList';
import TotalByWeek from '../TotalByWeek';
import MapView from '../MapView';
import cache from '../../utils/cache';
import Loading from '../Loading';

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
      loading: false,
    }

  }

  showAllDates = () => {
    this.setState(dates.all, this.query);
  }

  showThisYear = () => {
    this.setState(dates.thisYear, this.query);
  }

  showLast7Days = () => {
    this.setState(dates.last7Days, this.query)
  }

  showLast14Days = () => {
    this.setState(dates.last14Days, this.query)
  }

  showLast30Days = () => {
    this.setState(dates.last30Days, this.query)
  }

  showLast60Days = () => {
    this.setState(dates.last60Days, this.query)
  }

  showLast90Days = () => {
    this.setState(dates.last90Days, this.query)
  }

  showLast12Months = () => {
   this.setState(dates.last12Months, this.query);
  }

  componentDidMount() {
    this.query();
  }

  query = () => {

    this.setState({
      loading: true,
    });

    let startTS = moment(this.state.startDate, ['M/D/YYYY', 'MM/DD/YYYY']).unix();

    let endTS = moment(this.state.endDate, ['M/D/YYYY', 'MM/DD/YYYY']).unix();

    let cacheKey = [
      this.state.startDate,
      this.state.endDate,
      this.state.streetNameFilter,
      this.state.incidentNameFilter,
    ].filter(x => x).join('-');

    let cachedResults = cache.get(cacheKey);

    if (cachedResults) {

      return this.setState({
        incidents: cachedResults,
      }, () => this.setState({loading: false}));

    }

    firebase.database().ref('/reports/')
      .orderByChild('timestamp')
      .startAt(startTS, 'timestamp')
      .endAt(endTS, 'timestamp')
      .once('value').then((snapshot) => {

      let results = Object.values(snapshot.val() || {});

      if (this.state.streetNameFilter || this.state.incidentNameFilter) {
        results = this.getFilteredIncidents(results);
      }

      this.setState({
        incidents: results,
      }, () => this.setState({loading: false}));

      cache.set(cacheKey, results);

    });

  }

  getFilteredIncidents = (incidents) => {

    return incidents.filter((item) => {

      try {
        if (streetNameFilter && item.finalLocation && !item.finalLocation.toLowerCase().includes(streetNameFilter.toLowerCase())) {
          return false;
        }
      } catch (e) {
        return false;
      }

      if (incidentNameFilter && !item.incidentName.toLowerCase().includes(incidentNameFilter.toLowerCase())) return false;

      return true;

    });

  }

  updateStreetNameFilter = (e) => {
    e.preventDefault();

    this.setState({
      streetNameFilter: this.streetNameFilter.value,
    }, this.query);

  }


  updateIncidentName = (e) => {

    e.preventDefault();

    this.setState({
      incidentNameFilter: this.incidentNameFilter.value,
    }, this.query);


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


    return (
      <section className="App container">

        <h1 className="App__h1">Melrose Police Incidents (Beta)</h1>

        <div
          className="App__filter panel panel-default">

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

        <div
          className={`App__results panel panel-default ${this.state.loading ? 'loading' : 'loaded'}`}>

          <div className="panel-heading">
            <h2 className="panel-title">{this.state.incidents.length} Results</h2>
          </div>

          <div
            className='panel-body'>

            {
              this.state.viewType == 'IncidentList' && (
              <IncidentList incidents={this.state.incidents} />
              )
            }

            {
              this.state.viewType == 'TotalByWeek' && (
              <TotalByWeek incidents={this.state.incidents} />
              )
            }

            {
              this.state.viewType == 'MapView' && (
              <MapView incidents={this.state.incidents} />
              )
            }
          </div>

          <Loading />

          <div className="App__results__screen" />

        </div>

      </section>
    )

  }


}
