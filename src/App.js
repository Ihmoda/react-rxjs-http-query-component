import React, { Component } from "react";
import { Subject, from, timer } from "rxjs";
import { map, switchMap, takeUntil, filter } from "rxjs/operators";
import logo from "./logo.svg";
import "./App.css";

const apiUrl = "https://pokeapi.co/api/v2/pokemon";
const STOP = "STOP";

class App extends Component {
  constructor(props) {
    super(props);

    const subject = new Subject();
    const endObservable$ = subject.pipe(filter(val => val === STOP));

    this.state = {
      name: "Bulbasaur",
      imgUrl:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png",
      number: 1,
      endObservable$
    };
  }

  _updatePokemon = data => {
    const { name, imgUrl } = data;
    this.setState({
      name,
      imgUrl
    });
  };

  _requestData(url) {
    return from(fetch(url)).pipe(
      switchMap(data => data.json()),
      map(data => {
        return {
          name: `${data.name[0].toUpperCase()}${data.name.substring(1)}`,
          imgUrl: data.sprites.back_default
        };
      })
    );
  }

  _startPolling = (url, interval = 5000) => {
    const { endObservable$ } = this.state;
    return timer(1, interval)
      .pipe(
        switchMap(x => {
          const fullUrl = `${url}/${x + 1}/`;
          return this._requestData(fullUrl);
        }),
        takeUntil(endObservable$)
      )
      .subscribe(this._updatePokemon);
  };

  _stopPolling = () => {
    const { endObservable$ } = this.state;
    endObservable$.next(STOP);
  };

  render() {
    const { name, imgUrl } = this.state;
    return (
      <div className="App">
        <h1>Pokemon Cycler</h1>
        <button onClick={() => this._startPolling(apiUrl)}>
          Start Polling
        </button>
        <button onClick={() => this._stopPolling(apiUrl)}>Stop Polling</button>
        <h1>{name}</h1>
        <img src={imgUrl} />
      </div>
    );
  }
}

export default App;
