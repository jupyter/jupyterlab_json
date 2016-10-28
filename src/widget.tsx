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

import {
  renderComponent,
  disposeComponent
} from './component';

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
    this._ref = null;
    this.addClass(WIDGET_CLASS);
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
      disposeComponent(this.node);
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
      this._ref = renderComponent(json, this.node);
    }
  }

  /**
   * A message handler invoked on an `'after-attach'` message.
   */
  protected onAfterAttach(msg: Message): void {
    this.update();
  }

  private _context: DocumentRegistry.IContext<DocumentRegistry.IModel>;
  private _ref: Element | null;

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
