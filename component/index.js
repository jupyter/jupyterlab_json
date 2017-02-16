import React from 'react';
import './index.css';

export default class JSONComponent extends React.Component {

  render() {
      return (
        <div className="JSON">
          {JSON.stringify(this.props.data)}
        </div>
      );
  }

}
