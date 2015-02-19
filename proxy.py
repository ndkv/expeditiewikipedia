#! /usr/bin/env python

'''
AJAX proxy

Serve HTTP pages.  Allow an AJAX script to access a 3rd party site.


Example using the GWT JSON sample application.

1) Modify JSON source code.
    $ cd gwt-linux-1.4.62/samples/JSON/src/com/google/gwt/sample/json/client
    Edit JSON.java

    Change this line:
        private static final String DEFAULT_SEARCH_URL = "search-results.js";
    to this:
        private static final String DEFAULT_SEARCH_URL = "http://localhost:8080/__ajaxproxy/http://api.search.yahoo.com/ImageSearchService/V1/imageSearch?appid=YahooDemo&query=potato&results=2&output=json";

2) Compile the JSON code as usual.
    $ cd gwt-linux-1.4.62/samples/JSON
    $ JSON-compile

3) Start this server.
    $ cd gwt-linux-1.4.62/samples/JSON/www/com.google.gwt.sample.json.JSON
    $ proxy.py .  # Serve files from current directory.

3) Access the app in your browser using this URL.
    http://localhost:8080/JSON.html

4) Presss the Search button to access JSON data from yahoo site.


Based on code from http://effbot.org/librarybook/simplehttpserver.htm

'''

import SocketServer
import SimpleHTTPServer
import urllib

PORT = 8000

class Proxy(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Is this a special request to /__ajaxproxy/
        prefix = '/__ajaxproxy/'
        if self.path.startswith(prefix):
            # Strip off the prefix.
            newPath = self.path.lstrip(prefix)
            print "GET remote: ", newPath
            try:
                self.copyfile(urllib.urlopen(newPath), self.wfile)
            except IOError, e:
                print "ERROR:   ", e
        else:
            SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)
        
SocketServer.ThreadingTCPServer.allow_reuse_address = True
httpd = SocketServer.ThreadingTCPServer(('', PORT), Proxy)
print "serving at port", PORT
httpd.serve_forever()
