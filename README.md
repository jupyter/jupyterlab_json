# jupyterlab_json

A JupyterLab and Jupyter Notebook extension for rendering JSON

![output renderer](http://g.recordit.co/QAsC7YULcY.gif)

## Prerequisites

* JupyterLab ^0.16.0 and/or Notebook >=4.3.0

## Usage

To render JSON output in IPython:

```python
from jupyterlab_json import JSON

JSON({
    "string": "string",
    "array": [1, 2, 3],
    "bool": True,
    "object": {
        "foo": "bar"
    }
})
```

To render a `.json` file as a tree, simply open it:

![file renderer](http://g.recordit.co/cbf0xnQHKn.gif)

## Install

```bash
pip install jupyterlab_json
# For JupyterLab
jupyter labextension install --py --sys-prefix jupyterlab_json
jupyter labextension enable --py --sys-prefix jupyterlab_json
# For Notebook
jupyter nbextension install --py --sys-prefix jupyterlab_json
jupyter nbextension enable --py --sys-prefix jupyterlab_json
```

## Development

```bash
git clone https://github.com/jupyterlab/jupyterlab_json.git
cd jupyterlab_json
pip install -e .
# For JupyterLab
jupyter labextension install --py --symlink --sys-prefix jupyterlab_json
# Windows users: jupyter labextension install --py --sys-prefix jupyterlab_json
jupyter labextension enable --py --sys-prefix jupyterlab_json
# For Notebook
jupyter nbextension install --py --symlink --sys-prefix jupyterlab_json
# Windows users: jupyter nbextension install --py --sys-prefix jupyterlab_json
jupyter nbextension enable --py --sys-prefix jupyterlab_json
```
