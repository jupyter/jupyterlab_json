// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  IKernel
} from 'jupyter-js-services';

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
  IDocumentModel,
  IDocumentContext
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
  constructor(context: IDocumentContext<IDocumentModel>) {
    super();
    this._context = context;
    this.addClass(WIDGET_CLASS);
    if (context.model.toJSON()) {
      this.update();
    }
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
      let content: string = this._context.model.toString();
      let json: JSONValue = content ? JSON.parse(content) : {};
      // let json: JSONValue = this._context.model;
      ReactDOM.render(<JSONTree data={json} />, this.node);
    }
  }

  /**
   * A message handler invoked on an `'after-attach'` message.
   */
  protected onAfterAttach(msg: Message): void {
    this.update();
  }

  private _context: IDocumentContext<IDocumentModel>;

}


/**
 * A widget factory for maps.
 */
export
class JSONWidgetFactory extends ABCWidgetFactory<JSONWidget, IDocumentModel> {
  /**
   * Create a new widget given a context.
   */
  createNew(context: IDocumentContext<IDocumentModel>, kernel?: IKernel.IModel): JSONWidget {
    let widget = new JSONWidget(context);
    this.widgetCreated.emit(widget);
    return widget;
  }

}
