from flask import Flask, jsonify, request
from flask_cors import CORS

from scanner import scan_wifi_networks
from parser import parse_networks
from analyzer import analyze_networks
from history import save_scan
from llm_assistant import generate_ai_report


app = Flask(__name__)
CORS(app)


@app.route('/scan', methods=['GET'])
def scan():
    raw_networks = scan_wifi_networks()

    parsed_networks = parse_networks(raw_networks)

    analyzed_networks = analyze_networks(parsed_networks)

    save_scan(analyzed_networks)

    return jsonify(analyzed_networks)


@app.route('/ai-report', methods=['POST'])
def ai_report():
    networks = request.get_json()

    if not networks:
        return jsonify({
            "networks": [],
            "overall_summary": "No network data received."
        }), 400

    report = generate_ai_report(networks)

    return jsonify(report)


if __name__ == '__main__':
    app.run(debug=True)