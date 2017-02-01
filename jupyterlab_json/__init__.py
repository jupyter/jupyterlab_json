from IPython.display import display


# Running `npm run build` will create static resources in the static
# directory of this Python package (and create that directory if necessary).


def _jupyter_labextension_paths():
    return [{
        'name': 'jupyterlab_json',
        'src': 'static',
    }]

def _jupyter_nbextension_paths():
    return [{
        'section': 'notebook',
        'src': 'static',
        'dest': 'jupyterlab_json',
        'require': 'jupyterlab_json/extension'
    }]


# A display function that can be used within a notebook. E.g.:
#   from jupyterlab_json import JSON
#   JSON(data)

def JSON(data):
    bundle = {
        'application/json': data,
        'application/json': data,
        'text/plain': '<jupyterlab_json.JSON object>'
    }
    display(bundle, raw=True)
