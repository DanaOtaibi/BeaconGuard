import { X, Shield, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

type RiskLevel = 'Low' | 'Medium' | 'High' | 'Unknown';

interface Network {
  id: number;
  ssid: string;
  signal: number;
  auth: string;
  encryption: string;
  bssid: string;
  risk: RiskLevel;
  channel: number;
  frequency: string;
}

interface NetworkDetailsModalProps {
  network: Network;
  onClose: () => void;
}

function getRiskRecommendations(network: Network) {
  if (network.auth === 'Open') {
    return {
      icon: AlertTriangle,
      color: 'text-[#dc2626]',
      bgColor: 'bg-[#fee2e2]',
      title: 'High Risk Network',
      description: 'This network has no encryption. All traffic is transmitted in plain text.',
      recommendations: [
        'Avoid connecting to this network for sensitive activities',
        'Do not access banking or financial services',
        'Use a VPN if connection is necessary',
        'Avoid entering passwords or personal information',
      ],
    };
  }

  if (network.auth === 'WPA' || network.encryption === 'TKIP') {
    return {
      icon: AlertTriangle,
      color: 'text-[#dc2626]',
      bgColor: 'bg-[#fee2e2]',
      title: 'High Risk - Outdated Security',
      description: 'This network uses outdated security protocols that are vulnerable to attacks.',
      recommendations: [
        'WPA and TKIP encryption are deprecated',
        'Network administrator should upgrade to WPA2 or WPA3',
        'Avoid connecting if possible',
        'Use VPN for additional security layer',
      ],
    };
  }

  if (network.auth === 'WPA2' && network.encryption === 'AES') {
    return {
      icon: Shield,
      color: 'text-[#eab308]',
      bgColor: 'bg-[#fef9c3]',
      title: 'Medium Risk - Standard Security',
      description: 'This network uses WPA2 with AES, which is adequate but not the latest standard.',
      recommendations: [
        'Generally safe for most use cases',
        'Consider upgrading to WPA3 for enhanced security',
        'Use strong, unique passwords',
        'Keep devices updated with latest security patches',
      ],
    };
  }

  if (network.auth === 'WPA3' || network.auth === 'WPA2-Enterprise') {
    return {
      icon: CheckCircle2,
      color: 'text-[#16a34a]',
      bgColor: 'bg-[#dcfce7]',
      title: 'Low Risk - Strong Security',
      description: 'This network uses modern security protocols and is well protected.',
      recommendations: [
        'Safe for general use and sensitive activities',
        'Continue using strong, unique passwords',
        'Regularly update connected devices',
        'Monitor for unusual network activity',
      ],
    };
  }

  return {
    icon: Info,
    color: 'text-[#6b7280]',
    bgColor: 'bg-[#f3f4f6]',
    title: 'Unknown Security Configuration',
    description: 'Unable to fully assess security posture.',
    recommendations: [
      'Exercise caution when connecting',
      'Verify network authenticity',
      'Consider using VPN',
      'Monitor network behavior',
    ],
  };
}

export function NetworkDetailsModal({ network, onClose }: NetworkDetailsModalProps) {
  const riskInfo = getRiskRecommendations(network);
  const RiskIcon = riskInfo.icon;

  const signalQuality = network.signal > -50 ? 'Excellent' : network.signal > -65 ? 'Good' : network.signal > -75 ? 'Fair' : 'Weak';
  const signalPercentage = Math.min(100, Math.max(0, ((network.signal + 100) / 50) * 100));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-[#e5e7eb] p-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[#1f2937] mb-1">{network.ssid}</h2>
            <p className="text-sm text-[#6b7280]">Network Security Analysis</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#f3f4f6] rounded-lg transition-colors"
          >
            <X size={24} className="text-[#6b7280]" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className={`${riskInfo.bgColor} rounded-xl p-6 border-2 ${riskInfo.color.replace('text-', 'border-')}`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 ${riskInfo.bgColor} rounded-lg flex items-center justify-center`}>
                <RiskIcon className={riskInfo.color} size={24} />
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold ${riskInfo.color} mb-2`}>{riskInfo.title}</h3>
                <p className="text-sm text-[#1f2937] mb-4">{riskInfo.description}</p>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-[#1f2937]">Security Recommendations:</p>
                  <ul className="space-y-2">
                    {riskInfo.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-[#1f2937]">
                        <span className={`w-1.5 h-1.5 rounded-full ${riskInfo.color.replace('text-', 'bg-')} mt-1.5 flex-shrink-0`} />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
            <h3 className="font-semibold text-[#1f2937] mb-4 flex items-center gap-2">
              <Shield className="text-[#0c7c84]" size={20} />
              Technical Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[#6b7280] mb-1">BSSID</p>
                <p className="font-mono text-sm text-[#1f2937]">{network.bssid}</p>
              </div>
              <div>
                <p className="text-xs text-[#6b7280] mb-1">Channel</p>
                <p className="text-sm text-[#1f2937]">{network.channel}</p>
              </div>
              <div>
                <p className="text-xs text-[#6b7280] mb-1">Frequency</p>
                <p className="text-sm text-[#1f2937]">{network.frequency}</p>
              </div>
              <div>
                <p className="text-xs text-[#6b7280] mb-1">Authentication</p>
                <p className="text-sm text-[#1f2937]">{network.auth}</p>
              </div>
              <div>
                <p className="text-xs text-[#6b7280] mb-1">Encryption</p>
                <p className="text-sm text-[#1f2937]">{network.encryption}</p>
              </div>
              <div>
                <p className="text-xs text-[#6b7280] mb-1">Signal Strength</p>
                <p className="text-sm text-[#1f2937]">{network.signal} dBm</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
            <h3 className="font-semibold text-[#1f2937] mb-4">Signal Strength</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6b7280]">Quality: {signalQuality}</span>
                <span className="font-medium text-[#1f2937]">{Math.round(signalPercentage)}%</span>
              </div>
              <div className="h-3 bg-[#f3f4f6] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    signalPercentage > 70
                      ? 'bg-[#16a34a]'
                      : signalPercentage > 40
                      ? 'bg-[#eab308]'
                      : 'bg-[#dc2626]'
                  }`}
                  style={{ width: `${signalPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-[#fafbfc] border-t border-[#e5e7eb] p-6">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-[#0c7c84] text-white rounded-lg font-medium hover:bg-[#0a6d73] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
