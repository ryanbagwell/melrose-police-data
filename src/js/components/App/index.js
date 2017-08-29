import React from 'react';
import PropTypes from 'prop-types';
import getFirebase from '../../utils/getFirebase';
import moment from 'moment';
import IncidentList from '../IncidentList';
import TotalByWeek from '../TotalByWeek';
import TotalPerShift from '../TotalPerShift';
import MapView from '../MapView';
import cache from '../../utils/cache';
import Loading from '../Loading';

const firebase = getFirebase();

const today = moment().format('M/D/YYYY');

const dates = {
  last7Days: {
    startDate: moment().subtract(7, 'days').format('M/D/YYYY'),
    endDate: today,
    label: 'Last 7 Days',
  },
  last14Days: {
    startDate: moment().subtract(14, 'days').format('M/D/YYYY'),
    endDate: today,
    label: 'Last 14 Days',
  },
  last30Days: {
    startDate: moment().subtract(30, 'days').format('M/D/YYYY'),
    endDate: today,
    label: 'Last 30 Days',
  },
  last60Days: {
    startDate: moment().subtract(60, 'days').format('M/D/YYYY'),
    endDate: today,
    label: 'Last 60 Days',
  },
  last90Days: {
    startDate: moment().subtract(90, 'days').format('M/D/YYYY'),
    endDate: today,
    label: 'Last 90 Days',
  },
  thisYear: {
    startDate: `1/1/${moment().format('YYYY')}`,
    endDate: today,
    label: 'This Year',
  },
  last12Months: {
    startDate: moment().subtract(12, 'months').format('M/D/YYYY'),
    endDate: today,
    label: 'Last 12 Months',
  },
  all: {
    startDate: '1/1/2016',
    endDate: today,
    label: 'All Dates',
  },

}


export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      dateQuery: null,
      startDate: moment().subtract(30, 'days').format('M/D/YYYY'),
      endDate: moment().format('M/D/YYYY'),
      incidents: [],
      streetNameFilter: '',
      incidentNameFilter: '',
      viewType: 'IncidentList',
      loading: false,
    }

  }

  changeDateQuery = (dateRange) => {
    this.setState(dateRange, this.query);
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

    let {streetNameFilter, incidentNameFilter} = this.state;

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

  updateFilters = (e) => {
    e.preventDefault();

    this.setState({
      incidentNameFilter: this.incidentNameFilter.value,
      streetNameFilter: this.streetNameFilter.value,
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

                  {
                    Object.values(dates).map( ({startDate, endDate, label}, i) => {
                      return (
                        <button
                          key={i}
                          type="button"
                          className={`btn ${this.state.startDate === startDate && this.state.endDate === endDate ? 'btn-info' : 'btn-default'}`}
                          data-selected={this.state.startDate === startDate && this.state.endDate === endDate}
                          onClick={x => this.changeDateQuery({startDate, endDate})}>
                          {label}
                        </button>
                      )

                    })

                  }

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
                      onClick={this.updateFilters}>Update</button>
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
                      onClick={this.updateFilters}>Update</button>
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
                    onClick={this.updateViewType.bind(null, 'TotalPerShift')}>Total Per Shift</button>

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
            <h2 className="panel-title">
              Showing {this.state.incidents.length} incidents from {this.state.startDate} through {this.state.endDate}
              {
                (this.state.incidentNameFilter || this.state.streetNameFilter) && " with filters " + [this.state.incidentNameFilter, this.state.streetNameFilter].filter(x => x).join(',')
              }
              </h2>
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
              this.state.viewType == 'TotalPerShift' && (
              <TotalPerShift incidents={this.state.incidents} />
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
