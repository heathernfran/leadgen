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
      dedup: [],
      dupIds: [],
      dupEmails: []
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
    // Find duplicate values by key, create array of duplicates based on key.
    // This will conditionally style duplicates in render().
    let ids = _.filter(Object.keys(this.state.dedup), o => /_id/.test(o))
    let emails = _.filter(Object.keys(this.state.dedup), o => /email/.test(o))
    this.setState({
      dupIds: this._checkDups(ids, []),
      dupEmails: this._checkDups(emails, [])
    })
  }

  _checkDups(keyArg, stateArray) {
    let dedupArray = []
    // Build array from inputted key (e.g. _id, email)
    _.filter(this.state.dedup, (o) => dedupArray.push(o.keyArg))

    // Find duplicates resulting from inputted key
    let dups = _.reduce(dedupArray, (result, value, key) => {
      (result[value] || (result[value] = [])).push(key)
      return result
    }, {})

    // Log number of duplicate occurrences
    Object.keys(dups).forEach((val, key) => {
      if (dups[val].length > 1) {
        console.log(`Duplicates of ${val} found, ${dups[val].length}`)
        stateArray.push(val)
      }
    })
    return stateArray
  }

  render() {
    return (
      <div className="App">
        {this.state.dedup.map((value) => {
          return (
            <div key={uuid()}>
              <h1>{value.lastName}, {value.firstName}</h1>
              <h2 className={this.state.dupIds.indexOf(value._id) > -1 ? 'duplicate' : ''}>{value._id}</h2>
              <p className={this.state.dupEmails.indexOf(value.email) > -1 ? 'duplicate' : ''}>{value.email}</p>
              <span>{value.entryDate}</span>
            </div>
          )
        })}
      </div>
    );
  }
}

export default App;
