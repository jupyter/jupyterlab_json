from IPython.display import display, JSON
import json


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


# A display class that can be used within a notebook. E.g.:
#   from jupyterlab_json import JSON
#   JSON(data)
    
class JSON(JSON):

    @property
    def data(self):
        return self._data
    
    @data.setter
    def data(self, data):
        if isinstance(data, str):
            data = json.loads(data)
        self._data = data

    def _ipython_display_(self):
        bundle = {
            'application/json': self.data,
            'text/plain': '<jupyterlab_json.JSON object>'
        }
        display(bundle, raw=True)
