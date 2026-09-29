#!/usr/bin/env python3
"""
VARSHA-RA: Regime-Aware AI Post-Processing of Monsoon Rainfall Forecasts
Lightweight Development & API Server

Serves static web files (HTML, CSS, JS) and handles /api/v1 REST endpoints.
Includes CORS headers, proper MIME types, and JSON responses.
"""

import http.server
import socketserver
import os
import sys
import json
import urllib.parse

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

# Standard MIME types
MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".mjs": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon"
}

class VarshaServerHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable CORS and caching headers suitable for development
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        # Handle API endpoints
        if path.startswith("/api/v1/"):
            endpoint = path[len("/api/v1/"):]
            self.handle_api(endpoint, urllib.parse.parse_qs(parsed.query))
            return

        # Fallback to standard static file serving
        return super().do_GET()

    def handle_api(self, endpoint, params):
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.end_headers()

        response = {
            "status": "success",
            "server": "VARSHA-RA-API/v2.4",
            "mode": "operational_demo",
            "endpoint": endpoint,
            "disclaimer": "DEMO DATA / ILLUSTRATIVE - Decision-support indicator, not official warning.",
            "data": {
                "message": f"Endpoint '{endpoint}' served by VARSHA-RA Python backend",
                "timestamp": "2024-08-14T00:00:00Z"
            }
        }
        self.wfile.write(json.dumps(response).encode("utf-8"))

def run():
    # Allow port reuse
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), VarshaServerHandler) as httpd:
        print(f"=== VARSHA-RA Web Application & API Server ===")
        print(f"Running at: http://localhost:{PORT}")
        print(f"Serving from directory: {DIRECTORY}")
        print(f"Press Ctrl+C to terminate.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")

if __name__ == "__main__":
    run()
