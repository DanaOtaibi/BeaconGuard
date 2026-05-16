import re


def parse_networks(raw_outputs):
    networks = []

    for raw_output in raw_outputs:
        lines = raw_output.split("\n")

        current = None

        for line in lines:
            line = line.strip()

            if re.match(r"^SSID\s+\d+\s*:", line) and "BSSID" not in line:
                if current:
                    networks.append(current)

                ssid = line.split(":", 1)[1].strip()

                current = {
                    "ssid": ssid if ssid else "Hidden Network",
                    "authentication": "Unknown",
                    "encryption": "Unknown",
                    "signal": 0,
                    "channel": "Unknown",
                    "bssid": "Unknown",
                }

            elif current:
                if line.startswith("Authentication"):
                    current["authentication"] = line.split(":", 1)[1].strip()

                elif line.startswith("Encryption"):
                    current["encryption"] = line.split(":", 1)[1].strip()

                elif line.startswith("Signal"):
                    signal_str = line.split(":", 1)[1].strip().replace("%", "")

                    try:
                        current["signal"] = int(signal_str)
                    except:
                        current["signal"] = 0

                elif line.startswith("Channel"):
                    current["channel"] = line.split(":", 1)[1].strip()

                elif re.match(r"^BSSID\s+\d+\s*:", line):
                    current["bssid"] = line.split(":", 1)[1].strip()

        if current:
            networks.append(current)

    return networks