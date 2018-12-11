import React, { Component } from "react";
import "./App.css";
import {} from "react-bootstrap";
import loading from "./asset/img/loading.gif";
import axios from "axios";
import Plot from 'react-plotly.js';

const loadstyle = {
  textAlign: "center"
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { inputted: 0, inputfield: null, datadate:[], dataclose:[] };

    this.submit = this.submit.bind(this);
    this.updateInputValue = this.updateInputValue.bind(this);
    this.updatedatearray = this.updatedatearray.bind(this);
  }

  submit() {
    this.setState({ inputted: 1 });

    var that = this;

    axios({
      method: "post",
      url: "http://localhost:5000/api",
      data: {
        symbol: this.state.inputfield
      }
    })
      .then(function(response) {
        console.log(response.data);

        response.data.forEach(element => {
          that.setState({datadate: that.state.datadate.concat(element.Date)});
          that.setState({dataclose: that.state.dataclose.concat(element["Close*"])});
          
        });

        that.setState({datadate: that.state.datadate.reverse(), dataclose: that.state.dataclose.reverse()})
        that.setState({inputted: 2});
      })
      .catch(function(error) {
        console.log(error);
      });

      
  }

  updateInputValue(evt) {
    //console.log("input field updated with "+evt.target.value);
    this.setState({ inputfield: evt.target.value });
  }

  updatedatearray(x){
    this.setState({ datadate: x.target.value });
  }

  render() {
    return (
      <div className="centerbox">
        <div className="formbox">
          {/* {this.state.updateInputValue} */}
          {this.state.inputted === 1 && (
            <div style={loadstyle}>
              <img src={loading} alt="loading" />
              <h1>Preparing your prediction</h1>
            </div>
          )}
          {this.state.inputted === 2 && (
            <div>
              <Plot
        data={[
          {
            x: this.state.datadate,
            y: this.state.dataclose,
            type: 'scatter',
            mode: 'lines',
            marker: {color: 'red'},
          },
          
        ]}
        layout={ {width: 600, height: 600, title: 'A Plot'} }
      />
            </div>
          )}
          {this.state.inputted === 0 && (
            <form id="symbolform">
              <input
                type="text"
                className="form-control"
                id="usr"
                onChange={this.updateInputValue}
                placeholder="input your symbol here"
              />
              <br />
              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={this.submit}
              >
                Submit
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }
}

export default App;
