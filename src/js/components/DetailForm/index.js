import React from 'react';
import PropTypes from 'prop-types';

const inputTypes = {
  original: 'textarea',
  numCitations: 'number',
}


export default class DetailForm extends React.Component {

  static propTypes = {
    incident: PropTypes.object,
  }

  render() {

    return (

      <div
          className="DetailForm panel panel-default">

        <div className="panel-heading">
          <h2 className="panel-title">Login</h2>
        </div>

        <div className="panel-body">

          <form onSubmit={this.handleSubmit}>

            {
              Object.keys(this.props.incident).map((key, i) => {
                const val = this.props.incident[key];

                return (
                  <div className="form-group">
                    <label>{key}</label>

                    {
                      inputTypes[key] === 'textarea' && (
                        <textarea
                          name={key}
                          className="form-control">
                          {this.props.incident[key]}
                        </textarea>
                      )

                    }

                    {
                      !inputTypes[key] && (
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={this.props.incident[key]} />
                      )
                    }


                  </div>
                )

              })


            }

            <button type="submit" className="btn btn-default">Submit</button>

          </form>
        </div>

      </div>

    )

  }

}
