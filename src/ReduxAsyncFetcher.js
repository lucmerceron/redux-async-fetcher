import React from 'react'
import PropTypes from 'prop-types'

/*
* FetchData is a Higher Order Component used to FetchData in place of and for a subComponent
* It need to be connected to the store so react-redux Provider is needed for this to work
* FetchData will call getAsyncState with two params: dispatch and connectedProps
* propsChangeToWatch may be provided and is useful to trigger the getAsyncState function on specific change
*/
const ReduxAsyncFetcher = (getAsyncState, propsChangeToWatch = []) => SubComponent => {
  class Fetch extends React.Component {
    componentDidMount() {
      this.fetchData()
    }
    componentDidUpdate(lastProps) {
      if (propsChangeToWatch.some(prop => this.props[prop] !== lastProps[prop])) {
        this.fetchData()
      }
    }
    fetchData() {
      const { store } = this.context
      getAsyncState(store.dispatch, this.props, store.getState())
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
