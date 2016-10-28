// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  RenderMime
} from 'jupyterlab/lib/rendermime';

import {
  Message
} from 'phosphor/lib/core/messaging';

import {
  Widget
} from 'phosphor/lib/ui/widget';

import {
  JSONObject,
  JSONValue
} from 'phosphor/lib/algorithm/json';

import * as React from 'react';

import * as ReactDOM from 'react-dom';

import JSONTree from 'react-json-tree';

const WIDGET_CLASS = 'jp-RenderedJSON';


/**
 * A widget for displaying HTML and rendering math.
 */
export
class RenderedJSON extends Widget {

  constructor(options: RenderMime.IRendererOptions<JSONObject>) {
    super();
    this.addClass(WIDGET_CLASS);
    this._source = options.source;
  }

  /**
   * A message handler invoked on an `'after-attach'` message.
   */
  protected onAfterAttach(msg: Message): void {
    this._render();
  }

  /**
   * A render function given the widget's DOM node.
   */
  private _render(): void {
    let json: JSONValue = this._source;
    ReactDOM.render(
      <JSONTree
        data={json}
        theme={{
          extend: 'default',
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
        // getItemString={(type, data, itemType, itemString) => {
        //   switch (type) {
        //     case 'label':
        //       switch (itemType) {
        //         case 'array':
        //           return <span className="cm-variable-2">{itemString}: </span>;
        //         case 'object':
        //           return <span className="cm-variable-3">{itemString}: </span>;
        //         case 'root':
        //         default:
        //           return <span className="cm-variable">{itemString}: </span>;
        //       }
        //     case 'value':
        //       switch (itemType) {
        //         case 'number':
        //           return <span className="cm-number">{itemString}</span>;
        //         case 'string':
        //         default:
        //           return <span className="cm-string">{itemString}</span>;
        //       }
        //     default:
        //       console.log(type, data, itemType, itemString);
        //       return <span className="cm-variable">{itemString}</span>;
        //   }
        // }}
      />,
      this.node
    );
  }

  private _source: JSONObject = null;

}

export
class JSONRenderer implements RenderMime.IRenderer {

  /**
   * The mimetypes this renderer accepts.
   */
  mimetypes = ['application/json'];

  /**
   * Whether the input can safely sanitized for a given mimetype.
   */
  isSanitizable(mimetype: string): boolean {
    return this.mimetypes.indexOf(mimetype) !== -1;
  }

  /**
   * Whether the input is safe without sanitization.
   */
  isSafe(mimetype: string): boolean {
    return false;
  }

  /**
   * Render the transformed mime bundle.
   */
  render(options: RenderMime.IRendererOptions<JSONObject>): Widget {
    return new RenderedJSON(options);
  }

}
