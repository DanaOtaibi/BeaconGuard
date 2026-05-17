import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

type Network = {
  ssid: string;
  signal: number;
  auth?: string;
  authentication?: string;
  encryption: string;
};

export function ScanningState() {
  const [discoveredNetworks, setDiscoveredNetworks] = useState<Network[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function scanNetworks() {
      try {
        const response = await fetch('http://127.0.0.1:5000/scan');
        const data = await response.json();

        const networks: Network[] = Array.isArray(data)
          ? data
          : data.networks || [];

        setDiscoveredNetworks(networks);
      } catch (error) {
        console.error('Failed to scan networks:', error);
        setDiscoveredNetworks([]);
      } finally {
        setLoading(false);
      }
    }

    scanNetworks();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-semibold text-[#1f2937] mb-2">
          Scanning Networks
        </h2>
        <p className="text-[#6b7280]">
          {loading ? 'Analyzing nearby Wi-Fi signals...' : 'Scan completed'}
        </p>
      </div>

      <div className="flex justify-center mb-12">
        <div className="relative w-64 h-64">
          <motion.div
            className="absolute inset-0 border-2 border-[#0c7c84] rounded-full opacity-20"
            animate={{ scale: [1, 1.5], opacity: [0.2, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          />

          <motion.div
            className="absolute inset-0 border-2 border-[#0a6d73] rounded-full opacity-30"
            animate={{ scale: [1, 1.3], opacity: [0.3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
          />

          <motion.div
            className="absolute inset-0 border-2 border-[#0c7c84] rounded-full opacity-40"
            animate={{ scale: [1, 1.2], opacity: [0.4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.6 }}
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#0c7c84] to-[#0a6d73] rounded-full shadow-lg shadow-teal-500/30 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="2" fill="white" />
                <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="1.5" opacity="0.6" />
              </svg>
            </div>
          </div>

          {loading && (
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute top-0 left-1/2 w-1 h-32 bg-gradient-to-b from-[#0c7c84] to-transparent origin-bottom -translate-x-1/2" />
            </motion.div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
        <div className="p-6 border-b border-[#e5e7eb]">
          <h3 className="font-semibold text-[#1f2937]">
            Discovered Networks ({discoveredNetworks.length})
          </h3>
        </div>

        <div className="divide-y divide-[#e5e7eb] max-h-80 overflow-y-auto">
          {!loading && discoveredNetworks.length === 0 && (
            <div className="p-6 text-center text-[#6b7280]">
              No networks found. Make sure the backend is running.
            </div>
          )}

          {discoveredNetworks.map((network, index) => {
            const auth = network.auth || network.authentication || 'Unknown';

            return (
              <motion.div
                key={`${network.ssid}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 hover:bg-[#fafbfc] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#1f2937]">
                      {network.ssid || 'Hidden Network'}
                    </p>

                    <p className="text-sm text-[#6b7280]">
                      {auth} • {network.encryption || 'Unknown'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[#6b7280]">
                      {network.signal}%
                    </span>

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
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}