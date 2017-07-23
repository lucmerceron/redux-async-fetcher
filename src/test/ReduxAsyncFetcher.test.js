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
  const fakeAction = result => ({
    type: 'FETCH_TODOLIST_SUCCESS',
    todoList: result,
  })
  const success = fakeAction
  // The promise to fetch our data (should be an action)
  const fetchTodoList = () => new Promise(resolve => {
    setTimeout(() => resolve(fakeFetchResult), 400)
  })

  // Connect an action logic to our component componentDidMount
  const ComponentWithoutFetchingLogic = ReduxAsyncFetcher(dispatch => {
    fetchTodoList().then(result => dispatch(success(result)))
  })(SimpleComponent)

  // Give the store with our fakeConnect to our SimpleComponent
  const ConnectedComponent = fakeConnect(store => ({ todoList: store.todoList }))(SimpleComponent)
  const ConnectedComponentWithoutLogic =
    fakeConnect(store => ({ todoList: store.todoList }))(ComponentWithoutFetchingLogic)

  // The props of our SimpleComponent
  const props = {
    title: 'I love HOC',
    lifeCycleCallback: jest.fn(),
  }

  // Mount the whole with Enzyme
  const ComponentWrapper = mount(
    <FakeProvider store={fakeStore}>
      <ConnectedComponent {...props} />
    </FakeProvider>)
  const ComponentWithoutLogicWrapper = mount(
    <FakeProvider store={fakeStore}>
      <ConnectedComponentWithoutLogic {...props} />
    </FakeProvider>)

  it('should normally render title', () => {
    expect(ComponentWrapper.text()).toContain(props.title)
    expect(ComponentWithoutLogicWrapper.text()).toContain(props.title)
  })
  it('should convey props & store to our SimpleComponent', () => {
    expect(ComponentWrapper.find('SimpleComponent').props()).toEqual(Object.assign({}, props, todoStore))
    expect(ComponentWithoutLogicWrapper.find('SimpleComponent').props()).toEqual(Object.assign({}, props, todoStore))
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
})
