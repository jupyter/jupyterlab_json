import os, sys, subprocess, pipes
from distutils import log
from distutils.core import setup

repo_root = os.path.dirname(os.path.abspath(__file__))
sym_link = '--symlink' if sys.platform != 'win32' else ''
sys_prefix = '--sys-prefix' if os.environ.get('CONDA_DEFAULT_ENV', os.defpath) else ''

if sys.platform == 'win32':
    from subprocess import list2cmdline
else:
    def list2cmdline(cmd_list):
        """
        Translate a sequence of arguments into a command line
        string, using the same rules as the MS C runtime:

        1) Arguments are delimited by white space, which is either a
           space or a tab.

        2) A string surrounded by double quotation marks is
           interpreted as a single argument, regardless of white space
           contained within.  A quoted string can be embedded in an
           argument.

        3) A double quotation mark preceded by a backslash is
           interpreted as a literal double quotation mark.

        4) Backslashes are interpreted literally, unless they
           immediately precede a double quotation mark.

        5) If backslashes immediately precede a double quotation mark,
           every pair of backslashes is interpreted as a literal
           backslash.  If the number of backslashes is odd, the last
           backslash escapes the next double quotation mark as
           described in rule 3.
        """
        return ' '.join(map(pipes.quote, cmd_list))

try:
    from shutil import which
except ImportError:
    # which() function copied from Python 3.4.3; PSF license
    def which(cmd, mode=os.F_OK | os.X_OK, path=None):
        """
        Given a command, mode, and a PATH string, return the path which
        conforms to the given mode on the PATH, or None if there is no such
        file.

        `mode` defaults to os.F_OK | os.X_OK. `path` defaults to the result
        of os.environ.get("PATH"), or can be overridden with a custom search
        path.
        """
        # Check that a given file can be accessed with the correct mode.
        # Additionally check that `file` is not a directory, as on Windows
        # directories pass the os.access check.
        def _access_check(fn, mode):
            return (os.path.exists(fn) and os.access(fn, mode)
                    and not os.path.isdir(fn))

        # If we're given a path with a directory part, look it up directly rather
        # than referring to PATH directories. This includes checking relative to the
        # current directory, e.g. ./script
        if os.path.dirname(cmd):
            if _access_check(cmd, mode):
                return cmd
            return None

        if path is None:
            path = os.environ.get('PATH', os.defpath)
        if not path:
            return None
        path = path.split(os.pathsep)

        if sys.platform == 'win32':
            # The current directory takes precedence on Windows.
            if not os.curdir in path:
                path.insert(0, os.curdir)
            # PATHEXT is necessary to check on Windows.
            pathext = os.environ.get('PATHEXT', '').split(os.pathsep)
            # See if the given file matches any of the expected path extensions.
            # This will allow us to short circuit when given "python.exe".
            # If it does match, only test that one, otherwise we have to try
            # others.
            if any(cmd.lower().endswith(ext.lower()) for ext in pathext):
                files = [cmd]
            else:
                files = [cmd + ext for ext in pathext]
        else:
            # On other platforms you don't have things like PATHEXT to tell you
            # what file suffixes are executable, so just pass on cmd as-is.
            files = [cmd]

        seen = set()
        for dir in path:
            normdir = os.path.normcase(dir)
            if not normdir in seen:
                seen.add(normdir)
                for thefile in files:
                    name = os.path.join(dir, thefile)
                    if _access_check(name, mode):
                        return name
        return None
        
def run(cmd, *args, **kwargs):
    """Echo a command before running it"""
    log.info('> ' + list2cmdline(cmd))
    kwargs['shell'] = (sys.platform == 'win32')
    return subprocess.check_call(cmd, stdout=subprocess.PIPE, *args, **kwargs)

def build_labextension():
    # Check if npm is installed
    if not which('npm'):
        print('npm unavailable', file=sys.stderr)
        raise
    # Install Node depedencies for labextension
    try:
        run(['npm', 'install'], cwd=os.path.join(repo_root, 'labextension'))
    except OSError as e:
        print("Failed to install Node  dependencies for labextension: %s" % e, file=sys.stderr)
        raise
        
def build_nbextension():
    # Check if npm is installed
    if not which('npm'):
        print('npm unavailable', file=sys.stderr)
        raise
    # Install Node depedencies for nbextension
    try:
        run(['npm', 'install'], cwd=os.path.join(repo_root, 'nbextension'))
    except OSError as e:
        print("Failed to install Node  dependencies for nbextension: %s" % e, file=sys.stderr)
        raise
        
def install_labextension():
    # Check that jupyter lab is installed
    try:
        subprocess.check_call(['jupyter', 'lab', '--version'])
    except ImportError:
        print("jupyter lab unavailable: %s" % e, file=sys.stderr)
        raise
    # Install labextension
    try:
        run(['jupyter', 'labextension', 'install', '--py', sym_link, sys_prefix, 'jupyterlab_geojson'], cwd=repo_root)
    except OSError as e:
        print("Failed to install labextension: %s" % e, file=sys.stderr)
        raise
    # Enable labextension
    try:
        run(['jupyter', 'labextension', 'enable', '--py', sys_prefix, 'jupyterlab_geojson'], cwd=repo_root)
    except OSError as e:
        print("Failed to enable labextension: %s" % e, file=sys.stderr)
        raise

def install_nbextension():
    # Check that jupyter notebook is installed
    try:
        subprocess.check_call(['jupyter', 'notebook', '--version'])
    except ImportError:
        print("jupyter notebook unavailable: %s" % e, file=sys.stderr)
        raise
    # Install nbextension
    try:
        run(['jupyter', 'nbextension', 'install', '--py', sym_link, sys_prefix, 'jupyterlab_geojson'], cwd=repo_root)
    except OSError as e:
        print("Failed to install nbextension: %s" % e, file=sys.stderr)
        raise
    # Enable nbextension
    try:
        run(['jupyter', 'nbextension', 'enable', '--py', sys_prefix, 'jupyterlab_geojson'], cwd=repo_root)
    except OSError as e:
        print("Failed to enable nbextension: %s" % e, file=sys.stderr)
        raise
        
if 'develop' in sys.argv or any(a.startswith('bdist') for a in sys.argv):
    import setuptools

setup_args = dict(
    name                    = 'jupyterlab_json',
    version                 = '0.1.0',
    packages                = ['jupyterlab_json'],
    author                  = 'Grant Nestor',
    author_email            = 'grantnestor@gmail.com',
    keywords                = ['jupyter', 'jupyterlab', 'labextension', 'notebook', 'nbextension'],
    url                     = '',
    include_package_data    = True,
    install_requires        = [
        'jupyterlab>=0.16.0',
        'ipython>=1.0.0'
    ]
)

if __name__ == '__main__':
    build_labextension()
    build_nbextension()
    setup(**setup_args)
    install_labextension()
    install_nbextension()
