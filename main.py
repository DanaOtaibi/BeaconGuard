from scanner import scan_wifi_networks
from parser import parse_networks
from analyzer import analyze_networks
from report import print_report, export_to_csv
from pdf_report import export_to_pdf


def main():
    print("Starting BeaconGuard Wi-Fi Security Analyzer...\n")

    raw_output = scan_wifi_networks()

    if not raw_output:
        print("Could not scan Wi-Fi networks.")
        return

    networks = parse_networks(raw_output)

    if not networks:
        print("No networks were parsed.")
        return

    analyzed_networks = analyze_networks(networks)

    print_report(analyzed_networks)

    export_choice = input("\nExport report? (csv/pdf/both/n): ").lower().strip()

    if export_choice == "csv":
        export_to_csv(analyzed_networks)

    elif export_choice == "pdf":
        export_to_pdf(analyzed_networks)

    elif export_choice == "both":
        export_to_csv(analyzed_networks)
        export_to_pdf(analyzed_networks)

    elif export_choice == "n":
        print("Report was not exported.")

    else:
        print("Invalid option. Report was not exported.")


if __name__ == "__main__":
    main()