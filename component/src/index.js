import React from 'react';
import ReactDOM from 'react-dom';
import JSONTree from 'react-json-tree';
import Highlight from 'react-highlighter';
import '../index.css';

const theme = {
  scheme: 'jupyter',
  base00: '#fff',
  base01: '#fff',
  base02: '#d7d4f0',
  base03: '#408080',
  base04: '#b4b7b4',
  base05: '#c5c8c6',
  base06: '#d7d4f0',
  base07: '#fff',
  base08: '#000',
  base09: '#080',
  base0A: '#fba922',
  base0B: '#408080',
  base0C: '#aa22ff',
  base0D: '#00f',
  base0E: '#008000',
  base0F: '#00f'
};

export default class JSONComponent extends React.Component {
  state = { filter: '' };
  input = null;
  timer = null;

  componentDidMount() {
    /**
     * Stop propagation of keyboard events to JupyterLab 
     */
    ReactDOM.findDOMNode(this.input).addEventListener(
      'keydown',
      event => {
        event.stopPropagation();
      },
      false
    );
  }

  componentWillUnmount() {
    ReactDOM.findDOMNode(this.input).removeEventListener(
      'keydown',
      event => {
        event.stopPropagation();
      },
      false
    );
  }

  render() {
    const { data, metadata } = this.props;
    const keyPaths = this.state.filter
      ? filterPaths(data, this.state.filter)
      : ['root'];
    return (
      <div style={{ 
        position: 'relative',
        width: '100%'
      }}>
        <input
          ref={ref => this.input = ref}
          onChange={event => {
            const filter = event.target.value;
            if (this.timer) clearTimeout(this.timer);
            this.timer = setTimeout(
              () => {
                this.setState({ filter });
                this.timer = null;
              },
              300
            );
          }}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '33%',
            maxWidth: 150,
            zIndex: 10,
            fontSize: 13,
            padding: '4px 2px'
          }}
          type="text"
          placeholder="Filter..."
        />
        <JSONTree
          data={data}
          collectionLimit={100}
          theme={{
            extend: theme,
            // TODO: Use Jupyter Notebook's current CodeMirror theme vs. 'cm-s-ipython'
            tree: `CodeMirror ${this.props.theme || 'cm-s-ipython'}`,
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
            // rootNodeChildren: {},
            arrowSign: { color: 'cm-variable' }
          }}
          invertTheme={false}
          labelRenderer={([label, type]) => {
            let className = 'cm-variable';
            // if (type === 'root') className = 'cm-variable-2';
            if (type === 'array') className = 'cm-variable-2';
            if (type === 'object') className = 'cm-variable-3';
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
          valueRenderer={raw => {
            let className = 'cm-string';
            if (typeof raw === 'number') className = 'cm-number';
            if (raw === 'true' || raw === 'false') className = 'cm-keyword';
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
          shouldExpandNode={(keyPath, data, level) =>
            metadata && metadata.expanded 
              ? true 
              : keyPaths.join(',').includes(keyPath.join(','))}
        />
      </div>
    );
  }
}

function objectIncludes(data, query) {
  return JSON.stringify(data).includes(query);
}

function filterObject(data, query) {
  if (Array.isArray(data)) {
    return data.reduce(
      (result, item) => {
        if (objectIncludes(item, query)) {
          return [...result, filterObject(item, query)];
        }
        return result;
      },
      []
    );
  }
  if (data && typeof data === 'object') {
    return Object.keys(data).reduce((result, key) => {
      let item = data[key];
      if (key.includes(query) || objectIncludes(item, query))
        result[key] = filterObject(item, query);
      return result;
    }, {});
  }
  return data;
}

function filterPaths(data, query, parent = ['root']) {
  if (Array.isArray(data)) {
    return data.reduce(
      (result, item, index) => {
        if (item && typeof item === 'object' && objectIncludes(item, query))
          return [
            ...result,
            [index, ...parent].join(','),
            ...filterPaths(item, query, [index, ...parent])
          ];
        return result;
      },
      []
    );
  }
  if (typeof data === 'object') {
    return Object.keys(data).reduce((result, key) => {
      let item = data[key];
      if (
        item &&
        typeof item === 'object' &&
        (key.includes(query) || objectIncludes(item, query))
      )
        return [
          ...result,
          [key, ...parent].join(','),
          ...filterPaths(item, query, [key, ...parent])
        ];
      return result;
    }, []);
  }
}
