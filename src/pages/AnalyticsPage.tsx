import React, { useState, useEffect } from 'react';
import { BarChart3, RefreshCw } from 'lucide-react';
import { AnalyticsDashboard } from '../components/analytics/AnalyticsDashboard';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { AnalyticsData } from '../types';

export const AnalyticsPage: React.FC = () => {
  const { activeWorkspace } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    if (!activeWorkspace) return;
    setIsLoading(true);
    try {
      const res = await api.analytics.get(activeWorkspace.slug);
      setData(res);
    } catch (err) {
      console.error('Failed to load analytics', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeWorkspace]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#84CC16]" />
            <h1 className="text-lg font-bold text-white tracking-tight">Workspace Analytics</h1>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Calculated from real application data: delivery velocity, status ratio, and workload
          </p>
        </div>

        <button
          onClick={loadData}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs text-gray-300 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <AnalyticsDashboard data={data} isLoading={isLoading} />
    </div>
  );
};
