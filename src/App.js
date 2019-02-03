import React, { Component } from "react";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "Bulbasaur",
      imgUrl:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png",
      number: 1
    };

    const $observer = new Observable(observer => {
      setInterval(() => {
        const pokemonNumber =
          this.state.number < 152 ? this.state.number + 1 : 1;
        this.setState({ number: pokemonNumber });
        const result = fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonNumber}/`
        )
          .then(result => result.json())
          .then(data => observer.next(JSON.parse(JSON.stringify(data))));
      }, 3000);
    });

    $observer
      .pipe(
        map(data => {
          return {
            name: `${data.name[0].toUpperCase()}${data.name.substring(1)}`,
            imgUrl: data.sprites.back_default
          };
        })
      )
      .subscribe(this._getData);
  }

  _getData = data => {
    this.setState(() => ({
      name: data.name,
      imgUrl: data.imgUrl
    }));
  };

  render() {
    const { name, imgUrl } = this.state;
    return (
      <div className="App">
        <h1>Pokemon Cycler</h1>
        <h1>{name}</h1>
        <img src={imgUrl} />
      </div>
    );
  }
}

export default App;
