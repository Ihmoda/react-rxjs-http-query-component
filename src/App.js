import React, { Component } from "react";
import { HttpQuery } from "./HttpQuery";
import "./App.css";

const apiUrl = "https://qrng.anu.edu.au/API/jsonI.php?length=1&type=uint16";

class App extends Component {
  render() {
    return (
      <div>
        <HttpQuery url={apiUrl} pollInterval={3000}>
          {({ data, startPolling, stopPolling, error, loading }) => {
            if (error) return <h1>"Error!"</h1>;
            return (
              <div className="App">
                <h1>Random number geneator!</h1>
                <button onClick={startPolling}>Start polling</button>
                <button onClick={stopPolling}>Stop Polling</button>
                <h1>Your random number:</h1>
                {loading && <h1>"Loading..."</h1>}
                {data && !loading && <h1>{data.data[0]}</h1>}
              </div>
            );
          }}
        </HttpQuery>
      </div>
    );
  }
}

export default App;
