"""
Created on Feb 20, 2014
An endpoint for testing always returns 200 and echoes back the body (if any) 
"""
import cherrypy
import requests
import json
import os

GBDX_API_KEY = os.getenv('GBDX_API_KEY')
TOKEN_URL = os.getenv('TOKEN_URL', 'https://geobigdata.io/auth/v1/oauth/token/')
S3CREDS_URL = os.getenv('S3CREDS_URL', 'https://geobigdata.io/s3creds/v1/prefix')

class Heartbeat(object):
    
    # POST /login
    #@cherrypy.tools.json_out()
    def login(self, username, password, subprefix):
        # cherrypy.request.json
        # Get user token
        headers = {'Authorization': "Basic %s" % GBDX_API_KEY}
        body = {"grant_type":'password', 'username': username, 'password': password}

        r = requests.post(TOKEN_URL, headers=headers, data=body)

        access_token = r.json()['access_token']

        # now hit s3creds with your access token
        headers = {'Authorization': "Bearer %s" % access_token, "Content-Type": "application/json" }
        r = requests.get(S3CREDS_URL+'?duration=37000', headers=headers)

        cookie = cherrypy.response.cookie
        cookie['bucket'] = r.json()['bucket']
        cookie['bucket']['path'] = '/'
        cookie['bucket']['max-age'] = 36000
        cookie['bucket']['version'] = 1

        cookie = cherrypy.response.cookie
        cookie['username'] = username
        cookie['username']['path'] = '/'
        cookie['username']['max-age'] = 36000
        cookie['username']['version'] = 1

        cookie = cherrypy.response.cookie
        cookie['prefix'] = r.json()['prefix']
        cookie['prefix']['path'] = '/'
        cookie['prefix']['max-age'] = 36000
        cookie['prefix']['version'] = 1

        cookie = cherrypy.response.cookie
        cookie['subprefix'] = subprefix
        cookie['subprefix']['path'] = '/'
        cookie['subprefix']['max-age'] = 36000
        cookie['subprefix']['version'] = 1

        cookie = cherrypy.response.cookie
        cookie['S3_secret_key'] = r.json()['S3_secret_key']
        cookie['S3_secret_key']['path'] = '/'
        cookie['S3_secret_key']['max-age'] = 36000
        cookie['S3_secret_key']['version'] = 1

        cookie = cherrypy.response.cookie
        cookie['S3_access_key'] = r.json()['S3_access_key']
        cookie['S3_access_key']['path'] = '/'
        cookie['S3_access_key']['max-age'] = 36000
        cookie['S3_access_key']['version'] = 1

        cookie = cherrypy.response.cookie
        cookie['S3_session_token'] = r.json()['S3_session_token']
        cookie['S3_session_token']['path'] = '/'
        cookie['S3_session_token']['max-age'] = 36000
        cookie['S3_session_token']['version'] = 1

        return """<html>
                  <script type="text/javascript">
                  window.location.href = "../";
                  </script>
                  If you are not redirected, click <a href="../">here.</a>
                  </html>"""

        #raise cherrypy.HTTPRedirect(cherrypy.url().rsplit('/',2)[0] + '/', 302)


    