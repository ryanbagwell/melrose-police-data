import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import IncidentList from '../IncidentList';
import TotalByWeek from '../TotalByWeek';
import TotalByMonth from '../TotalByMonth';
import TotalPerShift from '../TotalPerShift';
import MapView from '../MapView';
import cache from '../../utils/cache';
import Loading from '../Loading';
import QueryString from 'query-string';
import DatePicker from 'react-datepicker';

import prom from 'es6-promise';
prom.polyfill();
import 'isomorphic-fetch'
import formatNumber from 'number-formatter'

import styles from 'react-datepicker/dist/react-datepicker.css';


const today = moment().format('YYYY-MM-DD');

const dates = {
  last7Days: {
    startDate: moment().subtract(7, 'days').format('YYYY-MM-DD'),
    endDate: today,
    label: 'Last 7 Days',
  },
  last14Days: {
    startDate: moment().subtract(14, 'days').format('YYYY-MM-DD'),
    endDate: today,
    label: 'Last 14 Days',
  },
  last30Days: {
    startDate: moment().subtract(30, 'days').format('YYYY-MM-DD'),
    endDate: today,
    label: 'Last 30 Days',
  },
  last60Days: {
    startDate: moment().subtract(60, 'days').format('YYYY-MM-DD'),
    endDate: today,
    label: 'Last 60 Days',
  },
  last90Days: {
    startDate: moment().subtract(90, 'days').format('YYYY-MM-DD'),
    endDate: today,
    label: 'Last 90 Days',
  },
  thisYear: {
    startDate: `${moment().format('YYYY')}-01-01`,
    endDate: today,
    label: 'This Year',
  },
  lastYear: {
    startDate: `${moment().subtract(1, 'years').format('YYYY')}-01-01`,
    endDate: `${moment().subtract(1, 'years').format('YYYY')}-12-31`,
    label: 'Last Year',
  },
  last12Months: {
    startDate: moment().subtract(12, 'months').format('YYYY-MM-DD'),
    endDate: today,
    label: 'Last 12 Months',
  },
  all: {
    startDate: '2016-01-01',
    endDate: today,
    label: 'All Dates',
  },

}


export default class App extends React.Component {

  constructor(props) {
    super(props);

    const {
      startDate,
      endDate,
      streetNameFilter,
      incidentNameFilter,
      descriptionFilter,
      viewType
    } = QueryString.parse(window.location.search);

    this.state = {
      dateQuery: null,
      startDate: startDate || moment().subtract(30, 'days').format('YYYY-MM-DD'),
      endDate: endDate || moment().format('YYYY-MM-DD'),
      incidents: [],
      streetNameFilter: streetNameFilter || '',
      incidentNameFilter: incidentNameFilter || '',
      descriptionFilter: descriptionFilter || '',
      viewType: viewType || 'IncidentList',
      loading: false,
      datepickerStartDate: startDate || moment().subtract(30, 'days').format('YYYY-MM-DD'),
      datepickerEndDate:  endDate || moment().format('YYYY-MM-DD'),
    }

  }

  changeDateQuery = (dateRange) => {
    this.setState({
      ...dateRange,
      datepickerStartDate: dateRange.startDate,
      datepickerEndDate: dateRange.endDate,
    }, this.query);
  }

  componentDidMount() {
    this.query();
    this.streetNameFilter.value = this.state.streetNameFilter;
    this.incidentNameFilter.value = this.state.incidentNameFilter;
    this.descriptionFilter.value = this.state.descriptionFilter;
  }

  query = () => {

    this.setState({
      loading: true,
    });

    let queryParams = {
      startDate: moment(this.state.startDate).format('YYYY-MM-DD'),
      endDate: moment(this.state.endDate).format('YYYY-MM-DD'),
      incidentTitle: this.state.incidentNameFilter,
      streetName: this.state.streetNameFilter,
      description: this.state.descriptionFilter,
    }

    let cacheKey = Object.values(queryParams)
      .filter(x => x)
      .join('-');

    let cachedResults = cache.get(cacheKey);

    if (cachedResults) {
      return this.setState({
        incidents: cachedResults,
      }, () => this.setState({loading: false}));
    }

    let url = `//data.cosmicautomation.com/api/1.0/melrose-log-reports/?${QueryString.stringify(queryParams)}&limit=100000`;

    fetch(url)
        .then(response => {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        })
        .then(incidents => {

            this.setState({
              incidents: incidents.results,
            }, () => this.setState({loading: false}));

            cache.set(cacheKey, incidents.results);
        });


  }

