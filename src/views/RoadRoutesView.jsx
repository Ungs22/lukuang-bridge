import React, { useState } from 'react';
import {
    MapPin, Navigation, TrendingUp, AlertTriangle, MoreHorizontal,
    ChevronRight, Search, BarChart3, Activity, Layers, Edit2, ShieldAlert
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Card } from '../components/UIComponents';
import clsx from 'clsx';

// Mock Data for Routes
const MOCK_ROUTES = [
    { id: 1, name: '文一西路', code: 'R001', length: '12.5km', start: '紫金港立交', end: '绿汀路', health: 88, risk: 'Medium', type: 'Urban', maintenanceStatus: 'Normal' },
    { id: 2, name: '莫干山路', code: 'R002', length: '18.2km', start: '天目山路', end: '绕城高速', health: 76, risk: 'High', type: 'Arterial', maintenanceStatus: 'Urgent' },
    { id: 3, name: '天目山路', code: 'R003', length: '15.0km', start: '环城北路', end: '闲林', health: 92, risk: 'Low', type: 'Expressway', maintenanceStatus: 'Normal' },
    { id: 4, name: '余杭塘路', code: 'R004', length: '10.8km', start: '莫干山路', end: '五常大道', health: 85, risk: 'Low', type: 'Urban', maintenanceStatus: 'Normal' },
    { id: 5, name: '古墩路', code: 'R005', length: '14.3km', start: '天目山路', end: '金家渡', health: 82, risk: 'Medium', type: 'Arterial', maintenanceStatus: 'Pending' },
    { id: 6, name: '教工路', code: 'R006', length: '5.2km', start: '天目山路', end: '余杭塘路', health: 90, risk: 'Low', type: 'Urban', maintenanceStatus: 'Normal' },
    { id: 7, name: '文二路', code: 'R007', length: '8.4km', start: '莫干山路', end: '古墩路', health: 78, risk: 'Medium', type: 'Urban', maintenanceStatus: 'Routine' },
    { id: 8, name: '文三路', code: 'R008', length: '8.1km', start: '莫干山路', end: '古墩路', health: 89, risk: 'Low', type: 'Urban', maintenanceStatus: 'Normal' },
    { id: 9, name: '学院路', code: 'R009', length: '6.5km', start: '天目山路', end: '余杭塘路', health: 84, risk: 'Low', type: 'Urban', maintenanceStatus: 'Normal' },
    { id: 10, name: '体育场路', code: 'R010', length: '7.8km', start: '环城西路', end: '环城东路', health: 75, risk: 'High', type: 'Arterial', maintenanceStatus: 'Urgent' },
    { id: 11, name: '延安路', code: 'R011', length: '3.2km', start: '凤起路', end: '西湖大道', health: 93, risk: 'Low', type: 'Commercial', maintenanceStatus: 'Normal' },
    { id: 12, name: '庆春路', code: 'R012', length: '4.5km', start: '环城西路', end: '秋涛北路', health: 81, risk: 'Medium', type: 'Arterial', maintenanceStatus: 'Pending' },
    { id: 13, name: '凤起路', code: 'R013', length: '4.8km', start: '保俶路', end: '新塘路', health: 87, risk: 'Low', type: 'Arterial', maintenanceStatus: 'Normal' },
    { id: 14, name: '之江路', code: 'R014', length: '22.5km', start: '复兴路', end: '之浦路', health: 86, risk: 'Medium', type: 'Expressway', maintenanceStatus: 'Routine' },
    { id: 15, name: '留石高架', code: 'R015', length: '35.0km', start: '绕城西线', end: '绕城东线', health: 91, risk: 'Low', type: 'Expressway', maintenanceStatus: 'Normal' },
    { id: 16, name: '紫金港路', code: 'R016', length: '12.0km', start: '天目山路', end: '石祥路', health: 79, risk: 'Medium', type: 'Arterial', maintenanceStatus: 'Routine' },
    { id: 17, name: '石祥路', code: 'R017', length: '15.5km', start: '莫干山路', end: '杭行路', health: 72, risk: 'High', type: 'Arterial', maintenanceStatus: 'Urgent' },
];

