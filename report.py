import csv

RED    = "\033[91m"
YELLOW = "\033[93m"
GREEN  = "\033[92m"
BOLD   = "\033[1m"
DIM    = "\033[2m"
RESET  = "\033[0m"

LEVEL_COLORS = {
    "High":    RED,
    "Medium":  YELLOW,
    "Low":     GREEN,
    "Unknown": DIM,
}


def print_report(networks):
    if not networks:
        print("No Wi-Fi networks found.")
        return

    # ── Summary banner ────────────────────────────────────────
    counts = {"High": 0, "Medium": 0, "Low": 0, "Unknown": 0}
    for net in networks:
        counts[net.get("risk_level", "Unknown")] += 1

    print(f"\n{BOLD}Wi-Fi Security Analyzer Report{RESET}")
    print("=" * 60)
    print(
        f"Networks found: {BOLD}{len(networks)}{RESET}   "
        f"{RED}{counts['High']} High{RESET}  "
        f"{YELLOW}{counts['Medium']} Medium{RESET}  "
        f"{GREEN}{counts['Low']} Low{RESET}  "
        f"{DIM}{counts['Unknown']} Unknown{RESET}"
    )
    print("=" * 60)

    # ── Per-network rows ──────────────────────────────────────
    for net in networks:
        level = net.get("risk_level", "Unknown")
        color = LEVEL_COLORS.get(level, DIM)

        print("-" * 60)
        print(f"SSID           : {BOLD}{net.get('ssid')}{RESET}")
        print(f"Authentication : {net.get('authentication')}")
        print(f"Encryption     : {net.get('encryption')}")
        print(f"Signal         : {net.get('signal')}%")
        print(f"BSSID          : {net.get('bssid')}")
        print(f"Risk Level     : {color}{BOLD}{level}{RESET}")
        print(f"Risk Score     : {color}{net.get('risk_score')}/100{RESET}")
        print(f"Recommendation : {net.get('recommendation')}")

    print("-" * 60)


def export_to_csv(networks, filename="wifi_security_report.csv"):
    if not networks:
        print("No data to export.")
        return

    fieldnames = [
        "ssid", "authentication", "encryption",
        "signal", "bssid", "risk_level", "risk_score", "recommendation"
    ]

    with open(filename, "w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(networks)

    print(f"\nReport exported successfully as: {filename}")