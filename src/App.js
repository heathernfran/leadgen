import React, { Component } from 'react';
import './App.css';

import dataLeads from './data/leads.json'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dedup: []
    }
  }

  componentWillMount() {
    this.setState({ dedup: dataLeads.leads })
  }

  render() {
    return (
      <div className="App">
        {this.state.dedup.map((value) => {
          return (
            <div key={value._id}>
              <h1>{value.lastName}, {value.firstName}</h1>
              <p>{value.email}</p>
              <span>{value.entryDate}</span>
            </div>
          )
        })}
      </div>
    );
  }
}

export default App;
