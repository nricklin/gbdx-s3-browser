"""
Configures and sets up the workflow REST endpoints

"""
import os
import logging
import sys
import json
import cherrypy

class logging_filter(logging.Filter):
    """
    A simple filter for ignoring spammy, low-level logging events in the app
    """

    def filter(self, record):
        return record.module != '_cplogging'


logger = logging.getLogger("workflows")
logger.setLevel(logging.DEBUG)
if len(logger.handlers) < 1:
    ch = logging.StreamHandler(sys.stdout)
    # formatter = logging.Formatter('{"%(levelname)s" : "%(message)s", "file" : "%(module)s", \
    # "line" : "%(lineno)s", "timestamp" : "%(asctime)s%(msecs)dZ"}', "%Y-%m-%dT%H:%M:%S")
    formatter = logging.Formatter('%(asctime)s %(levelname)s %(processName)s %(filename)s %(message)s')
    ch.setFormatter(formatter)
    logger.addHandler(ch)

from controllers import Heartbeat

# Instantiate controllers
heartbeat = Heartbeat()

# Setup route-based dispatcher.
def setup_routes():
    """Sets up REST endpoints"""
    rd = cherrypy.dispatch.RoutesDispatcher()
    rd.mapper.explicit = False

    # heartbeat
    rd.connect('heartbeat', '/login', controller=heartbeat, action='login',
               conditions=dict(method=['POST']))


    return rd

def default_error(status, message, traceback, version):
    return json.dumps({"status": status, "message":message})

# Initialize the application server config
path   = os.path.abspath(os.path.dirname(__file__))
config = {
    '/': {
        'request.dispatch': setup_routes(),
        'tools.db.on': False
    }
}

configglobal = {
    'global': {
        'server.socket_host': "0.0.0.0", 
        'server.socket_port': 8080,
        'error_page.default': default_error
    }
}

config2 = {'/': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': os.path.join(path,'static'),
            'tools.staticdir.index': 'index.html'
    }
}

# Load config and mount the root object:
cherrypy.config.update(configglobal)

cherrypy.tree.mount(None, '/api', config=config)
cherrypy.tree.mount(None, '/', config=config2)
def run():
    # Next two lines do the same thing as quickstart()
    cherrypy.engine.start()
    cherrypy.engine.block()

