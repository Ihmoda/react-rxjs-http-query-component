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

const STOP_POLLING = "STOP_POLLING";

export class HttpQuery extends Component {
  constructor(props) {
    super(props);
    const subject = new Subject();
    const endObservable$ = subject.pipe(filter(val => val === STOP_POLLING));
    this.state = {
      endObservable$,
      error: false,
      loading: false,
      data: null
    };
  }

  componentDidMount() {
    this.setState(() => ({ loading: true }));
    this._requestData().subscribe(this._updateData);
  }

  componentWillUnmount() {
    this._stopPolling();
  }

  _requestData = () => {
    const { url } = this.props;
    return from(fetch(url)).pipe(
      switchMap(data => data.json()),
      tap(() => {
        this.setState({ loading: false });
      })
    );
  };

  _updateData = data => {
    this.setState({
      data: data
    });
  };

  _startPolling = () => {
    const { endObservable$ } = this.state;
    const { pollInterval = 5000 } = this.props;
    return timer(0, pollInterval)
      .pipe(
        tap(() => {
          this.setState({ loading: true });
        }),
        switchMap(this._requestData),
        takeUntil(endObservable$),
        catchError(val => {
          this.setState({ error: true });
          of(`Error: ${val}`);
        }),
        retry(3)
      )
      .subscribe(this._updateData);
  };

  _stopPolling = () => {
    const { endObservable$ } = this.state;
    endObservable$.next(STOP_POLLING);
  };

  render() {
    return (
      <div>
        {this.props.children({
          startPolling: this._startPolling,
          stopPolling: this._stopPolling,
          error: this.state.error,
          loading: this.state.loading,
          data: this.state.data
        })}
      </div>
    );
  }
}
