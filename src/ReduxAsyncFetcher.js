import React from 'react'
import PropTypes from 'prop-types'

/*
* ReduxAsyncFetcher is a Higher Order Component used to fetch  async data in place of and for a subComponent
* It need to be connected to a react-redux store so Provider is needed
* ReduxAsyncFetcher will call getAsyncData with three params : dispatch, props connected and store state
* and returns the subComponent with props given
*/
const ReduxAsyncFetcher = getAsyncData => SubComponent => {
  class Fetch extends React.Component {
    componentDidMount() {
      const { store } = this.context
      getAsyncData(store.dispatch, this.props, store.getState())
    }

    render() {
      return <SubComponent {...this.props} />
    }
  }

  Fetch.contextTypes = {
    store: PropTypes.object.isRequired,
  }

  return Fetch
}

export default ReduxAsyncFetcher
