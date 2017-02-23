import { Widget } from '@phosphor/widgets';
import { ABCWidgetFactory } from 'jupyterlab/lib/docregistry';
import { ActivityMonitor } from 'jupyterlab/lib/common/activitymonitor';
import React from 'react';
import ReactDOM from 'react-dom';
import JSONComponent from 'jupyterlab_json_react';

/**
 * The class name added to a DocWidget.
 */
const CLASS_NAME = 'jp-DocWidgetJSON';

/**
 * The timeout to wait for change activity to have ceased before rendering.
 */
const RENDER_TIMEOUT = 1000;

/**
 * A widget for rendering jupyterlab_json files.
 */
export class DocWidget extends Widget {
  constructor(context) {
    super();
    this._context = context;
    this.addClass(CLASS_NAME);
    context.model.contentChanged.connect(() => {
      this.update();
    });
    context.pathChanged.connect(() => {
      this.update();
    });
    this._monitor = new ActivityMonitor({
      signal: context.model.contentChanged,
      timeout: RENDER_TIMEOUT
    });
    this._monitor.activityStopped.connect(this.update, this);
  }

  /**
   * Dispose of the resources used by the widget.
   */
  dispose() {
    if (!this.isDisposed) {
      this._context = null;
      ReactDOM.unmountComponentAtNode(this.node);
      this._monitor.dispose();
      super.dispose();
    }
  }

  /**
   * A message handler invoked on an `'update-request'` message.
   */
  onUpdateRequest(msg) {
    this.title.label = this._context.path.split('/').pop();
    if (this.isAttached) {
      let content = this._context.model.toString();
      let json = content ? JSON.parse(content) : {};
      ReactDOM.render(
        <JSONComponent data={json} theme="cm-s-jupyter" />,
        this.node
      );
    }
  }

  /**
   * A message handler invoked on an `'after-attach'` message.
   */
  onAfterAttach(msg) {
    this.update();
  }
}

/**
 * A widget factory for DocWidget.
 */
export class DocWidgetFactory extends ABCWidgetFactory {
  constructor(options) {
    super(options);
  }

  /**
   * Create a new widget given a context.
   */
  createNewWidget(context, kernel) {
    const widget = new DocWidget(context);
    this.widgetCreated.emit(widget);
    return widget;
  }
}
