# Wi-Fi Security Analyzer

A Python-based Wi-Fi Security Analyzer that scans nearby wireless networks and evaluates visible security properties such as authentication type, encryption method, and signal strength.

## Features

- Scan nearby Wi-Fi networks
- Extract SSID, authentication type, encryption, signal strength, and BSSID
- Classify each network as Low, Medium, High, or Unknown risk
- Provide security recommendations
- Export results to CSV

## Important Note

This project does not hack Wi-Fi networks, capture packets, crack passwords, or perform attacks.  
It only analyzes visible Wi-Fi configuration information provided by the operating system.

## Technologies Used

- Python
- Windows netsh command
- CSV reporting

## How to Run

```bash
python main.py
