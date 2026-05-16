from flask import Flask, jsonify
from flask_cors import CORS

from scanner import scan_wifi_networks
from parser import parse_networks
from analyzer import analyze_networks

app = Flask(__name__)
CORS(app)

@app.route("/scan", methods=["GET"])
def scan():
    raw_output = scan_wifi_networks()
    networks = parse_networks(raw_output)
    analyzed = analyze_networks(networks)
    return jsonify(analyzed)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "BeaconGuard API is running"})

if __name__ == "__main__":
    app.run(debug=True)