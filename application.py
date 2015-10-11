from lister import endpoint


def application(environ, start_response):
    return endpoint.cherrypy.tree(environ, start_response)

if __name__ == "__main__":
    endpoint.run()