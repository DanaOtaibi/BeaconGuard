import subprocess
import time
import platform


def scan_with_netsh():
    result = subprocess.run(
        ["netsh", "wlan", "show", "networks", "mode=bssid"],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="ignore"
    )

    if result.returncode != 0:
        return ""

    return result.stdout


def scan_with_pywifi():
    try:
        import pywifi

        wifi = pywifi.PyWiFi()
        interfaces = wifi.interfaces()

        if not interfaces:
            return ""

        iface = interfaces[0]

        iface.scan()
        time.sleep(5)

        results = iface.scan_results()

        output = ""

        for index, network in enumerate(results, start=1):
            ssid = network.ssid or "Hidden Network"
            bssid = network.bssid or ""
            signal = min(max(2 * (network.signal + 100), 0), 100)

            output += f"SSID {index} : {ssid}\n"
            output += "    Network type            : Infrastructure\n"
            output += "    Authentication          : Unknown\n"
            output += "    Encryption              : Unknown\n"
            output += f"    BSSID 1                 : {bssid}\n"
            output += f"         Signal             : {signal}%\n\n"

        return output

    except Exception as e:
        print(f"pywifi scan failed: {e}")
        return ""


def count_ssids(output_text):
    return sum(
        1 for line in output_text.splitlines()
        if line.strip().startswith("SSID ")
    )


def scan_wifi_networks():
    if platform.system() != "Windows":
        print("This scanner currently supports Windows only.")
        return ""

    netsh_output = scan_with_netsh()
    netsh_count = count_ssids(netsh_output)

    if netsh_count > 1:
        return netsh_output

    print("netsh returned limited results. Trying pywifi scan...")

    pywifi_output = scan_with_pywifi()
    pywifi_count = count_ssids(pywifi_output)

    if pywifi_count > netsh_count:
        return pywifi_output

    return netsh_output