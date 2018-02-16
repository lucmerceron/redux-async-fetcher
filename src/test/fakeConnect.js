import React from 'react'
import PropTypes from 'prop-types'

/* eslint-disable */
const fakeConnect = mapStateToProps => Component => {
  class Connect extends React.Component {
    render() {
      const { store } = this.context

      const props = mapStateToProps(store.getState())
      return <Component {...this.props} {...props} />
    }
  }

  Connect.contextTypes = {
    store: PropTypes.object.isRequired,
  }

  return Connect
}
/* eslint-enable */

export default fakeConnect
