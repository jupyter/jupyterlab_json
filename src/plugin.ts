// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  JupyterLab, JupyterLabPlugin
} from 'jupyterlab/lib/application';

import {
  IRenderMime
} from 'jupyterlab/lib/rendermime';

import {
  IDocumentRegistry
} from 'jupyterlab/lib/docregistry';

import {
  JSONRenderer
} from './renderer';

import {
  JSONWidgetFactory
} from './widget';

import './index.css';

/**
 * The list of file extensions for json.
 */
const EXTENSIONS = ['.json'];
const DEFAULT_EXTENSIONS = ['.json'];

/**
 * Activate the table widget extension.
 */
function activateJSONPlugin(app: JupyterLab, rendermime: IRenderMime, registry: IDocumentRegistry): void {
  
  /**
   * Add the MIME type based renderers at the beginning of the renderers.
   */
  rendermime.addRenderer('application/json', new JSONRenderer(), 0);

  /**
   * Add file handler for standalone Vega JSON files.
   */
  let options = {
    fileExtensions: EXTENSIONS,
    defaultFor: DEFAULT_EXTENSIONS,
    name: 'JSON',
    displayName: 'JSON',
    modelName: 'text',
    preferKernel: false,
    canStartKernel: false
  };

  registry.addWidgetFactory(new JSONWidgetFactory(options));

}

const JSONPlugin: JupyterLabPlugin<void> = {
  id: 'jupyter.extensions.json',
  requires: [IRenderMime, IDocumentRegistry],
  activate: activateJSONPlugin,
  autoStart: true
};

export default JSONPlugin;