const MOCK_SEGMENTS = [
    { id: 101, roadId: 1, name: 'K0+000 - K2+000', health: 95, pci: 96, rqi: 94, issues: 0 },
    { id: 102, roadId: 1, name: 'K2+000 - K4+000', health: 82, pci: 85, rqi: 78, issues: 3 },
    { id: 103, roadId: 1, name: 'K4+000 - K6+000', health: 88, pci: 90, rqi: 86, issues: 1 },
    { id: 104, roadId: 1, name: 'K6+000 - K8+000', health: 75, pci: 78, rqi: 72, issues: 5 }, // Poor
    { id: 105, roadId: 1, name: 'K8+000 - K10+000', health: 92, pci: 94, rqi: 90, issues: 0 },
    { id: 106, roadId: 1, name: 'K10+000 - K12+500', health: 89, pci: 91, rqi: 88, issues: 1 },

    // 莫干山路 (High Risk)
    { id: 201, roadId: 2, name: 'K0+000 - K3+000', health: 72, pci: 75, rqi: 68, issues: 8 },
    { id: 202, roadId: 2, name: 'K3+000 - K6+000', health: 68, pci: 70, rqi: 65, issues: 12 },
    { id: 203, roadId: 2, name: 'K6+000 - K9+000', health: 78, pci: 80, rqi: 75, issues: 5 },
    { id: 204, roadId: 2, name: 'K9+000 - K12+000', health: 85, pci: 88, rqi: 82, issues: 2 },
    { id: 205, roadId: 2, name: 'K12+000 - K15+000', health: 80, pci: 82, rqi: 78, issues: 3 },
    { id: 206, roadId: 2, name: 'K15+000 - K18+200', health: 74, pci: 76, rqi: 70, issues: 6 },

    // 天目山路 (Low Risk)
    { id: 301, roadId: 3, name: 'K0+000 - K3+000', health: 94, pci: 95, rqi: 93, issues: 0 },
    { id: 302, roadId: 3, name: 'K3+000 - K6+000', health: 92, pci: 94, rqi: 90, issues: 1 },
    { id: 303, roadId: 3, name: 'K6+000 - K9+000', health: 90, pci: 92, rqi: 88, issues: 1 },
    { id: 304, roadId: 3, name: 'K9+000 - K12+000', health: 96, pci: 98, rqi: 94, issues: 0 },
    { id: 305, roadId: 3, name: 'K12+000 - K15+000', health: 88, pci: 90, rqi: 86, issues: 2 },

    // 余杭塘路 (Low Risk)
    { id: 401, roadId: 4, name: 'K0+000 - K3+000', health: 88, pci: 90, rqi: 86, issues: 1 },
    { id: 402, roadId: 4, name: 'K3+000 - K6+000', health: 82, pci: 84, rqi: 80, issues: 3 },
    { id: 403, roadId: 4, name: 'K6+000 - K9+000', health: 86, pci: 88, rqi: 84, issues: 2 },
    { id: 404, roadId: 4, name: 'K9+000 - K10+800', health: 84, pci: 86, rqi: 82, issues: 2 },

    // 古墩路 (Medium Risk)
    { id: 501, roadId: 5, name: 'K0+000 - K3+000', health: 85, pci: 86, rqi: 84, issues: 2 },
    { id: 502, roadId: 5, name: 'K3+000 - K6+000', health: 78, pci: 80, rqi: 76, issues: 5 },
    { id: 503, roadId: 5, name: 'K6+000 - K9+000', health: 82, pci: 84, rqi: 80, issues: 3 },
    { id: 504, roadId: 5, name: 'K9+000 - K12+000', health: 88, pci: 90, rqi: 86, issues: 1 },
    { id: 505, roadId: 5, name: 'K12+000 - K14+300', health: 76, pci: 78, rqi: 74, issues: 4 },
];

// Mock Trend Data
const healthTrendData = [
    { name: '1月', score: 85 }, { name: '2月', score: 86 }, { name: '3月', score: 84 },
    { name: '4月', score: 88 }, { name: '5月', score: 87 }, { name: '6月', score: 88 }
];

