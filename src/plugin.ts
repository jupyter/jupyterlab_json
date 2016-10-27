// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  JupyterLab, JupyterLabPlugin
} from 'jupyterlab/lib/application';

import {
  IDocumentRegistry
} from 'jupyterlab/lib/docregistry';

import {
  IRenderMime
} from 'jupyterlab/lib/rendermime';

import {
  JSONWidgetFactory
} from './widget';

import {
  JSONRenderer
} from './renderer';

import './index.css';

/**
 * The list of file extensions for json.
 */
const EXTENSIONS = ['.json'];
const DEFAULT_EXTENSIONS = ['.json'];

/**
 * Activate the table widget extension.
 */
function activateJSONPlugin(app: JupyterLab, registry: IDocumentRegistry, rendermime: IRenderMime): void {

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
      displayName: 'JSON',
      modelName: 'text',
      preferKernel: false,
      canStartKernel: false
    };

    registry.addWidgetFactory(new JSONWidgetFactory(), options);

}

const JSONPlugin: JupyterLabPlugin<void> = {
  id: 'jupyter.extensions.json',
  requires: [IDocumentRegistry, IRenderMime],
  activate: activateJSONPlugin,
  autoStart: true
};

export default JSONPlugin;
