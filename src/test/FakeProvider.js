import React from 'react'
import PropTypes from 'prop-types'

export default class FakeProvider extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.store = props.store
  }
  getChildContext() {
    return { store: this.store }
  }

  render() {
    return React.Children.only(this.props.children)
  }
}

FakeProvider.propTypes = {
  store: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
}
FakeProvider.childContextTypes = {
  store: PropTypes.object.isRequired,
}
FakeProvider.displayName = 'FakeProvider'