  componentDidUpdate = (prevProps, prevState) => {
    this.updatePushState();
  };

  updatePushState = () => {

    const str = QueryString.stringify({
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      streetNameFilter: this.state.streetNameFilter,
      incidentNameFilter: this.state.incidentNameFilter,
      viewType: this.state.viewType,
    });

    history.pushState({}, '',`/?${str}`);

  };

  getFilteredIncidents = (incidents) => {

    return incidents;

  }

  updateFilters = (e) => {
    e.preventDefault();

    this.setState({
      dateRange: null,
      incidentNameFilter: this.incidentNameFilter.value,
      streetNameFilter: this.streetNameFilter.value,
      descriptionFilter: this.descriptionFilter.value,
      startDate: moment(this.state.datepickerStartDate).format('YYYY-MM-DD'),
      endDate: moment(this.state.datepickerEndDate).format('YYYY-MM-DD'),
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

  updateDatepicker = (type, date) => {

    if (type === 'start') {
      this.setState({
        datepickerStartDate:  date.format('YYYY-MM-DD'),
      })
    }

    if (type === 'end') {
      this.setState({
        datepickerEndDate: date.format('YYYY-MM-DD'),
      })
    }
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

              <div className="row">

                <div className="col-md-6">

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Street Name (e.g. howard)"
                    ref={x => this.streetNameFilter = x} />

                </div>

                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Incident Name (e.g. accident)"
                    ref={x => this.incidentNameFilter = x} />
                </div>

              </div>


              <div className="row">
                <div className="col-md-6">

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Incident Description"
                    ref={x => this.descriptionFilter = x} />

                </div>


                <div
                  className="col-md-6 datepicker-column">

                  <DatePicker
                    onChange={this.updateDatepicker.bind(this, 'start')}
                    selected={moment(this.state.datepickerStartDate)}
                    placeholderText="Start Date"
                    ref={x => this.startDateFilter = x} />

                  <span>to</span>

                  <DatePicker
                    onChange={this.updateDatepicker.bind(this, 'end')}
                    selected={moment(this.state.datepickerEndDate)}
                    placeholderText="End Date"
                    ref={x => this.endDateFilter = x} />

                </div>

              </div>

              <div className="row">
                <div className="col-md-8" />

                <div className="col-md-4 text-right">
                  <button
                    type="submit"
                    className="btn btn-default"
                    onClick={this.updateFilters}>Update</button>
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
                    onClick={this.updateViewType.bind(null, 'TotalByMonth')}>Total by month</button>

                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={this.updateViewType.bind(null, 'TotalPerShift')}>Total Per Shift</button>

                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={this.updateViewType.bind(null, 'MapView')}>Map</button>

                </div>
              </div>

            </form>

          </div>

        </div>

        <div
          className={`App__results panel panel-default ${this.state.loading ? 'loading' : 'loaded'}`}>

          <div className="panel-heading">
            <h2 className="panel-title">
                <span>
                  Showing {formatNumber('#,###.', this.state.incidents.length)} incidents from {moment(this.state.startDate).format('MM/DD/YYYY')} through {moment(this.state.endDate).format('MM/DD/YYYY')}
                  {
                    (this.state.incidentNameFilter || this.state.streetNameFilter) && " with filter(s) " + [`${this.state.incidentNameFilter}`, `${this.state.streetNameFilter}`].filter(x => x).join(' and ')
                  }
                </span>
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
              <TotalByWeek
                incidents={this.state.incidents}
                startDate={this.state.startDate}
                endDate={this.state.endDate} />
              )
            }

            {
              this.state.viewType == 'TotalByMonth' && (
              <TotalByMonth
                incidents={this.state.incidents}
                startDate={this.state.startDate}
                endDate={this.state.endDate} />
              )
            }

            {
              this.state.viewType == 'TotalPerShift' && (
              <TotalPerShift
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                incidents={this.state.incidents} />
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
