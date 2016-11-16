# jupyterlab_json

A Jupyter Lab extension for rendering JSON

## Prerequisites

* JupyterLab 0.8.0 or later

## Usage

To render [JSON-able dict or list](https://ipython.org/ipython-doc/3/api/generated/IPython.display.html#IPython.display.JSON) in IPython as a tree:

![output renderer](http://g.recordit.co/QAsC7YULcY.gif)

```python
from IPython.display import JSON
JSON({
    'string': 'string',
    'array': [1, 2, 3],
    'bool': True,
    'object': {
        'foo': 'bar'
    }
})
```

To render a JSON file as a tree, simply open it:

![file renderer](http://g.recordit.co/cbf0xnQHKn.gif)

## Installation

To install using pip:

```bash
pip install jupyterlab_json
jupyter labextension install --py --sys-prefix jupyterlab_json
jupyter labextension enable --py --sys-prefix jupyterlab_json
```

## Development

For a development install (requires npm version 4 or later), do the following in the repository directory:

```bash
npm install
pip install -e .
jupyter labextension install --symlink --py --sys-prefix jupyterlab_json
# or npm run install:extension
jupyter labextension enable --py --sys-prefix jupyterlab_json
# or npm run enable:extension
```

To rebuild the extension bundle:

```bash
npm run build
```

Or to watch the `src` directory and rebuild on changes:

```bash
npm run watch
```
