import http.server
import socketserver
import sys

# Port set to 8000, URL would be http://localhost:8000
PORT = 8000
strPORT = str(PORT)

Handler = http.server.SimpleHTTPRequestHandler

httpd = socketserver.TCPServer(("", PORT), Handler)

# Success messsage and direction to how to navigate to the webpage
print("\n" + "SUCCESSFULLY CONNECTED!")
print("serving at port " + strPORT
       + ", access the page at: http://localhost:8000")

# Comes after print statement, used print the statement on Git/CMD
sys.stdout.flush()

# Server runs forever
httpd.serve_forever()
