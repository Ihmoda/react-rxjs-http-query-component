import React, { Component } from "react";
import { Subject, from, timer } from "rxjs";
import { switchMap, takeUntil, filter } from "rxjs/operators";

const STOP = "STOP";

export class PollInterval extends Component {
  constructor(props) {
    super(props);

    const subject = new Subject();
    const endObservable$ = subject.pipe(filter(val => val === STOP));
    this.state = {
      endObservable$
    };
  }

  _requestData(url) {
    return from(fetch(url)).pipe(switchMap(data => data.json()));
  }

  _startPolling = (url, subscriber, interval = 5000) => {
    const { endObservable$ } = this.state;
    return timer(0, interval)
      .pipe(
        switchMap(() => this._requestData(url)),
        takeUntil(endObservable$)
      )
      .subscribe(subscriber);
  };

  _stopPolling = () => {
    const { endObservable$ } = this.state;
    endObservable$.next(STOP);
  };

  render() {
    return (
      <div>
        {this.props.children({
          startPolling: this._startPolling,
          stopPolling: this._stopPolling
        })}
      </div>
    );
  }
}
