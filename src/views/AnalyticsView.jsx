import React, { useState, useEffect } from 'react';
import {
    BarChart3, TrendingUp, PieChart as PieIcon, Activity,
    Calendar, Download, RefreshCw, Filter, Check, X,
    MapPin, Truck, AlertTriangle, Clock, ArrowUpRight, ArrowDownRight,
    Users, Siren, Timer, Plane
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ComposedChart
} from 'recharts';
import { Card } from '../components/UIComponents';
import clsx from 'clsx';

const AnalyticsView = () => {
    const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'year'
    const [isLoading, setIsLoading] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    // Mock Data Generators
    const getMultiplier = () => timeRange === 'week' ? 0.25 : timeRange === 'month' ? 1 : 12;

    const refreshData = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 800);
    };

    useEffect(() => {
        refreshData();
    }, [timeRange]);

    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => {
            setIsExporting(false);
            alert('综合统计报告已导出');
        }, 1500);
    };

    // --- Mock Data ---

    const kpiStats = [
        {
            label: '飞行覆盖总里程',
            value: timeRange === 'week' ? '425' : '1,842',
            unit: 'km',
            icon: Plane,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            trend: '+5.2%',
            trendUp: true,
            desc: 'AI 自动巡检占比 85%'
        },
        {
            label: '病害发现总数',
            value: timeRange === 'week' ? '128' : '546',
            unit: '处',
            icon: AlertTriangle,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            trend: '-2.4%',
            trendUp: false, // Good thing
            desc: '重度病害占比下降'
        },
        {
            label: '平均修复时长',
            value: '4.2',
            unit: '小时',
            icon: Clock,
            color: 'text-green-600',
            bg: 'bg-green-50',
            trend: '-0.5h',
            trendUp: true, // Reduced time is good, handled visually
            isTime: true,
            desc: '同比缩短 12%'
        },
        {
            label: '养护投入',
            value: timeRange === 'week' ? '3.5' : '15.8',
            unit: '万元',
            icon: TrendingUp,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            trend: '+1.2%',
            trendUp: false, // Cost up
            desc: '主要用于桥梁修缮'
        }
    ];

    // Disease Trend Lines
    const diseaseTrendData = [
        { name: '1日', 裂缝: 12, 锈蚀: 5, 破损: 2 },
        { name: '5日', 裂缝: 18, 锈蚀: 8, 破损: 1 },
        { name: '10日', 裂缝: 10, 锈蚀: 4, 破损: 3 },
        { name: '15日', 裂缝: 25, 锈蚀: 10, 破损: 2 },
        { name: '20日', 裂缝: 14, 锈蚀: 6, 破损: 4 },
        { name: '25日', 裂缝: 22, 锈蚀: 9, 破损: 1 },
        { name: '30日', 裂缝: 16, 锈蚀: 7, 破损: 3 },
    ];

    // Inspection vs Disease Discovery
    const inspectionEfficiencyData = [
        { name: '第1周', 里程: 420, 发现: 35 },
        { name: '第2周', 里程: 450, 发现: 42 },
        { name: '第3周', 里程: 380, 发现: 28 },
        { name: '第4周', 里程: 480, 发现: 51 },
    ];

    // Complaint / Work Order Source
    const sourceData = [
        { name: 'AI 巡检', value: 65, color: '#3b82f6' },
        { name: '人工上报', value: 20, color: '#10b981' },
        { name: '市民反馈', value: 10, color: '#f59e0b' },
        { name: 'IoT 监测', value: 5, color: '#8b5cf6' },
    ];

    // Team Performance
    const teamData = [
        { name: '养护一队', 完成: 124, 及时率: 98 },
        { name: '养护二队', 完成: 98, 及时率: 92 },
        { name: '设施科', 完成: 86, 及时率: 95 },
        { name: '应急组', 完成: 45, 及时率: 100 },
    ];

    // High Frequency Disease Roads
    const roadRiskData = [
        { name: '复兴大桥 (主跨)', count: 42, type: '网状裂缝', risk: 'High' },
        { name: '钱塘江大桥 (南段)', count: 35, type: '露筋/剥落', risk: 'High' },
        { name: '西兴大桥 (辅拱)', count: 28, type: '钢结构锈蚀', risk: 'Medium' },
        { name: '之江大桥 (全段)', count: 22, type: '支座偏移', risk: 'Medium' },
        { name: '九堡大桥 (引桥)', count: 15, type: '伸缩缝破损', risk: 'Low' },
    ];

    // Response Time Distribution
    const timeDistData = [
        { range: '< 2h', count: 45 },
        { range: '2-6h', count: 82 },
        { range: '6-12h', count: 36 },
        { range: '12-24h', count: 18 },
        { range: '> 24h', count: 5 },
    ];

    return (
        <div className="p-6 space-y-6 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">综合统计分析</h2>
                    <p className="text-slate-500 text-sm mt-1">全方位掌握巡检效能、病害趋势与养护绩效</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm mr-2">
                        {[
                            { id: 'week', label: '近7天' },
                            { id: 'month', label: '近30天' },
                            { id: 'year', label: '本年度' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setTimeRange(tab.id)}
                                className={clsx(
                                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                                    timeRange === tab.id
                                        ? "bg-slate-100 text-slate-900 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={refreshData}
                        className={clsx("p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 shadow-sm transition-all", isLoading && "animate-spin text-blue-500")}
                    >
                        <RefreshCw size={16} />
                    </button>

                    <button
                        onClick={() => setShowFilter(true)}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50 hover:text-blue-600 flex items-center shadow-sm"
                    >
                        <Filter size={16} className="mr-2" />
                        筛选
                    </button>

                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm flex items-center disabled:opacity-70"
                    >
                        {isExporting ? <RefreshCw size={16} className="mr-2 animate-spin" /> : <Download size={16} className="mr-2" />}
                        导出月报
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiStats.map((stat, idx) => (
                    <Card key={idx} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className={clsx("p-3 rounded-xl", stat.bg, stat.color)}>
                                <stat.icon size={24} />
                            </div>
                            <div className={clsx("flex items-center text-xs font-bold px-2 py-1 rounded-full",
                                stat.trendUp && stat.isTime ? "bg-green-100 text-green-700" : // Good (Time reduced)
                                    stat.trendUp ? "bg-green-100 text-green-700" :
                                        !stat.trendUp && stat.label === '病害发现总数' ? "bg-green-100 text-green-700" : // Less disease is good? Maybe context dependent. Let's stick to standard logic.
                                            "bg-slate-100 text-slate-600"
                            )}>
                                {stat.trend.startsWith('+') ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                                {stat.trend}
                            </div>
                        </div>
                        <div>
                            <div className="text-slate-500 text-sm font-medium mb-1">{stat.label}</div>
                            <div className="flex items-end mb-1">
                                <span className="text-3xl font-bold text-slate-800 mr-1">{stat.value}</span>
                                <span className="text-sm text-slate-500 font-medium mb-1">{stat.unit}</span>
                            </div>
                            <div className="text-xs text-slate-400">{stat.desc}</div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Main Charts Row 1: Disease Trend & Sources */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                        <TrendingUp size={20} className="mr-2 text-blue-500" />
                        病害趋势分析
                    </h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={diseaseTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSplit" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Legend />
                                <Area type="monotone" dataKey="裂缝" stackId="1" stroke="#3b82f6" fill="url(#colorSplit)" />
                                <Area type="monotone" dataKey="锈蚀" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                                <Area type="monotone" dataKey="破损" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card>
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                        <Activity size={20} className="mr-2 text-indigo-500" />
                        问题来源构成
                    </h3>
                    <div className="h-60 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={sourceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {sourceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <div className="text-2xl font-bold text-slate-800">100%</div>
                            <div className="text-xs text-slate-400">来源</div>
                        </div>
                    </div>
                    <div className="space-y-3 mt-2">
                        {sourceData.map((item, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-slate-600">{item.name}</span>
                                </div>
                                <span className="font-bold text-slate-700">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Row 2: Inspection Efficiency & Team Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                        <Plane size={20} className="mr-2 text-teal-500" />
                        飞行覆盖与发现病害数对比
                    </h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={inspectionEfficiencyData}>
                                <CartesianGrid stroke="#f5f5f5" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis yAxisId="left" axisLine={false} tickLine={false} />
                                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Legend />
                                <Bar yAxisId="left" dataKey="里程" barSize={30} fill="#0ea5e9" radius={[4, 4, 0, 0]} name="飞行覆盖(km)" />
                                <Line yAxisId="right" type="monotone" dataKey="发现" stroke="#ef4444" strokeWidth={3} name="发现病害(处)" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card>
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                        <Users size={20} className="mr-2 text-purple-500" />
                        养护团队绩效考核
                    </h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={teamData} layout="vertical" margin={{ left: 20, right: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={80} tick={{ fill: '#475569', fontWeight: 500 }} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} />
                                <Legend />
                                <Bar dataKey="完成" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={16} name="完成工单数" />
                                <Bar dataKey="及时率" fill="#10b981" radius={[0, 4, 4, 0]} barSize={16} name="响应及时率(%)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Row 3: Risk Analysis & Time Efficiency */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Risk Roads */}
                <Card className="lg:col-span-2">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                        <Siren size={20} className="mr-2 text-red-500" />
                        高频病害桥梁排行 (TOP 5)
                    </h3>
                    <div className="space-y-4">
                        {roadRiskData.map((road, idx) => (
                            <div key={idx} className="flex items-center group">
                                <div className={clsx(
                                    "w-8 h-8 rounded-lg flex items-center justify-center mr-4 text-sm font-bold transition-colors",
                                    idx < 3 ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-500"
                                )}>
                                    {idx + 1}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-bold text-slate-700">{road.name}</span>
                                            <span className={clsx("text-xs px-2 py-0.5 rounded border",
                                                road.risk === 'High' ? "bg-red-50 border-red-100 text-red-600" :
                                                    road.risk === 'Medium' ? "bg-orange-50 border-orange-100 text-orange-600" :
                                                        "bg-blue-50 border-blue-100 text-blue-600"
                                            )}>{road.risk === 'High' ? '高风险' : road.risk === 'Medium' ? '中风险' : '低风险'}</span>
                                        </div>
                                        <div className="text-sm font-medium text-slate-500">
                                            主要病害: <span className="text-slate-700">{road.type}</span>
                                        </div>
                                    </div>
                                    <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={clsx("absolute top-0 left-0 h-full rounded-full transition-all duration-500",
                                                road.risk === 'High' ? "bg-red-500" :
                                                    road.risk === 'Medium' ? "bg-orange-500" : "bg-blue-500"
                                            )}
                                            style={{ width: `${(road.count / 50) * 100}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-right mt-1 text-xs text-slate-400">
                                        累计发现 {road.count} 处
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Time Distribution */}
                <Card>
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                        <Timer size={20} className="mr-2 text-green-500" />
                        工单处理时效分布
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={timeDistData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32}>
                                    {timeDistData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 1 ? '#10b981' : '#86efac'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100 flex items-start">
                        <div className="text-xs text-green-800 leading-relaxed">
                            <span className="font-bold">✨ 分析结论:</span> 近 70% 的工单能在 6 小时内完成处理，响应效率处于 <span className="font-bold text-green-700">优良</span> 水平。
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filter Sidebar (Reused/Adapted) */}
            {showFilter && (
                <div className="fixed inset-0 z-50 flex">
                    <div
                        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
                        onClick={() => setShowFilter(false)}
                    ></div>
                    <div className="relative ml-auto w-80 bg-white h-full shadow-2xl p-6 flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center">
                                <Filter size={20} className="mr-2 text-blue-600" />
                                综合筛选
                            </h3>
                            <button
                                onClick={() => setShowFilter(false)}
                                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        {/* Filter Content */}
                        <div className="flex-1 space-y-6">
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-slate-700 block">数据维度</label>
                                <select className="w-full p-2 border border-slate-300 rounded-md text-sm">
                                    <option>按行政区划</option>
                                    <option>按桥梁等级</option>
                                    <option>按养护单位</option>
                                </select>
                            </div>
                            {/* ... more filters ... */}
                        </div>
                        <div className="mt-8 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                            <button onClick={() => setShowFilter(false)} className="w-full py-2.5 px-4 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg">重置</button>
                            <button onClick={() => { setShowFilter(false); refreshData(); }} className="w-full py-2.5 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg flex justify-center items-center">
                                <Check size={16} className="mr-1.5" /> 应用
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnalyticsView;
