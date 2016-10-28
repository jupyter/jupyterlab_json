// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  JupyterLab, JupyterLabPlugin
} from 'jupyterlab/lib/application';

import {
  IRenderMime
} from 'jupyterlab/lib/rendermime';

import {
  JSONRenderer
} from './renderer';

import './index.css';

/**
 * Activate the table widget extension.
 */
function activateJSONPlugin(app: JupyterLab, rendermime: IRenderMime): void {

    /**
     * Add the MIME type based renderers at the beginning of the renderers.
     */
    rendermime.addRenderer('application/json', new JSONRenderer(), 0);

}

const JSONPlugin: JupyterLabPlugin<void> = {
  id: 'jupyter.extensions.json',
  requires: [IRenderMime],
  activate: activateJSONPlugin,
  autoStart: true
};

export default JSONPlugin;
