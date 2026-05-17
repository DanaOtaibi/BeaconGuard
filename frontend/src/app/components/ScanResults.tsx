import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useLocation } from 'react-router';

type Network = {
  ssid: string;
  signal: number;
  authentication?: string;
  auth?: string;
  encryption: string;
  security_level?: string;
  security_score?: number;
  suspicious?: string[];
};

type AIReport = {
  networks: {
    network_name: string;
    security_status: string;
    authentication: string;
    encryption: string;
    signal_quality: string;
    risk_level: string;
    reason: string;
    recommendation: string;
  }[];
  overall_summary: string;
};

export function ScanResults() {
  const location = useLocation();
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [networks, setNetworks] = useState<Network[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiReport, setAiReport] = useState<AIReport | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    const shouldAutoScan = location.search.includes('autoscan=true');

    if (shouldAutoScan) {
      startScan();
      return;
    }

    const savedNetworks = JSON.parse(
      localStorage.getItem('beaconguardNetworks') || '[]'
    );

    setNetworks(savedNetworks);

    if (savedNetworks.length > 0) {
      setSelectedNetwork(savedNetworks[0]);
    }
  }, []);

  const startScan = async () => {
    try {
      setLoading(true);
      setNetworks([]);
      setSelectedNetwork(null);

      let scannedNetworks: Network[] = [];

      for (let attempt = 1; attempt <= 4; attempt++) {
        const response = await fetch('http://127.0.0.1:5000/scan');
        const data = await response.json();

        scannedNetworks = Array.isArray(data)
          ? data
          : data.networks || [];

        if (scannedNetworks.length > 1) {
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, 5000));
      }

      setNetworks(scannedNetworks);

      localStorage.setItem('beaconguardNetworks', JSON.stringify(scannedNetworks));
      localStorage.setItem('beaconguardScanTime', new Date().toLocaleString());

      if (scannedNetworks.length > 0) {
        setSelectedNetwork(scannedNetworks[0]);
      }
    } catch (error) {
      console.error('Failed to load networks:', error);
      setNetworks([]);
      setSelectedNetwork(null);
    } finally {
      setLoading(false);
    }
  };

  const generateAIReport = async () => {
    if (networks.length === 0) {
      setAiReport({
        networks: [],
        overall_summary: 'No networks available to analyze.',
      });
      return;
    }

    try {
      setLoadingAI(true);
      setAiReport(null);

      const response = await fetch('http://127.0.0.1:5000/ai-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(networks),
      });

      const data = await response.json();
      setAiReport(data);
    } catch (error) {
      console.error(error);
      setAiReport({
        networks: [],
        overall_summary: 'Failed to generate AI report.',
      });
    } finally {
      setLoadingAI(false);
    }
  };

  const getSecurityColor = (level?: string) => {
    switch (level) {
      case 'Strong':
      case 'High':
        return 'text-[#16a34a] bg-[#dcfce7]';

      case 'Medium':
        return 'text-[#ca8a04] bg-[#fef9c3]';

      case 'Weak':
      case 'Low':
        return 'text-[#dc2626] bg-[#fee2e2]';

      default:
        return 'text-[#6b7280] bg-[#f3f4f6]';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#1f2937] mb-2">
          Scan Results
        </h1>

        <p className="text-[#6b7280]">
          {loading
            ? 'Scanning nearby Wi-Fi networks...'
            : `${networks.length} networks detected`}
        </p>

        <div className="mt-4">

          <button
            onClick={startScan}
            disabled={loading}
            className="bg-[#0c7c84] text-white px-5 py-3 rounded-lg hover:bg-[#0a6d73] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mr-3"
          >
            {loading ? 'Scanning...' : 'Start Scan'}
          </button>

          <button
            onClick={generateAIReport}
            disabled={loading || loadingAI || networks.length === 0}
            className="bg-[#0c7c84] text-white px-5 py-3 rounded-lg hover:bg-[#0a6d73] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingAI ? 'Generating AI Report...' : 'AI Security Assistant'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-12 text-center">
          <div className="animate-spin w-10 h-10 border-4 border-[#0c7c84] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-[#6b7280]">Analyzing Wi-Fi networks...</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f9fafb] border-b border-[#e5e7eb]">
                  <tr>
                    <th className="text-left p-4 font-medium text-[#374151]">
                      Network
                    </th>
                    <th className="text-left p-4 font-medium text-[#374151]">
                      Security
                    </th>
                    <th className="text-left p-4 font-medium text-[#374151]">
                      Encryption
                    </th>
                    <th className="text-left p-4 font-medium text-[#374151]">
                      Signal
                    </th>
                    <th className="text-left p-4 font-medium text-[#374151]">
                      Security Level
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#e5e7eb]">
                  {networks.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-[#6b7280]">
                        No networks found.
                      </td>
                    </tr>
                  )}

                  {networks.map((network, index) => (
                    <motion.tr
                      key={`${network.ssid}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-[#fafbfc] cursor-pointer transition-colors"
                      onClick={() => setSelectedNetwork(network)}
                    >
                      <td className="p-4">
                        <p className="font-medium text-[#1f2937]">
                          {network.ssid || 'Hidden Network'}
                        </p>
                      </td>

                      <td className="p-4 text-[#374151]">
                        {network.authentication || network.auth || 'Unknown'}
                      </td>

                      <td className="p-4 text-[#374151]">
                        {network.encryption || 'Unknown'}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4].map((bar) => (
                              <div
                                key={bar}
                                className={`w-1 rounded-full ${
                                  network.signal >= 75 && bar <= 4
                                    ? 'h-4 bg-[#16a34a]'
                                    : network.signal >= 50 && bar <= 3
                                    ? 'h-3 bg-[#eab308]'
                                    : bar <= 2
                                    ? 'h-2 bg-[#dc2626]'
                                    : 'h-1 bg-[#e5e7eb]'
                                }`}
                              />
                            ))}
                          </div>

                          <span className="text-sm text-[#6b7280]">
                            {network.signal}%
                          </span>
                        </div>
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getSecurityColor(
                            network.security_level
                          )}`}
                        >
                          {network.security_level || 'Unknown'}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
            <h2 className="text-xl font-semibold text-[#1f2937] mb-6">
              Network Details
            </h2>

            {selectedNetwork ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-[#6b7280] mb-1">SSID</p>
                  <p className="font-medium text-[#1f2937]">
                    {selectedNetwork.ssid || 'Hidden Network'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-[#6b7280] mb-1">
                    Authentication
                  </p>
                  <p className="font-medium text-[#1f2937]">
                    {selectedNetwork.authentication ||
                      selectedNetwork.auth ||
                      'Unknown'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-[#6b7280] mb-1">Encryption</p>
                  <p className="font-medium text-[#1f2937]">
                    {selectedNetwork.encryption || 'Unknown'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-[#6b7280] mb-1">Signal</p>
                  <p className="font-medium text-[#1f2937]">
                    {selectedNetwork.signal}%
                  </p>
                </div>

                <div>
                  <p className="text-sm text-[#6b7280] mb-1">
                    Security Score
                  </p>
                  <p className="font-medium text-[#1f2937]">
                    {selectedNetwork.security_score || 0}/100
                  </p>
                </div>

                {selectedNetwork.suspicious &&
                  selectedNetwork.suspicious.length > 0 && (
                    <div>
                      <p className="text-sm text-[#6b7280] mb-2">
                        Suspicious Indicators
                      </p>

                      <div className="space-y-2">
                        {selectedNetwork.suspicious.map((item, index) => (
                          <div
                            key={index}
                            className="bg-[#fee2e2] text-[#b91c1c] px-3 py-2 rounded-lg text-sm"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            ) : (
              <p className="text-[#6b7280]">
                Select a network to view details.
              </p>
            )}
          </div>
        </div>
      )}

      {aiReport && (
        <div className="mt-8 bg-white rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-[#e5e7eb] bg-[#f9fafb]">
            <h3 className="text-2xl font-semibold text-[#1f2937]">
              AI Security Analysis
            </h3>

            <p className="text-sm text-[#6b7280] mt-1">
              AI-generated Wi-Fi security assessment and recommendations
            </p>
          </div>

          {aiReport.networks.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px]">
                <thead className="bg-[#f3f4f6] border-b border-[#e5e7eb]">
                  <tr>
                    <th className="px-5 py-4 text-left text-sm font-semibold text-[#374151]">
                      Network
                    </th>
                    <th className="px-5 py-4 text-left text-sm font-semibold text-[#374151]">
                      Security
                    </th>
                    <th className="px-5 py-4 text-left text-sm font-semibold text-[#374151]">
                      Authentication
                    </th>
                    <th className="px-5 py-4 text-left text-sm font-semibold text-[#374151]">
                      Encryption
                    </th>
                    <th className="px-5 py-4 text-left text-sm font-semibold text-[#374151]">
                      Signal
                    </th>
                    <th className="px-5 py-4 text-left text-sm font-semibold text-[#374151]">
                      Risk
                    </th>
                    <th className="px-5 py-4 text-left text-sm font-semibold text-[#374151] min-w-[300px]">
                      Analysis
                    </th>
                    <th className="px-5 py-4 text-left text-sm font-semibold text-[#374151] min-w-[340px]">
                      Recommendation
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {aiReport.networks.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-[#e5e7eb] hover:bg-[#fafbfc] transition-colors align-top"
                    >
                      <td className="px-5 py-5 font-semibold text-[#1f2937]">
                        {item.network_name}
                      </td>

                      <td className="px-5 py-5">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                            item.security_status === 'Secure'
                              ? 'bg-[#dcfce7] text-[#166534]'
                              : item.security_status === 'Moderate'
                              ? 'bg-[#fef9c3] text-[#854d0e]'
                              : 'bg-[#fee2e2] text-[#991b1b]'
                          }`}
                        >
                          {item.security_status}
                        </span>
                      </td>

                      <td className="px-5 py-5 text-[#374151]">
                        {item.authentication}
                      </td>

                      <td className="px-5 py-5 text-[#374151]">
                        {item.encryption}
                      </td>

                      <td className="px-5 py-5 text-[#374151]">
                        {item.signal_quality}
                      </td>

                      <td className="px-5 py-5">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                            item.risk_level === 'Low'
                              ? 'bg-[#dcfce7] text-[#166534]'
                              : item.risk_level === 'Medium'
                              ? 'bg-[#fef9c3] text-[#854d0e]'
                              : 'bg-[#fee2e2] text-[#991b1b]'
                          }`}
                        >
                          {item.risk_level}
                        </span>
                      </td>

                      <td className="px-5 py-5 text-[#374151] leading-7">
                        {item.reason}
                      </td>

                      <td className="px-5 py-5 text-[#374151] leading-7">
                        {item.recommendation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="p-6 bg-[#f9fafb] border-t border-[#e5e7eb]">
            <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">
              <h4 className="text-lg font-semibold text-[#1f2937] mb-3">
                Overall Security Summary
              </h4>

              <p className="text-[#374151] leading-8">
                {aiReport.overall_summary}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}