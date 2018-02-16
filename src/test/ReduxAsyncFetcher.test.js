import React from 'react'
import { mount } from 'enzyme'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import SimpleComponent from './SimpleComponent'
import FakeProvider from './FakeProvider'
import fakeConnect from './fakeConnect'
import ReduxAsyncFetcher from '../ReduxAsyncFetcher'

describe('ReduxAsyncFetcher HOC', () => {
  const middlewares = [thunk]
  const mockStore = configureStore(middlewares)
  const todoStore = { todoList: [] }
  const fakeStore = mockStore(todoStore)
  const fakeFetchResult = ['Star the repo', 'Ask me if anything is unclear']
  const getAsyncDataCall = jest.fn()
  const getAsyncDataCall2 = jest.fn()
  const fakeAction = result => ({
    type: 'FETCH_TODOLIST_SUCCESS',
    todoList: result,
  })
  // The promise to fetch our data (should be an action)
  const fetchTodoList = () => new Promise(resolve => {
    setTimeout(() => resolve(fakeFetchResult), 400)
  })

  // Connect an action logic to our component componentDidMount
  const ComponentWithFetchingLogic = ReduxAsyncFetcher(dispatch => {
    fetchTodoList().then(result => {
      dispatch(fakeAction(result))
      todoStore.todoList = fakeAction(result).todoList
    })
    getAsyncDataCall()
  }, ['todoList'])(SimpleComponent)

  const ComponentWithFetchingLogicWatcher = ReduxAsyncFetcher(dispatch => {
    fetchTodoList().then(result => {
      dispatch(fakeAction(result))
      todoStore.todoList = fakeAction(result).todoList
    })
    getAsyncDataCall2()
  })(SimpleComponent)

  // Give the store with our fakeConnect to our SimpleComponent
  const ConnectedComponent = fakeConnect(store => ({ todoList: store.todoList }))(SimpleComponent)
  const ConnectedComponentWithLogic =
    fakeConnect(store => ({ todoList: store.todoList }))(ComponentWithFetchingLogic)
  const ConnectedComponentWithFetchingLogicWatcher =
    fakeConnect(store => ({ todoList: store.todoList }))(ComponentWithFetchingLogicWatcher)

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
    <FakeProvider store={fakeStore}>
      <ConnectedComponent {...props} />
    </FakeProvider>)
  const ComponentWithLogicWrapper = mount(
    <FakeProvider store={fakeStore}>
      <ConnectedComponentWithLogic {...props} />
    </FakeProvider>)
  const ComponentWithFetchingLogicWatcherWrapper = mount(
    <FakeProvider store={fakeStore}>
      <ConnectedComponentWithFetchingLogicWatcher {...props2} />
    </FakeProvider>)

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
  it('should correctly call our getAsyncData on component willMount and dispatch action', done => {
    setTimeout(() => {
      expect(fakeStore.getActions()[0]).toEqual(fakeAction(fakeFetchResult))
      done()
    }, 500)
  })
  it('should call our getAsyncData if updated prop is watched', () => {
    // The store has been updated
    expect(getAsyncDataCall).toHaveBeenCalledTimes(1)
    ComponentWithLogicWrapper.update()
    expect(props.lifeCycleCallback).toBeCalledWith('didUpdate', fakeFetchResult)
    expect(getAsyncDataCall).toHaveBeenCalledTimes(2)
  })
  it('should not call our getAsyncData if updated prop is not watched', () => {
    // The store has been updated
    expect(getAsyncDataCall2).toHaveBeenCalledTimes(1)
    ComponentWithFetchingLogicWatcherWrapper.update()
    expect(props2.lifeCycleCallback).toBeCalledWith('didUpdate', fakeFetchResult)
    expect(getAsyncDataCall2).toHaveBeenCalledTimes(1)
  })
})
