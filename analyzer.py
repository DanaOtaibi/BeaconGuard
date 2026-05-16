from collections import defaultdict



def get_signal_quality(signal):
    if signal >= 80:
        return "Excellent"
    elif signal >= 60:
        return "Good"
    elif signal >= 40:
        return "Fair"
    else:
        return "Weak"



def get_security_score(authentication, encryption):
    auth = authentication.upper()
    enc = encryption.upper()

    if "OPEN" in auth:
        return "Dangerous", 10

    if "WEP" in enc:
        return "Critical", 20

    if "WPA3" in auth:
        return "Very Strong", 95

    if "WPA2" in auth and "CCMP" in enc:
        return "Strong", 85

    if "TKIP" in enc:
        return "Medium", 50

    if "WPA" in auth:
        return "Weak", 40

    return "Unknown", 30



def analyze_networks(networks):
    grouped = defaultdict(list)

    for network in networks:
        bssid = network.get("bssid", network.get("ssid"))
        grouped[bssid].append(network)

    analyzed = []

    for bssid, entries in grouped.items():
        latest = entries[-1]

        avg_signal = round(
            sum(entry.get("signal", 0) for entry in entries) / len(entries)
        )

        security_level, security_score = get_security_score(
            latest.get("authentication", ""),
            latest.get("encryption", "")
        )

        suspicious = []

        if latest.get("ssid") == "":
            suspicious.append("Hidden SSID detected")

        if security_level in ["Dangerous", "Critical", "Weak"]:
            suspicious.append("Weak or insecure Wi-Fi security")

        analyzed.append({
            "ssid": latest.get("ssid", "Hidden Network"),
            "bssid": bssid,
            "authentication": latest.get("authentication", "Unknown"),
            "encryption": latest.get("encryption", "Unknown"),
            "signal": avg_signal,
            "quality": get_signal_quality(avg_signal),
            "channel": latest.get("channel", "Unknown"),
            "security_level": security_level,
            "security_score": security_score,
            "suspicious": suspicious,
            "scan_count": len(entries)
        })

    return analyzed