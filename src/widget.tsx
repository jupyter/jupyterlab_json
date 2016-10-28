// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  Kernel
} from '@jupyterlab/services';

import {
  JSONValue
} from 'phosphor/lib/algorithm/json';

import {
  Message
} from 'phosphor/lib/core/messaging';

import {
  Widget
} from 'phosphor/lib/ui/widget';

import {
  ABCWidgetFactory,
  DocumentRegistry
} from 'jupyterlab/lib/docregistry';

import * as React from 'react';

import * as ReactDOM from 'react-dom';

import JSONTree from 'react-json-tree';

/**
 * The class name added to a JSON widget.
 */
const WIDGET_CLASS = 'jp-JSONWidget';


/**
 * A base JSON widget class.
 */
export
class JSONWidget extends Widget {

  /**
   * Construct a new map widget.
   */
  constructor(context: DocumentRegistry.IContext<DocumentRegistry.IModel>) {
    super();
    this._context = context;
    this.addClass(WIDGET_CLASS);
    // if (context.model.toJSON()) {
    //   this.update();
    // }
    context.model.contentChanged.connect(() => {
      this.update();
    });
    context.pathChanged.connect(() => {
      this.update();
    });
  }

  /**
   * Dispose of the resources used by the widget.
   */
  dispose(): void {
    if (!this.isDisposed) {
      this._context = null;
      ReactDOM.unmountComponentAtNode(this.node);
      super.dispose();
    }
  }

  /**
   * A message handler invoked on an `'update-request'` message.
   */
  protected onUpdateRequest(msg: Message): void {
    this.title.label = this._context.path.split('/').pop();
    if (this.isAttached) {
      console.log(this._context.model);
      let content: string = this._context.model.toString();
      let json: JSONValue = content ? JSON.parse(content) : {};
      // let json: JSONValue = this._context.model;
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
  }

  /**
   * A message handler invoked on an `'after-attach'` message.
   */
  protected onAfterAttach(msg: Message): void {
    this.update();
  }

  private _context: DocumentRegistry.IContext<DocumentRegistry.IModel>;

}


/**
 * A widget factory for maps.
 */
export
class JSONWidgetFactory extends ABCWidgetFactory<JSONWidget, DocumentRegistry.IModel> {

  /**
   * Create a new widget given a context.
   */
  createNewWidget(context: DocumentRegistry.IContext<DocumentRegistry.IModel>, kernel?: Kernel.IModel): JSONWidget {
    let widget = new JSONWidget(context);
    this.widgetCreated.emit(widget);
    return widget;
  }

}
