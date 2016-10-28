// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import * as React from 'react';

import * as ReactDOM from 'react-dom';

import JSONTree from 'react-json-tree';

export
function renderComponent(json: [any] | {}, node: HTMLElement): any {
  return ReactDOM.render(
    <JSONTree
      data={json}
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
        switch (type) {
          case 'array':
            return <span className="cm-variable-2">{label}: </span>;
          case 'object':
            return <span className="cm-variable-3">{label}: </span>;
          case 'root':
          default:
            return <span className="cm-variable">{label}: </span>;
        }
      }}
      valueRenderer={(raw) => {
        switch (typeof raw) {
          case 'number':
            return <span className="cm-number">{raw}</span>;
          case 'string':
          default:
            return <span className="cm-string">{raw}</span>;
        }
      }}
    />,
    node
  );
}

export
function disposeComponent(node: HTMLElement): void {
  ReactDOM.unmountComponentAtNode(node);
}
