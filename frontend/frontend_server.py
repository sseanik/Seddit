#!/usr/bin/env python3

#
# Run simple frontend server with authentication to stop others accessing your JS
#
# DO NOT CHANGE THIS FILE
#

from http.server import HTTPServer, SimpleHTTPRequestHandler
from random import randint as rand, choice
import base64
import os
import string
import sys

PASSWORD_FILE = 'password.txt'


def main(port=3001):
    passwd = None

    # if you want a hardcoded password leave it in this file

    try:
        with open(PASSWORD_FILE) as f:
            passwd = f.readline().strip()
    except OSError:
        pass

    if passwd is None:
        passwd = gen_passwd()

    k = bytes(f"user:{passwd}", 'utf-8')
    AuthenticationHandler.key = base64.b64encode(k).decode('utf-8')
    httpd, port = create_server(port, AuthenticationHandler)
    print()
    print(f"Frontend server running at:  http://localhost:{port}")
    httpd.serve_forever()


def create_server(port, AuthenticationHandler):
    if port is not None:
        server_address = ('', port)
        httpd = HTTPServer(server_address, AuthenticationHandler)
        return httpd, port
    else:
        for port in range(8080, 8180):
            try:
                server_address = ('', port)
                httpd = HTTPServer(server_address, AuthenticationHandler)
                return httpd, port
            except OSError as e:
                if 'Address in use' in str(e):
                    continue
        print("no port available", file=sys.stderr)
        sys.exit(1)


class AuthenticationHandler(SimpleHTTPRequestHandler):
    # Remove signing in
    '''
    key = ''

    def do_HEAD(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()

    def do_AUTHHEAD(self):
        self.send_response(401)
        self.send_header('WWW-Authenticate', 'Basic realm=\"Secure HTTP Environment\"')
        self.send_header('Content-type', 'text/html')
        self.end_headers()

    def do_GET(self):
        if self.headers.get('Authorization', None) is None:
            self.do_AUTHHEAD()
            self.wfile.write(b'No auth received')
        elif self.headers.get('Authorization', None) == 'Basic ' + self.key:
            SimpleHTTPRequestHandler.do_GET(self)
        else:
            self.do_AUTHHEAD()
            self.wfile.write(self.headers.get('Authorization', None).encode('utf8'))
            self.wfile.write(b'Not authenticated')
    '''


def gen_passwd():
    p = ""
    for _ in range(rand(6, 10)):
        p += choice(string.ascii_lowercase+string.digits)
    return p


BACKEND_URL_JS_FILE = 'src/backend_url.js'

if __name__ == '__main__':
    if not os.path.exists('index.html'):
        print(
            "are you running frontend_server.py in the frontend directory?", file=sys.stderr)
        sys.exit(1)
    backend_url = sys.argv[1] if sys.argv[1:] else 'http://127.0.0.1:5000'
    main()
