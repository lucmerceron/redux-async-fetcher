
# Redux-Async-Fetcher

ReduxAsyncFetcher is used to extract data fetching logic from your component lifecycle.

[![Travis Build](https://img.shields.io/travis/lucmerceron/redux-async-fetcher.svg?style=flat-square)](https://travis-ci.org/lucmerceron/redux-async-fetcher/) [![Version](https://img.shields.io/npm/v/redux-async-fetcher.svg?style=flat-square)](https://github.com/lucmerceron/redux-async-fetcher/releases) [![Code Coverage](https://img.shields.io/codecov/c/github/lucmerceron/redux-async-fetcher.svg?style=flat-square)](https://codecov.io/gh/lucmerceron/redux-async-fetcher)

## Installation

```
npm install --save redux-async-fetcher
```

## Documentation

**ReduxAsyncFetcher makes the assumption that you are using [Redux](http://redux.js.org/) to manage your React state and that you use [React-Redux](https://github.com/reactjs/react-redux) Provider to connect your store to your component.**

ReduxAsyncFetcher takes a data fetching function as parameter and returns a [Higher Order Component](https://facebook.github.io/react/docs/higher-order-components.html); by giving it a component, it will return an enhanced component.

```javascript
const EnhancedComponent = reduxAsyncFetcher(getAsyncState, [propsToWatch])(NormalComponent)
```

### Arguments

* `getAsyncState` (Function): Function that will be called at `NormalComponent` *componentDidMount* hook.
* `propsToWatch` (Array): Default value: []. Array of props name that will trigger `getAsyncState` at `NormalComponent` *componentDidUpdate* hook if shallow comparison between **propsToWatch** lastProps and props is false.

### Usage

Pass to **EnhancedComponent** the props you wish to convey to your NormalComponent.
```javascript
const normalComponentProps = {
  title: 'ReactAsyncFetcher is cool',
  color: 'red',
}
<EnhancedComponent {...normalComponentProps} />
```

Put code that fetch data in the `getAsyncState` and precise `propsToWatch` names if you want to retrigger your data fetching on some props change.
`getAsyncState` is called three parameters: dispatch, props and the state of the store.

```javascript
// dispatch & state are taken from our Redux store (Hence the Provider dependency)
const getAsyncState = (dispatch, props, state) => {
  // Here I can trigger my Redux actions like I would normally do from my NormalComponent
  // I can use some logic with props & state
  if (state.todoList.length === 0)
    dispatch(getTodoList())
}
```

### In the wild

When you separate your component into [Presentational and Container components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0), ReduxAsyncFetcher perfectly fit into your container components.

```javascript
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import reduxAsyncFetcher from 'redux-async-fetcher'

import UserView from './UserPresentational'
import { getUser, editUser } from '../../../actionCreators/users'

const mapStateToProps = (state, ownProps) => ({
  users: state.users,
  // Example with router parameter
  userId: ownProps.match.params.userId,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  editUser: user => dispatch(editUser(ownProps.match.params.userId, user)),
})

const getAsyncState = (dispatch, props, state) => {
  if (state.users.indexOf(props.userId) === -1)
    dispatch(getUser(props.userId))
}


export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(
    reduxAsyncFetcher(getAsyncState, ['userId'])(UserView)))


```

## Change Log
This project adheres to [Semantic Versioning](http://semver.org/).

You can find every release documented on the [Releases](https://github.com/lucmerceron/redux-async-fetcher/releases) page.

## License
MIT