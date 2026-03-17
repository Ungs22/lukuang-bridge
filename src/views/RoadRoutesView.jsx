import React, { useState, useEffect } from 'react';
import {
    MapPin, Navigation, TrendingUp, AlertTriangle, MoreHorizontal,
    ChevronRight, Search, BarChart3, Activity, Layers, Edit2, ShieldAlert,
    FileText, Calendar, Wrench, ExternalLink, Gauge, Wind
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Card } from '../components/UIComponents';
import { MOCK_BRIDGES, MOCK_BRIDGE_DISEASES } from '../MockData';
import clsx from 'clsx';

// 桥梁构件数据（基于桥梁ID）
const BRIDGE_COMPONENTS = {
    'BRG-001': [
        { id: 101, name: '主跨钢箱梁', health: 82, pci: 85, rqi: 78, issues: 3 },
        { id: 102, name: '北引桥', health: 88, pci: 90, rqi: 86, issues: 1 },
        { id: 103, name: '南引桥', health: 75, pci: 78, rqi: 72, issues: 5 },
        { id: 104, name: '主塔（A塔）', health: 85, pci: 87, rqi: 83, issues: 2 },
        { id: 105, name: '拉索系统', health: 80, pci: 82, rqi: 78, issues: 3 },
        { id: 106, name: '桥面铺装', health: 90, pci: 92, rqi: 88, issues: 1 },
    ],
    'BRG-002': [
        { id: 201, name: '上层公路桥面', health: 65, pci: 68, rqi: 62, issues: 8 },
        { id: 202, name: '下层铁路桥面', health: 70, pci: 72, rqi: 68, issues: 6 },
        { id: 203, name: '钢桁架主梁', health: 62, pci: 65, rqi: 60, issues: 10 },
        { id: 204, name: '桥墩群（15座）', health: 72, pci: 74, rqi: 70, issues: 5 },
        { id: 205, name: '防撞护栏', health: 68, pci: 70, rqi: 66, issues: 4 },
    ],
    'BRG-003': [
        { id: 301, name: '主拱肋', health: 94, pci: 95, rqi: 93, issues: 0 },
        { id: 302, name: '吊杆系统', health: 92, pci: 94, rqi: 90, issues: 1 },
        { id: 303, name: '桥面板', health: 90, pci: 92, rqi: 88, issues: 1 },
        { id: 304, name: '桥墩', health: 93, pci: 95, rqi: 91, issues: 0 },
        { id: 305, name: '伸缩缝', health: 88, pci: 90, rqi: 86, issues: 2 },
    ],
    'BRG-004': [
        { id: 401, name: '独塔（H型）', health: 72, pci: 75, rqi: 68, issues: 6 },
        { id: 402, name: '斜拉索', health: 78, pci: 80, rqi: 76, issues: 4 },
        { id: 403, name: '预应力箱梁', health: 76, pci: 78, rqi: 74, issues: 5 },
        { id: 404, name: '桥面铺装', health: 82, pci: 84, rqi: 80, issues: 3 },
        { id: 405, name: '支座系统', health: 74, pci: 76, rqi: 72, issues: 4 },
        { id: 406, name: '防撞护栏', health: 70, pci: 72, rqi: 68, issues: 6 },
    ],
    'BRG-005': [
        { id: 501, name: '主拱肋', health: 90, pci: 92, rqi: 88, issues: 1 },
        { id: 502, name: '吊杆系统', health: 88, pci: 90, rqi: 86, issues: 2 },
        { id: 503, name: '桥面系', health: 86, pci: 88, rqi: 84, issues: 2 },
        { id: 504, name: '桥墩', health: 92, pci: 94, rqi: 90, issues: 0 },
    ],
    'BRG-006': [
        { id: 601, name: '预应力箱梁', health: 86, pci: 88, rqi: 84, issues: 2 },
        { id: 602, name: '桥墩群', health: 84, pci: 86, rqi: 82, issues: 2 },
        { id: 603, name: '桥面铺装', health: 88, pci: 90, rqi: 86, issues: 1 },
        { id: 604, name: '伸缩缝', health: 82, pci: 84, rqi: 80, issues: 3 },
    ],
    'BRG-007': [
        { id: 701, name: '系杆拱肋', health: 92, pci: 94, rqi: 90, issues: 0 },
        { id: 702, name: '系杆', health: 90, pci: 92, rqi: 88, issues: 1 },
        { id: 703, name: '桥面板', health: 88, pci: 90, rqi: 86, issues: 2 },
        { id: 704, name: '桥墩', health: 91, pci: 93, rqi: 89, issues: 1 },
    ],
    'BRG-008': [
        { id: 801, name: '管片衬砌', health: 96, pci: 97, rqi: 95, issues: 0 },
        { id: 802, name: '路面结构', health: 94, pci: 96, rqi: 92, issues: 0 },
        { id: 803, name: '通风系统', health: 93, pci: 95, rqi: 91, issues: 1 },
        { id: 804, name: '排水系统', health: 95, pci: 96, rqi: 94, issues: 0 },
    ],
};

