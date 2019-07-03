import React from 'react'
import PropTypes from 'prop-types'

class SimpleComponent extends React.Component {
  componentDidMount() {
    const { lifeCycleCallback, todoList } = this.props

    lifeCycleCallback('didMount', todoList)
  }

  componentDidUpdate() {
    const { lifeCycleCallback, todoList } = this.props
    lifeCycleCallback('didUpdate', todoList)
  }

  render() {
    const { title } = this.props
    return (
      <div className="simple-normal-component">
        <h1>{title}</h1>
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
