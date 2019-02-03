import React, { Component } from "react";
import { Subject, from, timer, of } from "rxjs";
import {
  switchMap,
  takeUntil,
  filter,
  retry,
  catchError,
  tap
} from "rxjs/operators";

const STOP = "STOP";

export class ReactPolling extends Component {
  constructor(props) {
    super(props);
    const subject = new Subject();
    const endObservable$ = subject.pipe(filter(val => val === STOP));
    this.state = {
      endObservable$,
      error: false,
      loading: false
    };
  }

  _requestData(url) {
    return from(fetch(url)).pipe(
      switchMap(data => data.json()),
      tap(() => {
        this.setState({ loading: false });
      })
    );
  }

  _startPolling = (url, subscriber, interval = 5000) => {
    if (typeof subscriber !== "function") {
      return;
    }
    const { endObservable$ } = this.state;
    return timer(0, interval)
      .pipe(
        tap(() => {
          this.setState({ loading: true });
        }),
        switchMap(() => this._requestData(url)),
        takeUntil(endObservable$),
        catchError(val => {
          this.setState({ error: true });
          of(`Error: ${val}`);
        }),
        retry(3)
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
          stopPolling: this._stopPolling,
          error: this.state.error,
          loading: this.state.loading
        })}
      </div>
    );
  }
}
