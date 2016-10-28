// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  JupyterLab, JupyterLabPlugin
} from 'jupyterlab/lib/application';

import {
  IDocumentRegistry
} from 'jupyterlab/lib/docregistry';

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
function activateJSONPlugin(app: JupyterLab, registry: IDocumentRegistry): void {

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
  requires: [IDocumentRegistry],
  activate: activateJSONPlugin,
  autoStart: true
};

export default JSONPlugin;
