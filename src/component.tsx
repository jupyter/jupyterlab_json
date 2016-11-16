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
    this.timer = 0;
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
    // if (this.state.filter) data = filterObject(data, this.state.filter);
    let keyPaths = this.state.filter ? filterPaths(data, this.state.filter) : ['root'];
    return (
      <div
        style={{
          position: 'relative'
        }}
      >
        <input
          onChange={(event) => {
            let filter = (event.target as any).value;
            if (this.timer) clearTimeout(this.timer);
            this.timer = setTimeout(() => {
              this.setState({filter});
              this.timer = 0;
            }, 300);
          }}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '33%',
            maxWidth: 150,
            zIndex: 10,
            fontSize: 13,
            padding: '4px'
          }}
          type="text"
          placeholder="Filter..."
        />
        <JSONTree
          data={data}
          collectionLimit={100}
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
            // nestedNodeChildren: {,
            arrowSign: {
              color: 'cm-variable'
            }
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
                  {`${raw}`}
                </Highlight>
              </span>
            );
          }}
          shouldExpandNode={(keyPath, data, level) => {
            return keyPaths.includes(keyPath.join(','));
          }}
        />
      </div>
    );
  }

  private timer: number = 0;

}

function objectIncludes(data, query: string): boolean {
  return JSON.stringify(data).includes(query);
}

function filterObject(data, query: string) {
  if (data instanceof Array) {
    return data.reduce((result, item) => {
      if (objectIncludes(item, query)) {
        return [...result, filterObject(item, query)];
      }
      return result;
    }, []);
  }
  if (data && typeof(data) === 'object') {
    return Object.keys(data).reduce((result, key) => {
      let item = data[key];
      if (key.includes(query) || objectIncludes(item, query)) result[key] = filterObject(item, query);
      return result;
    }, {});
  }
  return data;
}

function filterPaths(data, query: string, parent: (string | number)[] = ['root']) {
  if (data instanceof Array) {
    return data.reduce((result, item, index) => {
      if (item && typeof(item) === 'object' && objectIncludes(item, query)) {
        return [...result, [index, ...parent].join(','), ...filterPaths(item, query, [index, ...parent])];
      }
      return result;
    }, []);
  }
  return Object.keys(data).reduce((result, key) => {
    let item = data[key];
    if (item && typeof(item) === 'object' && (key.includes(query) || objectIncludes(item, query))) {
      return [...result, [key, ...parent].join(','), ...filterPaths(item, query, [key, ...parent])];
    }
    return result;
  }, []);
}
