def assess_risk(network):
    auth = network.get("authentication", "").lower()
    enc = network.get("encryption", "").lower()
    ssid = network.get("ssid", "").lower()

    public_keywords = ["free", "guest", "cafe", "public", "wifi"]

    if "open" in auth:
        if any(word in ssid for word in public_keywords):
            return (
                "High",
                90,
                "Open public network detected. Avoid connecting unless necessary and use a VPN."
            )

        return (
            "High",
            85,
            "Open network detected. Avoid sending sensitive information."
        )

    if "wep" in auth or "wep" in enc:
        return (
            "High",
            85,
            "WEP is outdated and insecure. Avoid using this network."
        )

    if "wpa3" in auth:
        return (
            "Low",
            15,
            "Strong Wi-Fi protection detected."
        )

    if "wpa2" in auth:
        return (
            "Medium",
            35,
            "Generally secure, but WPA3 is preferred when available."
        )

    if "wpa" in auth:
        return (
            "Medium",
            60,
            "Older Wi-Fi protection detected. WPA2 or WPA3 is recommended."
        )

    return (
        "Unknown",
        50,
        "Security type could not be fully determined."
    )


def analyze_networks(networks):
    analyzed = []

    for network in networks:
        risk_level, risk_score, recommendation = assess_risk(network)

        analyzed_network = network.copy()
        analyzed_network["risk_level"] = risk_level
        analyzed_network["risk_score"] = risk_score
        analyzed_network["recommendation"] = recommendation

        analyzed.append(analyzed_network)

    return analyzed