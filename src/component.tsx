// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import * as React from 'react';

import * as ReactDOM from 'react-dom';

import JSONTree from 'react-json-tree';

import * as Highlight from 'react-highlighter';

import {
  JSONValue
} from 'phosphor/lib/algorithm/json';

export interface JSONComponentProps {
  data: JSONValue;
}

export interface JSONComponentState {
  filter: string;
}

export
class JSONComponent extends React.Component<JSONComponentProps, JSONComponentState> {

  constructor(props) {
    super(props);
    this.state = {
      filter: ''
    };
  }

  public componentDidMount() {
    /**
     * Stop propagation of keyboard events to JupyterLab to prevent triggering 
     * keyboard shortcuts. 
     */
    ReactDOM.findDOMNode(this).addEventListener('keydown', (event) => {
      event.stopPropagation();
    }, false);
  }

  public render() {
    let data = this.props.data;
    return (
      <div
        style={{
          position: 'relative'
        }}
      >
        <input
          value={this.state.filter}
          onChange={(event) => {
            this.setState({filter: (event.target as any).value});
          }}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '33%',
            maxWidth: 150,
            zIndex: 10,
            fontSize: 13,
            paddingHorizontal: 4,
            paddingVertical: 2
          }}
          type="text"
          placeholder="Filter..."
        />
        <JSONTree
          data={data}
          theme={{
            extend: 'default',
            // TODO: Use Jupyter Lab's current CodeMirror theme vs. 'cm-s-jupyter'
            tree: 'CodeMirror cm-s-jupyter',
            // valueLabel: 'cm-variable',
            valueText: 'cm-string',
            // nestedNodeLabel: 'cm-variable-2',
            nestedNodeItemString: 'cm-comment',
            // value: {},
            // label: {},
            // itemRange: {},
            // nestedNode: {},
            // nestedNodeItemType: {},
            // nestedNodeChildren: {},
            // rootNodeChildren: {}
          }}
          labelRenderer={([label, type]) => {
            let className;
            switch (type) {
              case 'array':
                className = 'cm-variable-2';
                break;
              case 'object':
                className = 'cm-variable-3';
                break;
              case 'root':
              default:
                className = 'cm-variable';
            }
            return (
              <span className={className}>
                <Highlight
                  search={this.state.filter}
                  matchStyle={{ backgroundColor: 'yellow' }}
                >
                  {`${label}: `}
                </Highlight>
              </span>
            );
          }}
          valueRenderer={(raw) => {
            let className;
            switch (typeof raw) {
              case 'number':
                className = 'cm-number';
                break;
              case 'string':
              default:
                className = 'cm-string';
            }
            return (
              <span className={className}>
                <Highlight
                  search={this.state.filter}
                  matchStyle={{ backgroundColor: 'yellow' }}
                >
                  {raw.toString()}
                </Highlight>
              </span>
            );
          }}
          shouldExpandNode={(keyName, data, level) => {
            return (this.state.filter !== '' && JSON.stringify(data).includes(this.state.filter)) || level < 1;
          }}
        />
      </div>
    );
  }

}
