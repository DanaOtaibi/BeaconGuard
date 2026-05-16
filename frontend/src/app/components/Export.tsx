import { useState } from 'react';
import { Download, FileText, CheckCircle2, FileType } from 'lucide-react';
import { jsPDF } from 'jspdf';

function loadNetworks() {
  const saved = JSON.parse(localStorage.getItem('beaconguardNetworks') || '[]');

  return saved.map((network: any) => ({
    ssid: network.ssid || 'Hidden Network',
    signal: network.signal ?? 0,
    auth: network.authentication || 'Unknown',
    encryption: network.encryption || 'Unknown',
    bssid: network.bssid || 'Unknown',
    risk: network.risk_level || 'Unknown',
  }));
}

export function Export() {
  const [exportedCSV, setExportedCSV] = useState(false);
  const [exportedPDF, setExportedPDF] = useState(false);
  const mockNetworks = loadNetworks();

  const handleExportCSV = () => {
    const csvContent = [
      ['SSID', 'Signal (dBm)', 'Authentication', 'Encryption', 'BSSID', 'Risk Level'].join(','),
      ...mockNetworks.map(network =>
        [network.ssid, network.signal, network.auth, network.encryption, network.bssid, network.risk].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `beaconguard-scan-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    setExportedCSV(true);
    setTimeout(() => setExportedCSV(false), 3000);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFontSize(20);
    doc.text('BeaconGuard Security Report', 20, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 28);
    doc.text(`Total Networks: ${mockNetworks.length}`, 20, 34);

    const highRisk = mockNetworks.filter(n => n.risk === 'High').length;
    const mediumRisk = mockNetworks.filter(n => n.risk === 'Medium').length;
    const lowRisk = mockNetworks.filter(n => n.risk === 'Low').length;

    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.text('Risk Summary', 20, 45);
    doc.setFontSize(10);
    doc.setTextColor(220, 38, 38);
    doc.text(`High Risk: ${highRisk}`, 25, 52);
    doc.setTextColor(234, 179, 8);
    doc.text(`Medium Risk: ${mediumRisk}`, 25, 58);
    doc.setTextColor(22, 163, 74);
    doc.text(`Low Risk: ${lowRisk}`, 25, 64);

    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.text('Detected Networks', 20, 75);

    let yPos = 85;
    doc.setFontSize(9);

    mockNetworks.forEach((network, index) => {
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = 20;
      }

      doc.setTextColor(0);
      doc.setFontSize(10);
      doc.text(`${index + 1}. ${network.ssid}`, 20, yPos);

      yPos += 6;
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(`BSSID: ${network.bssid}`, 25, yPos);

      yPos += 5;
      doc.text(`Signal: ${network.signal} dBm | Auth: ${network.auth} | Encryption: ${network.encryption}`, 25, yPos);

      yPos += 5;
      const riskColor = network.risk === 'High' ? [220, 38, 38] : network.risk === 'Medium' ? [234, 179, 8] : [22, 163, 74];
      doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
      doc.text(`Risk Level: ${network.risk}`, 25, yPos);

      yPos += 10;
    });

    doc.save(`beaconguard-scan-${new Date().toISOString().split('T')[0]}.pdf`);

    setExportedPDF(true);
    setTimeout(() => setExportedPDF(false), 3000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-[#1f2937] mb-2">Export Results</h2>
        <p className="text-[#6b7280]">Download your scan results as CSV</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-[#e6f7f8] rounded-lg flex items-center justify-center">
              <FileText className="text-[#0c7c84]" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-[#1f2937] mb-1">CSV Export</h3>
              <p className="text-sm text-[#6b7280]">Export all network scan data to CSV format</p>
            </div>
          </div>

          <div className="bg-[#fafbfc] rounded-lg p-4 mb-6 border border-[#e5e7eb]">
            <p className="text-xs text-[#6b7280] mb-2">Export includes:</p>
            <ul className="space-y-1">
              {['SSID', 'Signal Strength (dBm)', 'Authentication Type', 'Encryption Method', 'BSSID', 'Risk Level'].map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-[#1f2937]">
                  <CheckCircle2 className="text-[#0c7c84]" size={16} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={handleExportCSV}
            disabled={exportedCSV}
            className={`w-full px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              exportedCSV
                ? 'bg-[#dcfce7] text-[#16a34a] cursor-default'
                : 'bg-gradient-to-r from-[#0c7c84] to-[#0a6d73] text-white shadow-lg shadow-teal-500/20 hover:shadow-xl hover:shadow-teal-500/30'
            }`}
          >
            {exportedCSV ? (
              <>
                <CheckCircle2 size={20} />
                Downloaded Successfully
              </>
            ) : (
              <>
                <Download size={20} />
                Download CSV
              </>
            )}
          </button>
        </div>

        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-[#e6f7f8] rounded-lg flex items-center justify-center">
              <FileType className="text-[#0c7c84]" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-[#1f2937] mb-1">PDF Report</h3>
              <p className="text-sm text-[#6b7280]">Generate formatted security report as PDF</p>
            </div>
          </div>

          <div className="bg-[#fafbfc] rounded-lg p-4 mb-6 border border-[#e5e7eb]">
            <p className="text-xs text-[#6b7280] mb-2">Export includes:</p>
            <ul className="space-y-1">
              {['SSID', 'Signal Strength (dBm)', 'Authentication Type', 'Encryption Method', 'BSSID', 'Risk Level'].map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-[#1f2937]">
                  <CheckCircle2 className="text-[#0c7c84]" size={16} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={handleExportPDF}
            disabled={exportedPDF}
            className={`w-full px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              exportedPDF
                ? 'bg-[#dcfce7] text-[#16a34a] cursor-default'
                : 'bg-gradient-to-r from-[#0c7c84] to-[#0a6d73] text-white shadow-lg shadow-teal-500/20 hover:shadow-xl hover:shadow-teal-500/30'
            }`}
          >
            {exportedPDF ? (
              <>
                <CheckCircle2 size={20} />
                Downloaded Successfully
              </>
            ) : (
              <>
                <Download size={20} />
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-6 bg-[#fffbeb] border border-[#fde68a] rounded-xl p-4">
        <p className="text-sm text-[#92400e]">
          <strong>Note:</strong> These files contain sensitive network information. Store them securely and do not share publicly.
        </p>
      </div>

      <div className="mt-6 bg-white rounded-xl border border-[#e5e7eb] p-6">
          <h3 className="font-semibold text-[#1f2937] mb-4">Export Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#6b7280] mb-1">Total Networks</p>
              <p className="text-2xl font-semibold text-[#1f2937]">{mockNetworks.length}</p>
            </div>
            <div>
              <p className="text-xs text-[#6b7280] mb-1">High Risk</p>
              <p className="text-2xl font-semibold text-[#dc2626]">
                {mockNetworks.filter(n => n.risk === 'High').length}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6b7280] mb-1">Medium Risk</p>
              <p className="text-2xl font-semibold text-[#eab308]">
                {mockNetworks.filter(n => n.risk === 'Medium').length}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6b7280] mb-1">Low Risk</p>
              <p className="text-2xl font-semibold text-[#16a34a]">
                {mockNetworks.filter(n => n.risk === 'Low').length}
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}
