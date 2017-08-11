import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import App from './App/app';


export default class TodoApp extends Component {
  render() {
    return (
          <App />
    )
  }
}
AppRegistry.registerComponent('AwesomeProject', () => TodoApp);