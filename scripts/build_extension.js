var buildExtension = require('@jupyterlab/extension-builder').buildExtension;

buildExtension({
        name: 'jupyterlab_json',
        entry: './lib/plugin.js',
        outputDir: './jupyterlab_json/static'
});
