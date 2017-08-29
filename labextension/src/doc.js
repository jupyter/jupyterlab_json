import { Widget } from '@phosphor/widgets';
import { ABCWidgetFactory } from '@jupyterlab/docregistry';
import { ActivityMonitor } from '@jupyterlab/coreutils';
import { runMode } from '@jupyterlab/codemirror';
import React from 'react';
import ReactDOM from 'react-dom';
import JSONComponent from 'jupyterlab_json_react';

const CLASS_NAME = 'jp-DocWidgetJSON';
const RENDER_TIMEOUT = 1000;

/**
 * A component for rendering error messages
 */
class ErrorDisplay extends React.Component {
  componentDidUpdate() {
    runMode(this.props.content, { name: 'javascript', json: true }, this.ref);
  }
  render() {
    return (
      <div className="jp-RenderedText jp-mod-error">
        <h2>{this.props.message}</h2>
        <pre
          ref={ref => {
            this.ref = ref;
          }}
          className="CodeMirror cm-s-jupyter CodeMirror-wrap"
        />
      </div>
    );
  }
}

/**
 * A widget for rendering JSON files
 */
export class DocWidget extends Widget {
  constructor(context) {
    super();
    this._context = context;
    this._onPathChanged();
    this.addClass(CLASS_NAME);
    context.ready.then(() => {
      this.update();
      /* Re-render when the document content changes */
      context.model.contentChanged.connect(this.update, this);
      /* Re-render when the document path changes */
      context.fileChanged.connect(this.update, this);
    });
    /* Update title when path changes */
    context.pathChanged.connect(this._onPathChanged, this);
    /* Throttle re-renders until changes have stopped */
    this._monitor = new ActivityMonitor({
      signal: context.model.contentChanged,
      timeout: RENDER_TIMEOUT
    });
    this._monitor.activityStopped.connect(this.update, this);
    /* Track widget width and height */
    this._width = this.node.offsetWidth;
    this._height = this.node.offsetHeight;
    this.addClass(CLASS_NAME);
  }

  /**
   * The widget's context
   */
  get context() {
    return this._context;
  }

  /**
   * Dispose of the resources used by the widget
   */
  dispose() {
    if (!this.isDisposed) {
      this._context = null;
      this._monitor.dispose();
      super.dispose();
    }
  }

  /**
   * A message handler invoked on an `'after-attach'` message
   */
  onAfterAttach(msg) {
    /* Render initial data */
    this.update();
  }

  /**
   * A message handler invoked on an `'before-detach'` message
   */
  onBeforeDetach(msg) {
    /* Dispose of resources used by  widget */
    ReactDOM.unmountComponentAtNode(this.node);
  }

  /**
   * A message handler invoked on a `'resize'` message
   */
  onResize(msg) {
    /* Re-render on resize */
    this.update();
  }

  /**
   * A message handler invoked on an `'update-request'` message
   */
  onUpdateRequest(msg) {
    if (this.isAttached && this._context.isReady) this._render();
  }

  /**
   * Render data to DOM node
   */
  _render() {
    const content = this._context.model.toString();
    try {
      const props = {
        data: JSON.parse(content),
        theme: 'cm-s-jupyter'
      };
      ReactDOM.render(<JSONComponent {...props} />, this.node);
    } catch (error) {
      ReactDOM.render(
        <ErrorDisplay message="Invalid JSON" content={content} />,
        this.node
      );
    }
  }

  /**
   * A message handler invoked on a `'path-changed'` message
   */
  _onPathChanged() {
    this.title.label = this._context.path.split('/').pop();
  }
}

/**
 * A widget factory for DocWidget
 */
export class DocWidgetFactory extends ABCWidgetFactory {
  /**
   * Create a new widget instance
   */
  createNewWidget(context) {
    return new DocWidget(context);
  }
}
