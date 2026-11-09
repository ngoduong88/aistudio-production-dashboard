import React, { useState, useMemo } from 'react';
import { Download, Search, TrendingUp, DollarSign, Activity, ShoppingCart, ArrowUpDown } from 'lucide-react';
import { MetricPoint } from '../../types';

const INITIAL_DATA: Array<MetricPoint & { region: string; status: 'Operational' | 'Optimizing' | 'High Load' }> = [
  { date: '2026-10-01', revenue: 42100, orders: 382, latencyMs: 24, region: 'North America', status: 'Operational' },
  { date: '2026-10-08', revenue: 48900, orders: 415, latencyMs: 26, region: 'Europe West', status: 'Operational' },
  { date: '2026-10-15', revenue: 53200, orders: 468, latencyMs: 31, region: 'Asia Pacific', status: 'Optimizing' },
  { date: '2026-10-22', revenue: 61800, orders: 512, latencyMs: 28, region: 'North America', status: 'Operational' },
  { date: '2026-10-29', revenue: 67400, orders: 580, latencyMs: 35, region: 'Europe West', status: 'Optimizing' },
  { date: '2026-11-05', revenue: 74200, orders: 640, latencyMs: 29, region: 'Global Edge', status: 'Operational' },
];

export const AnalyticsDemo: React.FC = () => {
  const [data, setData] = useState(INITIAL_DATA);
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [sortField, setSortField] = useState<'revenue' | 'orders' | 'latencyMs'>('revenue');
  const [sortAsc, setSortAsc] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const filteredData = useMemo(() => {
    return data
      .filter((item) => {
        const matchesSearch = item.date.includes(search) || item.region.toLowerCase().includes(search.toLowerCase());
        const matchesRegion = selectedRegion === 'All' || item.region === selectedRegion;
        return matchesSearch && matchesRegion;
      })
      .sort((a, b) => {
        const diff = a[sortField] - b[sortField];
        return sortAsc ? diff : -diff;
      });
  }, [data, search, selectedRegion, sortField, sortAsc]);

  const kpis = useMemo(() => {
    const totalRev = filteredData.reduce((acc, curr) => acc + curr.revenue, 0);
    const totalOrders = filteredData.reduce((acc, curr) => acc + curr.orders, 0);
    const avgLatency = filteredData.length ? Math.round(filteredData.reduce((acc, curr) => acc + curr.latencyMs, 0) / filteredData.length) : 0;
    const aov = totalOrders > 0 ? Math.round(totalRev / totalOrders) : 0;
    return { totalRev, totalOrders, avgLatency, aov };
  }, [filteredData]);

  const exportCSV = () => {
    const headers = 'Date,Region,Revenue,Orders,LatencyMs,Status\n';
    const rows = filteredData.map((d) => `${d.date},${d.region},${d.revenue},${d.orders},${d.latencyMs},${d.status}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics_export_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const addSimulatedDay = () => {
    const last = data[data.length - 1];
    const nextDate = new Date(new Date(last.date).getTime() + 7 * 86400000).toISOString().slice(0, 10);
    const revDelta = Math.floor(Math.random() * 8000) - 2000;
    const orderDelta = Math.floor(Math.random() * 60) - 10;
    const latDelta = Math.floor(Math.random() * 8) - 3;
    const regions = ['North America', 'Europe West', 'Asia Pacific', 'Global Edge'];

    const newRecord = {
      date: nextDate,
      revenue: Math.max(30000, last.revenue + revDelta),
      orders: Math.max(200, last.orders + orderDelta),
      latencyMs: Math.max(18, Math.min(60, last.latencyMs + latDelta)),
      region: regions[Math.floor(Math.random() * regions.length)],
      status: 'Operational' as const,
    };
    setData((prev) => [...prev, newRecord]);
  };

  // SVG Chart Dimensions
  const chartHeight = 160;
  const chartWidth = 500;
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 80000);
  const minRevenue = 30000;

  const points = data.map((d, index) => {
    const x = (index / (data.length - 1 || 1)) * (chartWidth - 40) + 20;
    const y = chartHeight - ((d.revenue - minRevenue) / (maxRevenue - minRevenue)) * (chartHeight - 40) - 20;
    return { x, y, ...d };
  });

  const svgPath = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
  const areaPath = `${svgPath} L ${points[points.length - 1]?.x || 0} ${chartHeight - 10} L ${points[0]?.x || 0} ${chartHeight - 10} Z`;

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by date or region..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="All">All Regions</option>
            <option value="North America">North America</option>
            <option value="Europe West">Europe West</option>
            <option value="Asia Pacific">Asia Pacific</option>
            <option value="Global Edge">Global Edge</option>
          </select>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={addSimulatedDay}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            + Append Data Point
          </button>
          <button
            type="button"
            onClick={exportCSV}
            className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-medium">Aggregated Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            ${kpis.totalRev.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+18.4% vs previous window</span>
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-medium">Total Orders</span>
            <ShoppingCart className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {kpis.totalOrders.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Verified checkout transactions</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-medium">Average Order Value</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            ${kpis.aov}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Net gross basket size</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-medium">P95 Service Latency</span>
            <Activity className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {kpis.avgLatency}ms
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">SLA target &lt; 50ms</p>
        </div>
      </div>

      {/* Interactive SVG Chart */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-200">Revenue Progression Velocity</span>
          <span className="text-slate-500 dark:text-slate-400 font-mono tabular-nums">
            {hoveredPoint !== null ? `${data[hoveredPoint].date}: $${data[hoveredPoint].revenue.toLocaleString()}` : 'Hover points to inspect'}
          </span>
        </div>
        <div className="relative w-full h-40 overflow-hidden">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* Grid horizontal hairlines */}
            <line x1="0" y1="20" x2={chartWidth} y2="20" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />
            <line x1="0" y1="80" x2={chartWidth} y2="80" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />
            <line x1="0" y1="140" x2={chartWidth} y2="140" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />

            {/* Gradient area */}
            <path d={areaPath} fill="url(#revenueGradient)" />
            {/* Trend line */}
            <path d={svgPath} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Points */}
            {points.map((p, idx) => (
              <g key={idx} onMouseEnter={() => setHoveredPoint(idx)} onMouseLeave={() => setHoveredPoint(null)} className="cursor-pointer">
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={hoveredPoint === idx ? 6 : 4}
                  className="fill-white dark:fill-slate-900 stroke-blue-600 dark:stroke-blue-400 stroke-2 transition-all"
                />
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Tabular Data Grid */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Cluster Region</th>
                <th
                  onClick={() => {
                    setSortField('revenue');
                    setSortAsc(!sortAsc);
                  }}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Revenue</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => {
                    setSortField('orders');
                    setSortAsc(!sortAsc);
                  }}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Orders</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => {
                    setSortField('latencyMs');
                    setSortAsc(!sortAsc);
                  }}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Latency</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 font-semibold">Health Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {filteredData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-4 font-mono tabular-nums text-slate-900 dark:text-slate-100">{row.date}</td>
                  <td className="py-2.5 px-4">{row.region}</td>
                  <td className="py-2.5 px-4 font-mono tabular-nums font-medium text-slate-900 dark:text-white">
                    ${row.revenue.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-4 font-mono tabular-nums">{row.orders.toLocaleString()}</td>
                  <td className="py-2.5 px-4 font-mono tabular-nums">{row.latencyMs}ms</td>
                  <td className="py-2.5 px-4">
                    <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
