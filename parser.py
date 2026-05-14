import re


def normalize_signal(signal_text):
    try:
        return int(signal_text.replace("%", "").strip())
    except:
        return None


def parse_networks(output_text):
    networks = []
    current = None

    for line in output_text.splitlines():
        line = line.strip()

        if re.match(r"^SSID\s+\d+\s*:", line):
            if current:
                networks.append(current)

            ssid = line.split(":", 1)[1].strip()

            current = {
                "ssid": ssid,
                "authentication": "",
                "encryption": "",
                "signal": None,
                "bssid": ""
            }

        elif current and line.startswith("Authentication"):
            current["authentication"] = line.split(":", 1)[1].strip()

        elif current and line.startswith("Encryption"):
            current["encryption"] = line.split(":", 1)[1].strip()

        elif current and re.match(r"^BSSID\s+\d+\s*:", line):
            current["bssid"] = line.split(":", 1)[1].strip()

        elif current and line.startswith("Signal"):
            signal_text = line.split(":", 1)[1].strip()
            current["signal"] = normalize_signal(signal_text)

    if current:
        networks.append(current)

    return networks