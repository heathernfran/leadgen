import React, { Component } from 'react'
import _ from 'lodash'
import moment from 'moment'
import uuid from 'uuid'
import dataLeads from './data/leads.json'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dedup: []
    }
  }

  componentWillMount() {
    // Reference for sorting by date, using lodash and momentjs
    // https://thomaskekeisen.de/en/blog/array-date-sort-lodash-momentjs/
    let sortedDates = _.sortBy(dataLeads.leads, (dateValue) =>
      new moment(dateValue.date)).reverse()
    this.setState({ dedup: sortedDates })
  }

  componentDidMount() {
    this._checkDups()
  }

  _checkDups(keyArg) {
    let dedupArray = []
    // Build array from inputted key (e.g. _id, email)
    _.filter(this.state.dedup, (o) => dedupArray.push(o.keyArg || o.email))

    // Find duplicates resulting from inputted key
    let dups = _.reduce(dedupArray, (result, value, key) => {
      (result[value] || (result[value] = [])).push(key)
      return result
    }, {})

    console.log(dups)
  }

  render() {
    return (
      <div className="App">
        {this.state.dedup.map((value) => {
          return (
            <div key={uuid()}>
              <h1>{value.lastName}, {value.firstName}</h1>
              <h2>{value._id}</h2>
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