const getTechGradeLabel = (grade) => {
    const labels = { 1: '一类', 2: '二类', 3: '三类', 4: '四类', 5: '五类' };
    return labels[grade] || '-';
};

const RoadRoutesView = ({ onNavigate, initialBridgeId }) => {
    const [selectedRoute, setSelectedRoute] = useState(MOCK_BRIDGES[0]);
    const [searchTerm, setSearchTerm] = useState('');
    const [detailTab, setDetailTab] = useState('basic'); // 'basic' | 'structure' | 'sensors'

    // 支持从地图联动跳转
    useEffect(() => {
        if (initialBridgeId) {
            const bridge = MOCK_BRIDGES.find(b => b.id === initialBridgeId);
            if (bridge) setSelectedRoute(bridge);
        }
    }, [initialBridgeId]);

    const filteredRoutes = MOCK_BRIDGES.filter(r => r.name.includes(searchTerm) || r.bridgeCode?.includes(searchTerm));

    const currentSegments = BRIDGE_COMPONENTS[selectedRoute.id] || [];
    const avgPCI = currentSegments.length > 0 ? Math.round(currentSegments.reduce((acc, s) => acc + s.pci, 0) / currentSegments.length) : 0;
    const totalIssues = currentSegments.reduce((acc, s) => acc + s.issues, 0);
    const bridgeDiseaseCount = MOCK_BRIDGE_DISEASES.filter(d => d.bridgeName === selectedRoute.name).length;

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

    const trendData = [
        { name: '1月', score: selectedRoute.healthScore - 2 },
        { name: '2月', score: selectedRoute.healthScore - 1 },
        { name: '3月', score: selectedRoute.healthScore + 1 },
        { name: '4月', score: selectedRoute.healthScore - 3 },
        { name: '5月', score: selectedRoute.healthScore + 2 },
        { name: '6月', score: selectedRoute.healthScore }
    ];

    return (
        <div className="p-6 space-y-6 flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">桥梁资产台账</h2>
                    <p className="text-slate-500 text-sm mt-1">城市桥梁群全生命周期管理与健康监测</p>
                </div>
                <div className="flex space-x-3">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm flex items-center">
                        <Navigation size={16} className="mr-2" />
                        新增桥梁资产
                    </button>
                </div>
            </div>

            <div className="flex-1 flex space-x-6 overflow-hidden">
                {/* Left Sidebar: Bridge List */}
                <Card className="w-1/3 flex flex-col h-full p-0 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="搜索桥梁名称或编号..."
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
                                            {route.id.split('-')[1]}
                                        </span>
                                        {route.name}
                                    </div>
                                    <span className={clsx("text-xs px-2 py-0.5 rounded-full font-medium border",
                                        route.healthScore >= 90 ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                            route.healthScore >= 80 ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                route.healthScore >= 60 ? "bg-orange-50 text-orange-600 border-orange-100" :
                                                    "bg-red-50 text-red-600 border-red-100"
                                    )}>
                                        {route.healthScore}分
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">{route.type}</span>
                                        <span>{route.crossType}</span>
                                    </div>
                                    <div className="font-mono">{route.length}m</div>
                                </div>
                                {route.managementUnit && (
                                    <div className="text-[10px] text-slate-400 mt-1 truncate">
                                        {route.managementUnit}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Right Content: Route Detail */}
                <div className="flex-1 flex flex-col space-y-6 overflow-y-auto pr-1">
                    {/* Top Stats */}
                    <div className="grid grid-cols-4 gap-4 shrink-0">
                        <Card className={clsx("p-4 flex items-center justify-between text-white border-none shadow-md", getHealthBgGradient(selectedRoute.healthScore))}>
                            <div>
                                <div className="text-white/80 text-xs font-medium mb-1">综合健康 (BHI)</div>
                                <div className="text-3xl font-bold">{selectedRoute.healthScore}</div>
                                <div className="text-white/80 text-xs mt-1">等级: {getTechGradeLabel(selectedRoute.techGrade)}</div>
                            </div>
                            <Activity size={40} className="text-white opacity-20" />
                        </Card>
                        <Card className="p-4 flex items-center justify-between">
                            <div>
                                <div className="text-slate-500 text-xs font-medium mb-1">BCI 状况指数</div>
                                <div className={clsx("text-3xl font-bold", getHealthColorClass(selectedRoute.bci || 0))}>{selectedRoute.bci || '-'}</div>
                                <div className={clsx("text-xs mt-1 font-bold", getHealthColorClass(selectedRoute.bci || 0))}>{getRatingLabel(selectedRoute.bci || 0)}</div>
                            </div>
                            <Layers size={40} className="text-slate-200" />
                        </Card>
                        <Card className="p-4 flex items-center justify-between">
                            <div>
                                <div className="text-slate-500 text-xs font-medium mb-1">构件隐患</div>
                                <div className="text-3xl font-bold text-orange-500">{totalIssues}</div>
                                <div className="text-slate-400 text-xs mt-1">处</div>
                            </div>
                            <ShieldAlert size={40} className="text-orange-100" />
                        </Card>
                        <Card className="p-4 flex items-center justify-between">
                            <div>
                                <div className="text-slate-500 text-xs font-medium mb-1">病害记录</div>
                                <div className="text-3xl font-bold text-red-500">{bridgeDiseaseCount}</div>
                                <div className="text-slate-400 text-xs mt-1">条</div>
                            </div>
                            <AlertTriangle size={40} className="text-red-100" />
                        </Card>
                    </div>

                    {/* Info Tabs */}
                    <Card className="p-0 overflow-hidden shrink-0">
                        <div className="flex border-b border-slate-100">
                            {[
                                { id: 'basic', label: '基本信息', icon: FileText },
                                { id: 'structure', label: '结构与材料', icon: Layers },
                                { id: 'sensors', label: '实时监测', icon: Activity },
                            ].map(tab => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setDetailTab(tab.id)}
                                        className={clsx(
                                            "flex items-center gap-1.5 px-5 py-3 text-sm font-medium transition-all border-b-2",
                                            detailTab === tab.id
                                                ? "text-blue-600 border-blue-600 bg-blue-50/50"
                                                : "text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50"
                                        )}
                                    >
                                        <Icon size={14} />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="p-5">
                            {detailTab === 'basic' && (
                                <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                                    {[
                                        ['桥梁名称', selectedRoute.name],
                                        ['桥梁编号', selectedRoute.bridgeCode],
                                        ['桥型', selectedRoute.type],
                                        ['设计荷载', selectedRoute.designLoad],
                                        ['抗震设防', selectedRoute.seismicIntensity],
                                        ['跨越类型', selectedRoute.crossType],
                                        ['管养单位', selectedRoute.managementUnit],
                                        ['施工单位', selectedRoute.constructionUnit],
                                        ['通车日期', selectedRoute.openDate],
                                        ['最近巡检', selectedRoute.lastInspectionDate],
                                        ['车道数', `${selectedRoute.lanes}车道`],
                                        ['桥龄', `${new Date().getFullYear() - selectedRoute.buildYear}年`],
                                    ].map(([label, value]) => (
                                        <div key={label} className="flex justify-between items-center py-1.5 border-b border-slate-50 text-sm">
                                            <span className="text-slate-500">{label}</span>
                                            <span className="font-medium text-slate-800">{value || '-'}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {detailTab === 'structure' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            ['全长', selectedRoute.length ? `${selectedRoute.length}m` : '-'],
                                            ['主跨径', selectedRoute.mainSpan ? `${selectedRoute.mainSpan}m` : '-'],
                                            ['桥宽', selectedRoute.width ? `${selectedRoute.width}m` : '-'],
                                            ['净高/塔高', selectedRoute.height ? `${selectedRoute.height}m` : '-'],
                                            ['跨数', selectedRoute.spanCount || '-'],
                                            ['墩台数', selectedRoute.pierCount || '-'],
                                        ].map(([label, value]) => (
                                            <div key={label} className="bg-slate-50 rounded-lg p-3 border border-slate-100 text-center">
                                                <div className="text-xs text-slate-500 mb-1">{label}</div>
                                                <div className="text-lg font-bold text-slate-800 font-mono">{value}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-2">
                                        {[
                                            ['上部结构材料', selectedRoute.superstructureMaterial],
                                            ['下部结构材料', selectedRoute.substructureMaterial],
                                            ['桥面铺装', selectedRoute.deckPavement],
                                        ].map(([label, value]) => (
                                            <div key={label} className="flex justify-between items-center py-2 border-b border-slate-50 text-sm">
                                                <span className="text-slate-500">{label}</span>
                                                <span className="font-medium text-blue-600">{value || '-'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {detailTab === 'sensors' && (
                                <div className="grid grid-cols-4 gap-3">
                                    {[
                                        { label: '风速', value: selectedRoute.sensors?.windSpeed, unit: 'm/s', icon: Wind },
                                        { label: '应变', value: selectedRoute.sensors?.strain, unit: 'με', icon: Activity },
                                        { label: '振动', value: selectedRoute.sensors?.vibration, unit: 'mm/s', icon: Activity },
                                        { label: '挠度', value: selectedRoute.sensors?.deflection, unit: 'mm', icon: Gauge },
                                        { label: '倾斜角', value: selectedRoute.sensors?.tiltAngle, unit: '°', icon: Gauge },
                                        { label: '频率偏移', value: selectedRoute.sensors?.freqShift, unit: 'Hz', icon: Activity },
                                        { label: '氯离子', value: selectedRoute.sensors?.chlorideConc, unit: 'kg/m³', icon: Gauge },
                                        ...(selectedRoute.sensors?.stringTension ? [{ label: '索力', value: selectedRoute.sensors.stringTension, unit: 'kN', icon: Gauge }] : []),
                                    ].map((item, i) => {
                                        const Icon = item.icon;
                                        return (
                                            <div key={i} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                                                <div className="text-[10px] text-slate-500 flex items-center gap-1 mb-1">
                                                    <Icon size={10} />
                                                    {item.label}
                                                </div>
                                                <div className="text-lg font-bold text-slate-800 font-mono">
                                                    {item.value ?? '-'}
                                                    <span className="text-xs text-slate-400 font-normal ml-0.5">{item.unit}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Charts Row */}
                    <div className="flex gap-4 h-72 shrink-0">
                        <Card className="flex-1 min-w-0 flex flex-col h-full">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center shrink-0 h-7">
                                <TrendingUp size={20} className="mr-2 text-blue-500" />
                                健康度趋势分析
                            </h3>
                            <div className="w-full flex-1 min-h-0">
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

                        <Card className="w-1/3 min-w-0 flex flex-col h-full">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center shrink-0 h-7">
                                <Activity size={20} className="mr-2 text-orange-500" />
                                风险等级分布
                            </h3>
                            <div className="w-full flex-1 min-h-0 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: '低风险', value: MOCK_BRIDGES.filter(b => b.healthScore >= 85).length, color: '#10b981' },
                                                { name: '中风险', value: MOCK_BRIDGES.filter(b => b.healthScore >= 70 && b.healthScore < 85).length, color: '#f59e0b' },
                                                { name: '高风险', value: MOCK_BRIDGES.filter(b => b.healthScore < 70).length, color: '#ef4444' },
                                            ]}
                                            cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value"
                                        >
                                            {[
                                                { color: '#10b981' }, { color: '#f59e0b' }, { color: '#ef4444' },
                                            ].map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36} iconSize={10} wrapperStyle={{ fontSize: '12px', bottom: 0 }} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none pb-8">
                                    <div className="text-2xl font-bold text-slate-700">{MOCK_BRIDGES.length}</div>
                                    <div className="text-xs text-slate-400">总数</div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Segments Table */}
                    <Card className="shrink-0">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center">
                                <Navigation size={20} className="mr-2 text-indigo-500" />
                                桥梁附属构件维保
                            </h3>
                            <button
                                onClick={() => onNavigate?.('bridge-network')}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                            >
                                查看GIS地图 <ExternalLink size={14} />
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold">
                                    <tr>
                                        <th className="px-4 py-3 rounded-l-lg">构件名称</th>
                                        <th className="px-4 py-3">BHI (结构)</th>
                                        <th className="px-4 py-3">SHM (综合)</th>
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
                                                            seg.health >= 60 ? "bg-orange-50 text-orange-600 border-orange-100" :
                                                                "bg-red-50 text-red-600 border-red-100"
                                                )}>
                                                    {seg.health >= 90 ? '优' : seg.health >= 80 ? '良' : seg.health >= 60 ? '中' : '差'}
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
                                            <td colSpan="6" className="px-4 py-8 text-center text-slate-400 text-sm">暂无附属构件数据</td>
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
