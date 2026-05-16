import { useState } from 'react';
import { Search, Filter, ChevronDown, Signal, Shield } from 'lucide-react';
import { NetworkDetailsModal } from './NetworkDetailsModal';

type RiskLevel = 'Low' | 'Medium' | 'High' | 'Unknown';

interface Network {
  id: number;
  ssid: string;
  signal: number;
  auth: string;
  encryption: string;
  bssid: string;
  risk: RiskLevel;
  channel: string;
  frequency: string;
}

function loadNetworks(): Network[] {
  const saved = JSON.parse(localStorage.getItem('beaconguardNetworks') || '[]');

  return saved.map((network: any, index: number) => ({
    id: index + 1,
    ssid: network.ssid || 'Hidden Network',
    signal: network.signal ?? 0,
    auth: network.authentication || 'Unknown',
    encryption: network.encryption || 'Unknown',
    bssid: network.bssid || 'Unknown',
    risk: network.risk_level || network.security_level || 'Unknown',
    channel: network.channel || 'Unknown',
    frequency: network.frequency || 'Unknown',
  }));
}

function getRiskBadge(risk: RiskLevel | string) {
  const styles: Record<string, string> = {
    Low: 'bg-[#dcfce7] text-[#16a34a] border-[#bbf7d0]',
    Medium: 'bg-[#fef9c3] text-[#eab308] border-[#fde68a]',
    High: 'bg-[#fee2e2] text-[#dc2626] border-[#fecaca]',
    Strong: 'bg-[#dcfce7] text-[#16a34a] border-[#bbf7d0]',
    'Very Strong': 'bg-[#dcfce7] text-[#16a34a] border-[#bbf7d0]',
    Weak: 'bg-[#fee2e2] text-[#dc2626] border-[#fecaca]',
    Dangerous: 'bg-[#fee2e2] text-[#dc2626] border-[#fecaca]',
    Critical: 'bg-[#fee2e2] text-[#dc2626] border-[#fecaca]',
    Unknown: 'bg-[#f3f4f6] text-[#6b7280] border-[#e5e7eb]',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[risk] || styles.Unknown}`}>
      {risk}
    </span>
  );
}

function getSignalBars(signal: number) {
  const bars = [];
  const strength = signal >= 80 ? 4 : signal >= 60 ? 3 : signal >= 40 ? 2 : 1;

  for (let i = 1; i <= 4; i++) {
    bars.push(
      <div
        key={i}
        className={`w-1 rounded-full ${
          i <= strength
            ? i === 4
              ? 'h-4 bg-[#16a34a]'
              : i === 3
              ? 'h-3 bg-[#16a34a]'
              : i === 2
              ? 'h-2 bg-[#eab308]'
              : 'h-1 bg-[#dc2626]'
            : 'h-1 bg-[#e5e7eb]'
        }`}
      />
    );
  }

  return <div className="flex gap-0.5 items-end">{bars}</div>;
}

export function ScanResults() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<RiskLevel | 'All'>('All');
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const networks = loadNetworks();

  const filteredNetworks = networks.filter((network) => {
    const matchesSearch =
      network.ssid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      network.bssid.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterRisk === 'All' || network.risk === filterRisk;

    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#1f2937] mb-2">Scan Results</h2>
          <p className="text-[#6b7280]">{networks.length} networks detected</p>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" size={20} />
            <input
              type="text"
              placeholder="Search by SSID or BSSID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c7c84]"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" size={20} />
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value as RiskLevel | 'All')}
              className="pl-12 pr-10 py-3 bg-white border border-[#e5e7eb] rounded-lg appearance-none cursor-pointer min-w-48"
            >
              <option value="All">All Risk Levels</option>
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
              <option value="Unknown">Unknown</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280]" size={20} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#fafbfc] border-b border-[#e5e7eb]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6b7280] uppercase">SSID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6b7280] uppercase">Signal</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6b7280] uppercase">Authentication</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6b7280] uppercase">Encryption</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6b7280] uppercase">BSSID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6b7280] uppercase">Risk Level</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#e5e7eb]">
              {filteredNetworks.map((network) => (
                <tr
                  key={network.id}
                  onClick={() => setSelectedNetwork(network)}
                  className="hover:bg-[#fafbfc] cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Shield className="text-[#0c7c84]" size={16} />
                      <span className="font-medium text-[#1f2937]">{network.ssid}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {getSignalBars(network.signal)}
                      <span className="text-sm text-[#6b7280]">{network.signal}%</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-[#1f2937]">{network.auth}</td>
                  <td className="px-6 py-4 text-sm text-[#1f2937]">{network.encryption}</td>
                  <td className="px-6 py-4 text-sm font-mono text-[#6b7280]">{network.bssid}</td>
                  <td className="px-6 py-4">{getRiskBadge(network.risk)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredNetworks.length === 0 && (
            <div className="p-12 text-center">
              <Signal className="mx-auto mb-4 text-[#e5e7eb]" size={48} />
              <p className="text-[#6b7280]">No networks found matching your criteria</p>
            </div>
          )}
        </div>
      </div>

      {selectedNetwork && (
        <NetworkDetailsModal
          network={selectedNetwork}
          onClose={() => setSelectedNetwork(null)}
        />
      )}
    </>
  );
}