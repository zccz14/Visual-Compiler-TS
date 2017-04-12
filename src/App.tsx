import * as React from 'react';
import './App.css';
import ShowBox from './ShowBox';
const logo = require('./logo.svg');

class App extends React.Component<null, null> {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to Visual Compiler</h2>
        </div>
        <p className="App-intro">
          Input Regular Expression
        </p>
        <ShowBox/>
      </div>
    );
  }
}

export default App;
