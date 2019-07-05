import React from 'react'
import { connect, Provider } from 'react-redux'
import { mount } from 'enzyme'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import SimpleComponent from './SimpleComponent'
import ReduxAsyncFetcher from '../ReduxAsyncFetcher'

describe('ReduxAsyncFetcher HOC', () => {
  const middlewares = [thunk]
  const mockStore = configureStore(middlewares)
  const todoStore = { todoList: [] }
  const fakeStore = mockStore(todoStore)
  const fakeFetchResult = ['Star the repo', 'Ask me if anything is unclear']
  const getAsyncDataCall = jest.fn()
  const getAsyncDataCall2 = jest.fn()

  // Connect an action logic to our component componentDidMount
  const ComponentWithFetchingLogic = ReduxAsyncFetcher(dispatch => {
    getAsyncDataCall(dispatch)
  }, ['todoList'])(SimpleComponent)

  const ComponentWithFetchingLogicWatcher = ReduxAsyncFetcher(dispatch => {
    getAsyncDataCall2(dispatch)
  })(SimpleComponent)

  // Give the store with our fakeConnect to our SimpleComponent
  const ConnectedComponent = connect(store => ({ todoList: store.todoList }), {})(SimpleComponent)
  const ConnectedComponentWithLogic = connect(store => ({ todoList: store.todoList }), {})(ComponentWithFetchingLogic)
  const ConnectedComponentWithFetchingLogicWatcher = connect(store => ({ todoList: store.todoList }), {})(ComponentWithFetchingLogicWatcher)

  // The props of our SimpleComponent
  const props = {
    title: 'I love HOC',
    lifeCycleCallback: jest.fn(),
  }
  const props2 = {
    title: 'I love HOC',
    lifeCycleCallback: jest.fn(),
  }
  // Mount the whole with Enzyme
  const ComponentWrapper = mount(
    <Provider store={fakeStore}>
      <ConnectedComponent {...props} />
    </Provider>,
  )
  const ComponentWithLogicWrapper = mount(
    <Provider store={fakeStore}>
      <ConnectedComponentWithLogic {...props} />
    </Provider>,
  )
  const ComponentWithFetchingLogicWatcherWrapper = mount(
    <Provider store={fakeStore}>
      <ConnectedComponentWithFetchingLogicWatcher {...props2} />
    </Provider>,
  )

  it('should normally render title', () => {
    expect(ComponentWrapper.text()).toContain(props.title)
    expect(ComponentWithLogicWrapper.text()).toContain(props.title)
  })
  it('should convey props & store to our SimpleComponent', () => {
    expect(ComponentWrapper.find('SimpleComponent').props()).toEqual(Object.assign({}, props, todoStore))
    expect(ComponentWithLogicWrapper.find('SimpleComponent').props()).toEqual(Object.assign({}, props, todoStore))
  })
  it('should call lifeCycleCallback on didMount with empty todoList', () => {
    expect(props.lifeCycleCallback).toBeCalledWith('didMount', [])
  })
  it('should call our getAsyncData with a valid dispatch', () => {
    expect(getAsyncDataCall).toHaveBeenCalledWith(fakeStore.dispatch)
  })
  it('should call our getAsyncData if updated prop is watched', () => {
    // The store has been updated
    expect(getAsyncDataCall).toHaveBeenCalledTimes(1)
    ComponentWithLogicWrapper.setProps({ store: mockStore({ todoList: fakeFetchResult }) })
    expect(props.lifeCycleCallback).toHaveBeenCalledWith('didUpdate', fakeFetchResult)
    expect(getAsyncDataCall).toHaveBeenCalledTimes(2)
  })
  it('should not call our getAsyncData if updated prop is not watched', () => {
    // The store has been updated
    expect(getAsyncDataCall2).toHaveBeenCalledTimes(1)
    ComponentWithFetchingLogicWatcherWrapper.setProps({ store: mockStore({ todoList: fakeFetchResult }) })
    expect(props2.lifeCycleCallback).toHaveBeenCalledWith('didUpdate', fakeFetchResult)
    expect(getAsyncDataCall2).toHaveBeenCalledTimes(1)
  })
})
