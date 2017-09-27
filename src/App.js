import React, { Component } from 'react'
import _ from 'lodash'
import moment from 'moment'
import uuid from 'uuid'
import jsonfile from 'jsonfile'
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

    this._writeJson(this.state.dedup)
  }

  componentDidMount() {
    // Find duplicate values by key, create array of duplicates based on key.
    // This will conditionally style duplicates in render().
    let id = _.findKey(_.head(this.state.dedup), o => o.match(/[a-z0-9]{18}/))
    let email = _.findKey(_.head(this.state.dedup), o => o.match(/@/))
    this.setState({
      dupIds: this._checkDups(id, []),
      dupEmails: this._checkDups(email, [])
    })
  }

  _checkDups(keyArg, stateArray) {
    let dedupArray = []
    // Build array from inputted key (e.g. _id, email)
    _.filter(this.state.dedup, (o) => dedupArray.push(o[keyArg]))

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

  _writeJson(array) {
    return array.forEach((obj) => {
      jsonfile.writeFile(
        './data/results.json',
        {
          "_id": obj["_id"],
          "email": obj["email"],
          "firstName": obj["firstName"],
          "lastName": obj["lastName"],
          "address": obj["address"],
          "entryDate": obj["entryDate"]
        },
        {flag: 'a'},
        (err) => console.log(`Error writing json: ${err}`)
      )
    })
  }

  _excludeFirstDup(counter) {
    if (counter > 1) return true
  }

  render() {
    let idCounter = 0
    return (
      <div className="App">
        {this.state.dedup.map((value) => {
          return (
            <div key={uuid()}>
              <h1>{value.lastName}, {value.firstName}</h1>
              <h2 className={this._excludeFirstDup(idCounter) ? 'duplicate' : ''}>{value._id}</h2>
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
