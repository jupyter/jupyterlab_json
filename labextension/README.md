# jupyterlab_json JupyterLab extension

A JupyterLab extension for rendering JSON output and files

## Prerequisites

<<<<<<< 0b7cfde46b61523e30d557319e0b6ea2ce3dd35f
* JupyterLab >= 0.11
=======
* JupyterLab >=0.11.0

## Usage

To render JSON output in IPython:
>>>>>>> jupyterlab/master

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

To render a .json file as a tree, simply open it:

![file renderer](http://g.recordit.co/cbf0xnQHKn.gif)

## Development

Install dependencies and build Javascript:

```bash
npm install
```

Re-build Javascript:

```bash
npm run build
```

Watch `/src` directory and re-build on changes:

```bash
npm run watch
```
