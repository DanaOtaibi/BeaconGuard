import subprocess
import time


def scan_wifi_networks(scan_count=5, delay=2):
    all_outputs = []

    for _ in range(scan_count):
        command = ["netsh", "wlan", "show", "networks", "mode=bssid"]

        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="ignore"
        )

        all_outputs.append(result.stdout)
        time.sleep(delay)

    return all_outputs