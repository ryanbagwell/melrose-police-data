import React from 'react'
import propTypes from 'prop-types'

export default class SpeedList extends React.Component {

  static propTypes = {
    speed: propTypes.number
  }

  render() {
    return (
      <div className="SpeedLimitSign">
        <div className="SpeedLimitSign__inner">
          Speed<br />
          Limit<br />
          <b>{this.props.speed}</b>
        </div>
      </div>

    )

  }

}