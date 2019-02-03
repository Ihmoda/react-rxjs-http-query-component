import React, { Component } from "react";
import { ReactPolling } from "./ReactPolling";
import "./App.css";

const apiUrl = "https://pokeapi.co/api/v2/pokemon/2/";
const STOP = "STOP";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "No data yet! Start polling!",
      imgUrl: ""
    };
  }
  _updatePokemon = data => {
    this.setState({
      name: data.name,
      imgUrl: data.sprites.back_default
    });
  };

  render() {
    const { name, imgUrl } = this.state;
    return (
      <div>
        <ReactPolling>
          {({ startPolling, stopPolling, error, loading }) => {
            if (error) return <h1>"Error!"</h1>;
            if (loading) return <h1>"Loading..."</h1>;
            return (
              <div className="App">
                <h1>Pokemon Poller</h1>
                <button
                  onClick={() => startPolling(apiUrl, this._updatePokemon)}
                >
                  Start Polling
                </button>
                <button onClick={stopPolling}>Stop Polling</button>
                <h1>{name}</h1>
                <img src={imgUrl} />
              </div>
            );
          }}
        </ReactPolling>
      </div>
    );
  }
}

export default App;
