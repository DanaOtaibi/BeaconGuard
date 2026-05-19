import subprocess
import time

def run_netsh_scan():
    result = subprocess.run(
        ["netsh", "wlan", "show", "networks", "mode=bssid"],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="ignore"
    )

    return result.stdout

def scan_wifi_networks(scan_count=8, delay=2):
    all_outputs = []

    subprocess.run(
        ["netsh", "wlan", "scan"],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="ignore"
    )

    time.sleep(8)

    for _ in range(scan_count):
        output = run_netsh_scan()
        all_outputs.append(output)
        time.sleep(delay)

    return all_outputs



