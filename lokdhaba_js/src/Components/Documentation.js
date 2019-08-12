import React, { Component } from 'react';
export default class Documentation extends Component {
  render() {
    return (
      <div id="documentation" className="content">

      <h1>Documentation</h1>
      <p>Please refer to the <a href="June10LokDhabaCodebook.pdf">Lok Dhaba Codebook</a> to understand the fields in this
      dataset.</p>
      <h2>Election Data</h2>
      <ul>
        <li>Francesca R. Jensenius and Gilles Verniers, Indian National Election and Candidate Database 1962-Today,
          Trivedi Centre for Political Data, 2017, lokdhaba.ashoka.edu.in</li>
        <li>Francesca R. Jensenius and Gilles Verniers (2017). “Studying Indian Politics with Large-scale Data: Indian
          Election Data 1961–Today.” Studies in Indian Politics, Vol 5, Issue 2, pp. 269-275.
        </li>
      </ul>
      <h2>Incumbency Data</h2>
      <ul>
        <li>Sudheendra Hangal and Gilles Verniers (2019). Individual Trajectories of Candidates in Indian General
          Elections, 1962-current, Trivedi Centre for Political Data.</li>
      </ul>
      <h2>Incumbency Visualisation</h2>
      <ul>
      <li>Shivangi Tikekar and Sudheendra Hangal. Incumbency Profile of Candidates in Indian General Elections.
        Trivedi Centre for Political Data, 2019. https://lokdhaba.ashoka.edu.in/incumbency/GE.html</li>
      </ul>

</div>
    )
  }
}