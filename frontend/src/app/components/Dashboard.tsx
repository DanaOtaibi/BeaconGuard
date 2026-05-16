import { useState } from 'react';
import { Wifi, Shield, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { ScanningState } from './ScanningState';
import { useNavigate } from 'react-router';

export function Dashboard() {
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();

  const handleStartScan = async () => {
    setIsScanning(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/scan');
      const data = await response.json();

      localStorage.setItem('beaconguardNetworks', JSON.stringify(data));
      localStorage.setItem('beaconguardScanTime', new Date().toLocaleString());

      navigate('/scan-results');
    } catch (error) {
      alert('Scan failed. Make sure the Python API is running.');
    } finally {
      setIsScanning(false);
    }
  };

  const savedNetworks = JSON.parse(localStorage.getItem('beaconguardNetworks') || '[]');

  const high = savedNetworks.filter((n: any) => n.risk_level === 'High').length;
  const medium = savedNetworks.filter((n: any) => n.risk_level === 'Medium').length;
  const low = savedNetworks.filter((n: any) => n.risk_level === 'Low').length;
  const scanTime = localStorage.getItem('beaconguardScanTime');

  if (isScanning) {
    return <ScanningState />;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-[#1f2937] mb-2">Dashboard</h2>
        <p className="text-[#6b7280]">Monitor Wi-Fi security in your area</p>
      </div>

      <div className="mb-8">
        <button
          onClick={handleStartScan}
          className="px-8 py-4 bg-gradient-to-r from-[#0c7c84] to-[#0a6d73] text-white rounded-xl font-medium shadow-lg shadow-teal-500/20 hover:shadow-xl hover:shadow-teal-500/30 transition-all flex items-center gap-3 group"
        >
          <Wifi className="group-hover:scale-110 transition-transform" size={20} />
          Start Network Scan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
          <div className="w-12 h-12 bg-[#e6f7f8] rounded-lg flex items-center justify-center mb-4">
            <Wifi className="text-[#0c7c84]" size={24} />
          </div>
          <p className="text-[#6b7280] text-sm mb-1">Networks Detected</p>
          <p className="text-3xl font-semibold text-[#1f2937]">{savedNetworks.length}</p>
        </div>

        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
          <div className="w-12 h-12 bg-[#fef2f2] rounded-lg flex items-center justify-center mb-4">
            <AlertTriangle className="text-[#dc2626]" size={24} />
          </div>
          <p className="text-[#6b7280] text-sm mb-1">High Risk</p>
          <p className="text-3xl font-semibold text-[#1f2937]">{high}</p>
        </div>

        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
          <div className="w-12 h-12 bg-[#fef9c3] rounded-lg flex items-center justify-center mb-4">
            <Shield className="text-[#eab308]" size={24} />
          </div>
          <p className="text-[#6b7280] text-sm mb-1">Medium Risk</p>
          <p className="text-3xl font-semibold text-[#1f2937]">{medium}</p>
        </div>

        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
          <div className="w-12 h-12 bg-[#f0fdf4] rounded-lg flex items-center justify-center mb-4">
            <CheckCircle2 className="text-[#16a34a]" size={24} />
          </div>
          <p className="text-[#6b7280] text-sm mb-1">Low Risk</p>
          <p className="text-3xl font-semibold text-[#1f2937]">{low}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#e5e7eb]">
        <div className="p-6 border-b border-[#e5e7eb]">
          <h3 className="font-semibold text-[#1f2937] flex items-center gap-2">
            <TrendingUp size={20} className="text-[#0c7c84]" />
            Recent Scan
          </h3>
        </div>

        <div className="p-6">
          {scanTime ? (
            <>
              <p className="font-medium text-[#1f2937] mb-1">{scanTime}</p>
              <p className="text-sm text-[#6b7280]">{savedNetworks.length} networks detected</p>
            </>
          ) : (
            <p className="text-sm text-[#6b7280]">No scan yet. Click Start Network Scan.</p>
          )}
        </div>
      </div>
    </div>
  );
}