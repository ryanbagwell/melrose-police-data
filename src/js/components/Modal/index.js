import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';


export default class Modal extends React.Component {

  static propTypes = {
    children: PropTypes.element.isRequired,
    afterClose: PropTypes.func,
    bemModifier: PropTypes.string,
    open: PropTypes.bool,
  };

  static defaultProps = {
    onClose: null,
    bemModifier: null,
    open: false,
  };

  constructor(props) {
    super(props);

    this.close = this.close.bind(this);
    this.closeOnEscape = this.closeOnEscape.bind(this);

    this.state = {
      status: 'loading',
    };
  }

  componentDidMount() {

    this.setState({
      status: 'loaded',
    });

    this.cachedBodyOverflow = document.querySelector('body').style.overflow;

    document.querySelector('body').style.overflow = 'hidden';

    window.addEventListener('keydown', this.closeOnEscape);

  }

  componentWillUnmount() {

    document.querySelector('body').style.overflow = this.cachedBodyOverflow;

    window.removeEventListener('keydown', this.closeOnEscape);

  }

  closeOnEscape(e) {
    if (e.keyCode === 27) {
      this.close(e);
    }
  }

  close(e) {
    const callable = this.props.onClose || (event => {
      event.preventDefault();
      this.setState({
        status: 'closing',
      });
      setTimeout(() => {
        this.setState({
          status: 'closed',
        });
        document.querySelector('body').style.overflow = this.cachedBodyOverflow;
        if (this.props.afterClose) {
          this.props.afterClose();
        }
      }, 200);
    });

    callable(e);

  }

  clickOut = e => {
    if (e.target === this.backgroundEl) {
      this.close(e);
    }
  };


  render() {

    return (
      <div
        className={`Modal Modal--${this.props.bemModifier} ${this.state.status}`}
        ref={x => this.container = x}
        onClick={this.clickOut}>

        <div
          className="Modal__background"
          ref={x => this.backgroundEl = x} />

        <div className="Modal__content">

          <button
            onClick={this.close}
            type="button"
            className="Modal__content__close close"
            aria-label="Close">
              <span aria-hidden="true">&times;</span>
          </button>

          <div className="Modal__content__inner">
            {this.props.children}
          </div>
        </div>

      </div>

    );

  }

}