const RoadRoutesView = ({ onNavigate }) => {
    const [selectedRoute, setSelectedRoute] = useState(MOCK_ROUTES[0]);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'

    const filteredRoutes = MOCK_ROUTES.filter(r => r.name.includes(searchTerm));

    // Dynamic Data Calculation
    const currentSegments = MOCK_SEGMENTS.filter(s => s.roadId === selectedRoute.id);

    const avgPCI = Math.round(currentSegments.reduce((acc, s) => acc + s.pci, 0) / currentSegments.length) || 85;
    const totalIssues = currentSegments.reduce((acc, s) => acc + s.issues, 0);


    const getHealthColorClass = (score) => {
        if (score >= 90) return "text-emerald-500";
        if (score >= 80) return "text-blue-500";
        if (score >= 60) return "text-orange-500";
        return "text-red-500";
    };

    const getHealthBgGradient = (score) => {
        if (score >= 90) return "bg-gradient-to-br from-emerald-500 to-teal-600";
        if (score >= 80) return "bg-gradient-to-br from-blue-500 to-indigo-600";
        if (score >= 60) return "bg-gradient-to-br from-orange-400 to-amber-500";
        return "bg-gradient-to-br from-red-500 to-rose-600";
    };

    const getRatingLabel = (score) => {
        if (score >= 90) return '优';
        if (score >= 80) return '良';
        if (score >= 60) return '中';
        return '差';
    };

    // Simulated Trend Data (based on route health)
    const trendData = [
        { name: '1月', score: selectedRoute.health - 2 },
        { name: '2月', score: selectedRoute.health - 1 },
        { name: '3月', score: selectedRoute.health + 1 },
        { name: '4月', score: selectedRoute.health - 3 },
        { name: '5月', score: selectedRoute.health + 2 },
        { name: '6月', score: selectedRoute.health }
    ];

    return (
        <div className="p-6 space-y-6 flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">路线路段管理</h2>
                    <p className="text-slate-500 text-sm mt-1">城市道路资产全生命周期管理与健康监测</p>
                </div>
                <div className="flex space-x-3">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm flex items-center">
                        <Navigation size={16} className="mr-2" />
                        新增路线
                    </button>
                </div>
            </div>

            <div className="flex-1 flex space-x-6 overflow-hidden">
                {/* Left Sidebar: Route List */}
                <Card className="w-1/3 flex flex-col h-full p-0 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="搜索路线名称或编号..."
                                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {filteredRoutes.map(route => (
                            <div
                                key={route.id}
                                onClick={() => setSelectedRoute(route)}
                                className={clsx(
                                    "p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md group",
                                    selectedRoute.id === route.id
                                        ? "bg-blue-50 border-blue-200 shadow-sm"
                                        : "bg-white border-slate-100 hover:border-blue-100"
                                )}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="font-bold text-slate-800 flex items-center">
                                        <span className="w-6 h-6 rounded bg-slate-100 text-slate-500 text-xs flex items-center justify-center mr-2 font-mono">
                                            {route.code.slice(1)}
                                        </span>
                                        {route.name}
                                    </div>
                                    <span className={clsx("text-xs px-2 py-0.5 rounded-full font-medium border",
                                        route.health >= 90 ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                            route.health >= 80 ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                route.health >= 60 ? "bg-orange-50 text-orange-600 border-orange-100" :
                                                    "bg-red-50 text-red-600 border-red-100"
                                    )}>
                                        {route.health}分
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-slate-500">
                                    <div className="flex items-center">
                                        <MapPin size={12} className="mr-1" />
                                        {route.start} <ChevronRight size={10} className="mx-1" /> {route.end}
                                    </div>
                                    <div className="font-mono">{route.length}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Right Content: Route Detail */}
                <div className="flex-1 flex flex-col space-y-6 overflow-y-auto pr-1">
                    {/* Top Stats of Selected Route */}
                    <div className="grid grid-cols-3 gap-4">
                        <Card className={clsx("p-4 flex items-center justify-between text-white border-none shadow-md transition-colors", getHealthBgGradient(selectedRoute.health))}>
                            <div>
                                <div className="text-white/80 text-xs font-medium mb-1">综合健康指数 (RQI)</div>
                                <div className="text-3xl font-bold">{selectedRoute.health}</div>
                                <div className="text-white/80 text-xs mt-1">环比上月 +{Math.abs(selectedRoute.health % 5 / 10)}%</div>
                            </div>
                            <Activity size={40} className="text-white opacity-20" />
                        </Card>
                        <Card className="p-4 flex items-center justify-between">
                            <div>
                                <div className="text-slate-500 text-xs font-medium mb-1">路面状况指数 (PCI)</div>
                                <div className={clsx("text-3xl font-bold", getHealthColorClass(avgPCI))}>{avgPCI}</div>
                                <div className={clsx("text-xs mt-1 font-bold", getHealthColorClass(avgPCI))}>{getRatingLabel(avgPCI)}</div>
                            </div>
                            <Layers size={40} className="text-slate-200" />
                        </Card>
                        <Card className="p-4 flex items-center justify-between">
                            <div>
                                <div className="text-slate-500 text-xs font-medium mb-1">当前存在隐患</div>
                                <div className="text-3xl font-bold text-orange-500">{totalIssues}</div>
                                <div className="text-slate-400 text-xs mt-1">处 (需关注)</div>
                            </div>
                            <ShieldAlert size={40} className="text-orange-100" />
                        </Card>
                    </div>

                    {/* Charts Row */}
                    <div className="flex gap-4 h-96">
                        {/* Trend Chart (65%) */}
                        <Card className="flex-1 min-w-0 flex flex-col h-full">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center shrink-0 h-7">
                                <TrendingUp size={20} className="mr-2 text-blue-500" />
                                健康度趋势分析
                            </h3>
                            <div className="w-full h-[calc(100%-2.75rem)] min-h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                        <YAxis domain={['auto', 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                        <Area type="monotone" dataKey="score" stroke="#3b82f6" fillOpacity={1} fill="url(#colorScore)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        {/* Risk Distribution Pie Chart (35%) */}
                        <Card className="w-1/3 min-w-0 flex flex-col h-full">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center shrink-0 h-7">
                                <Activity size={20} className="mr-2 text-orange-500" />
                                风险等级分布
                            </h3>
                            <div className="w-full h-[calc(100%-2.75rem)] min-h-[200px] relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: '低风险', value: 12, color: '#10b981' },
                                                { name: '中风险', value: 3, color: '#f59e0b' },
                                                { name: '高风险', value: 1, color: '#ef4444' },
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {[
                                                { name: '低风险', value: 12, color: '#10b981' },
                                                { name: '中风险', value: 3, color: '#f59e0b' },
                                                { name: '高风险', value: 1, color: '#ef4444' },
                                            ].map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36} iconSize={10} wrapperStyle={{ fontSize: '12px', bottom: 0 }} />
                                    </PieChart>
                                </ResponsiveContainer>
                                {/* Center Label */}
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none pb-8">
                                    <div className="text-2xl font-bold text-slate-700">16</div>
                                    <div className="text-xs text-slate-400">总路线</div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Segments List */}
                    <Card className="flex-1">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center">
                                <Navigation size={20} className="mr-2 text-indigo-500" />
                                细分路段管理
                            </h3>
                            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">查看GIS地图</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold">
                                    <tr>
                                        <th className="px-4 py-3 rounded-l-lg">路段名称/桩号</th>
                                        <th className="px-4 py-3">PCI (路面)</th>
                                        <th className="px-4 py-3">RQI (平整度)</th>
                                        <th className="px-4 py-3">综合评分</th>
                                        <th className="px-4 py-3">评级</th>
                                        <th className="px-4 py-3 rounded-r-lg text-right">操作</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {currentSegments.length > 0 ? (currentSegments.map(seg => (
                                        <tr key={seg.id} className="hover:bg-slate-50 group transition-colors">
                                            <td className="px-4 py-3 font-medium text-slate-700">{seg.name}</td>
                                            <td className="px-4 py-3">
                                                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${seg.pci}%` }}></div>
                                                </div>
                                                <span className="text-xs text-slate-400 mt-1 block">{seg.pci}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${seg.rqi}%` }}></div>
                                                </div>
                                                <span className="text-xs text-slate-400 mt-1 block">{seg.rqi}</span>
                                            </td>
                                            <td className="px-4 py-3 font-bold text-slate-800">{seg.health}</td>
                                            <td className="px-4 py-3">
                                                <span className={clsx("px-2 py-0.5 rounded text-xs border",
                                                    seg.health >= 90 ? "bg-green-50 text-green-600 border-green-100" :
                                                        seg.health >= 80 ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                            "bg-orange-50 text-orange-600 border-orange-100"
                                                )}>
                                                    {seg.health >= 90 ? '优' : seg.health >= 80 ? '良' : '中'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button className="p-1 text-slate-400 hover:text-blue-600 transition-colors">
                                                    <Edit2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))) : (
                                        <tr>
                                            <td colSpan="6" className="px-4 py-8 text-center text-slate-400 text-sm">暂无细分路段数据</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default RoadRoutesView;
