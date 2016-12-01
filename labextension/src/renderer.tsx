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

import {
  JSONComponent
} from './component';

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
   * A message handler invoked on an `'before-detach'` message.
   */
  protected onBeforeDetach(msg: Message): void {
    ReactDOM.unmountComponentAtNode(this.node);
  }

  /**
   * A render function given the widget's DOM node.
   */
  private _render(): void {
    let json: JSONValue = this._source;
    ReactDOM.render(<JSONComponent data={json} />, this.node) as Element;
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
