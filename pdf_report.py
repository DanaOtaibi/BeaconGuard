from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Table,
    TableStyle,
    Paragraph,
    Spacer
)


def export_to_pdf(networks, filename="beaconguard_report.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=landscape(A4),
        rightMargin=30,
        leftMargin=30,
        topMargin=30,
        bottomMargin=30
    )

    styles = getSampleStyleSheet()
    elements = []

    title = Paragraph("<b>BeaconGuard Wi-Fi Security Assessment Report</b>", styles["Title"])
    subtitle = Paragraph(
        "Passive Wi-Fi risk assessment based on visible network settings.",
        styles["Normal"]
    )

    elements.append(title)
    elements.append(subtitle)
    elements.append(Spacer(1, 0.25 * inch))

    total = len(networks)
    high = sum(1 for n in networks if n.get("risk_level") == "High")
    medium = sum(1 for n in networks if n.get("risk_level") == "Medium")
    low = sum(1 for n in networks if n.get("risk_level") == "Low")
    unknown = sum(1 for n in networks if n.get("risk_level") == "Unknown")

    summary = Paragraph(
        f"<b>Summary:</b> Networks Found: {total} | "
        f"High: {high} | Medium: {medium} | Low: {low} | Unknown: {unknown}",
        styles["Normal"]
    )

    elements.append(summary)
    elements.append(Spacer(1, 0.25 * inch))

    disclaimer = Paragraph(
        "<b>Ethical Note:</b> This tool does not perform packet capture, "
        "password cracking, penetration testing, or unauthorized access. "
        "It only analyzes visible Wi-Fi configuration information.",
        styles["Normal"]
    )

    elements.append(disclaimer)
    elements.append(Spacer(1, 0.3 * inch))

    data = [
        [
            "SSID",
            "Authentication",
            "Encryption",
            "Signal",
            "BSSID",
            "Risk",
            "Score",
            "Recommendation"
        ]
    ]

    for net in networks:
        data.append([
            net.get("ssid", ""),
            net.get("authentication", ""),
            net.get("encryption", ""),
            f"{net.get('signal', '')}%",
            net.get("bssid", ""),
            net.get("risk_level", ""),
            f"{net.get('risk_score', '')}/100",
            net.get("recommendation", "")
        ])

    table = Table(
        data,
        colWidths=[
            1.5 * inch,
            1.3 * inch,
            1.0 * inch,
            0.7 * inch,
            1.4 * inch,
            0.7 * inch,
            0.7 * inch,
            3.0 * inch
        ]
    )

    table_style = TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0f172a")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 9),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 10),

        ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#f8fafc")),
        ("TEXTCOLOR", (0, 1), (-1, -1), colors.HexColor("#111827")),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 1), (-1, -1), 8),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ])

    for row_index, net in enumerate(networks, start=1):
        risk = net.get("risk_level", "")

        if risk == "High":
            table_style.add("TEXTCOLOR", (5, row_index), (5, row_index), colors.red)
            table_style.add("FONTNAME", (5, row_index), (5, row_index), "Helvetica-Bold")

        elif risk == "Medium":
            table_style.add("TEXTCOLOR", (5, row_index), (5, row_index), colors.orange)
            table_style.add("FONTNAME", (5, row_index), (5, row_index), "Helvetica-Bold")

        elif risk == "Low":
            table_style.add("TEXTCOLOR", (5, row_index), (5, row_index), colors.green)
            table_style.add("FONTNAME", (5, row_index), (5, row_index), "Helvetica-Bold")

        else:
            table_style.add("TEXTCOLOR", (5, row_index), (5, row_index), colors.gray)

    table.setStyle(table_style)

    elements.append(table)
    elements.append(Spacer(1, 0.3 * inch))

    methodology = Paragraph(
        "<b>Methodology:</b> Scan → Parse → Analyze → Report. "
        "BeaconGuard extracts SSID, authentication, encryption, signal strength, "
        "and BSSID, then applies rule-based risk scoring.",
        styles["Normal"]
    )

    elements.append(methodology)

    doc.build(elements)

    print(f"PDF report exported successfully as: {filename}")