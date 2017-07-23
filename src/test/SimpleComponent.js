import React from 'react'
import PropTypes from 'prop-types'

class SimpleComponent extends React.Component {
  componentDidMount() {
    const { lifeCycleCallback, todoList } = this.props

    lifeCycleCallback('didMount', todoList)
  }

  render() {
    return (
      <div className="simple-normal-component">
        <h1>{this.props.title}</h1>
      </div>
    )
  }
}

SimpleComponent.propTypes = {
  title: PropTypes.string.isRequired,
  todoList: PropTypes.array.isRequired,
  lifeCycleCallback: PropTypes.func.isRequired,
}

export default SimpleComponent
