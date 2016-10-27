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

  constructor(options: RenderMime.IRenderOptions) {
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
    let content: string = this._source.toString();
    let json: JSONValue = content ? JSON.parse(content) : {};
    // let json: JSONValue = this._source;
    ReactDOM.render(<JSONTree data={json} />, this.node);
  }

  // private _source: JSONObject = null;
  private _source: string = null;

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
  render(options: RenderMime.IRenderOptions): Widget {
    return new RenderedJSON(options);
  }

}
