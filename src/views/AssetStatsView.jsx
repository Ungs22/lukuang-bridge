import React, { useState, useEffect } from 'react';
import {
    Box, CheckCircle2, AlertTriangle, TrendingUp,
    PieChart as PieIcon, BarChart as BarIcon, MapPin,
    Activity, ArrowUpRight, ArrowDownRight, Filter, DollarSign, Radar as RadarIcon,
    X, Calendar, Download, RefreshCw, Check
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area, ComposedChart, Line, RadarChart, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Card } from '../components/UIComponents';
import clsx from 'clsx';

const AssetStatsView = () => {
    const [timeRange, setTimeRange] = useState('year'); // 'week', 'month', 'year'
    const [showFilter, setShowFilter] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Mock Data Generators based on timeRange
    const getMultiplier = () => timeRange === 'week' ? 0.2 : timeRange === 'month' ? 0.8 : 1;

    // Simulate Data Refresh
    const refreshData = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 800);
    };

    useEffect(() => {
        refreshData();
    }, [timeRange]);

    const handleExport = () => {
        setIsExporting(true);
        // Simulate download delay
        setTimeout(() => {
            setIsExporting(false);
            alert('报告导出成功！已保存为 PDF 格式。');
        }, 1500);
    };

    // Mock Data - Randomized & Detailed with impact of timeRange
    const overviewStats = [
        {
            label: '资产总数',
            value: timeRange === 'week' ? '12,548' : '12,548', // Total doesn't change much
            unit: '个',
            icon: Box,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            trend: timeRange === 'week' ? '+12' : '+245',
            trendUp: true,
            desc: timeRange === 'week' ? '本周新增' : '较上月新增'
        },
        {
            label: '完好率',
            value: timeRange === 'week' ? '94.8%' : '94.27%',
            unit: '',
            icon: CheckCircle2,
            color: 'text-green-600',
            bg: 'bg-green-50',
            trend: timeRange === 'week' ? '+0.1%' : '+0.53%',
            trendUp: true,
            desc: '环比提升'
        },
        {
            label: '待维护',
            value: timeRange === 'week' ? '12' : '327',
            unit: '个',
            icon: AlertTriangle,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            trend: timeRange === 'week' ? '-2' : '-8.1%',
            trendUp: false,
            desc: timeRange === 'week' ? '本周新增问题' : '主要集中在护栏'
        },
        {
            label: '维护支出',
            value: timeRange === 'week' ? '1.2' : '45.8',
            unit: '万',
            icon: TrendingUp,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            trend: '+2.1%',
            trendUp: true,
            desc: timeRange === 'week' ? '本周支出' : '本年度累计'
        },
    ];

    const typeData = [
        { name: '交通标志', value: 3457, color: '#3b82f6' },
        { name: '护栏', value: 4503, color: '#f97316' },
        { name: '标线', value: 2108, color: '#a855f7' },
        { name: '井盖', value: 1549, color: '#10b981' },
        { name: '信号灯', value: 954, color: '#ef4444' },
        { name: '监控杆', value: 432, color: '#6366f1' },
    ];

    const roadData = [
        { name: '文一西路', value: 4203 },
        { name: '莫干山路', value: 3805 },
        { name: '天目山路', value: 2507 },
        { name: '余杭塘路', value: 2049 },
    ];

    const healthData = [
        { name: '交通标志', 正常: Math.floor(3203 * getMultiplier()), 待维护: Math.floor(254 * getMultiplier()) },
        { name: '护栏', 正常: Math.floor(4107 * getMultiplier()), 待维护: Math.floor(396 * getMultiplier()) },
        { name: '标线', 正常: Math.floor(2008 * getMultiplier()), 待维护: Math.floor(100 * getMultiplier()) },
        { name: '井盖', 正常: Math.floor(1515 * getMultiplier()), 待维护: Math.floor(34 * getMultiplier()) },
        { name: '信号灯', 正常: Math.floor(902 * getMultiplier()), 待维护: Math.floor(52 * getMultiplier()) },
        { name: '监控杆', 正常: Math.floor(421 * getMultiplier()), 待维护: Math.floor(11 * getMultiplier()) },
    ];

    const trendData = timeRange === 'week' ? [
        { name: '周一', total: 120, new: 5 },
        { name: '周二', total: 132, new: 8 },
        { name: '周三', total: 101, new: 3 },
        { name: '周四', total: 134, new: 12 },
        { name: '周五', total: 90, new: 4 },
        { name: '周六', total: 230, new: 20 },
        { name: '周日', total: 210, new: 15 },
    ] : [
        { name: '1月', total: 11023, new: 203 },
        { name: '2月', total: 11215, new: 157 },
        { name: '3月', total: 11532, new: 304 },
        { name: '4月', total: 11845, new: 243 },
        { name: '5月', total: 12218, new: 405 },
        { name: '6月', total: 12548, new: 346 },
    ];

    // New: Cost Analysis Data
    const costData = [
        { name: 'Q1', 维护成本: 45.2, 预算执行: 88 },
        { name: 'Q2', 维护成本: 52.8, 预算执行: 92 },
        { name: 'Q3', 维护成本: 48.5, 预算执行: 85 },
        { name: 'Q4', 维护成本: 62.1, 预算执行: 96 },
    ];

    // New: Efficiency Radar Data
    // New: Efficiency Radar Data (Randomized)
    const radarData = [
        { subject: '响应速度', A: 123, fullMark: 150 },
        { subject: '修复质量', A: 98, fullMark: 150 },
        { subject: '巡检覆盖', A: 87, fullMark: 150 },
        { subject: '成本控制', A: 104, fullMark: 150 },
        { subject: '服务满意', A: 89, fullMark: 150 },
        { subject: '安全指数', A: 76, fullMark: 150 },
    ];

    const COLORS = ['#3b82f6', '#f97316', '#a855f7', '#10b981', '#ef4444', '#6366f1'];

    return (
        <div className="p-6 space-y-6 relative">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">资产统计分析</h2>
                    <p className="text-slate-500 text-sm mt-1">实时监控城市基础设施资产状态与分布</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Time Range Tabs */}
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
                        title="刷新数据"
                    >
                        <RefreshCw size={16} />
                    </button>

                    <button
                        onClick={() => setShowFilter(true)}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50 hover:text-blue-600 flex items-center shadow-sm transition-colors"
                    >
                        <Filter size={16} className="mr-2" />
                        筛选
                    </button>

                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm flex items-center transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isExporting ? (
                            <>
                                <RefreshCw size={16} className="mr-2 animate-spin" />
                                导出中...
                            </>
                        ) : (
                            <>
                                <Download size={16} className="mr-2" />
                                导出报告
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {overviewStats.map((stat, idx) => (
                    <Card key={idx} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                        <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <stat.icon size={80} />
                        </div>
                        <div className="flex items-start justify-between mb-4">
                            <div className={clsx("p-3 rounded-xl", stat.bg, stat.color)}>
                                <stat.icon size={24} />
                            </div>
                            <div className={clsx("flex items-center text-xs font-bold px-2 py-1 rounded-full",
                                stat.trendUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            )}>
                                {stat.trendUp ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
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

            {/* Row 2: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Asset Distribution Pie */}
                <Card className="lg:col-span-1">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                        <PieIcon size={20} className="mr-2 text-blue-500" />
                        资产类型分布
                    </h3>
                    <div className="h-64 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={typeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {typeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    itemStyle={{ color: '#1e293b' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Info */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <div className="text-3xl font-bold text-slate-800">{typeData.length}</div>
                            <div className="text-xs text-slate-400">大类</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        {typeData.slice(0, 4).map((item, i) => (
                            <div key={i} className="flex items-center text-xs text-slate-600">
                                <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                                <span className="flex-1">{item.name}</span>
                                <span className="font-bold">{Math.round((item.value / 12548) * 100)}%</span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Health Status Stacked Bar - More Complex */}
                <Card className="lg:col-span-2">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center justify-between">
                        <div className="flex items-center">
                            <Activity size={20} className="mr-2 text-green-500" />
                            各类型资产健康状况
                        </div>
                        <div className="flex space-x-2">
                            <span className="flex items-center text-xs text-slate-500"><div className="w-2 h-2 bg-emerald-500 rounded-full mr-1"></div> 正常</span>
                            <span className="flex items-center text-xs text-slate-500"><div className="w-2 h-2 bg-orange-500 rounded-full mr-1"></div> 待维护</span>
                        </div>
                    </h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={healthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: '#f1f5f9' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="正常" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} barSize={32} />
                                <Bar dataKey="待维护" stackId="a" fill="#f97316" radius={[4, 4, 0, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Row 3 Charts: Cost Analysis & Efficiency */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                        <DollarSign size={20} className="mr-2 text-yellow-500" />
                        维护成本分析 (万元)
                    </h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={costData}>
                                <CartesianGrid stroke="#f5f5f5" vertical={false} />
                                <XAxis dataKey="name" scale="band" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="维护成本" barSize={20} fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                <Line type="monotone" dataKey="预算执行" stroke="#ef4444" strokeWidth={2} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card>
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                        <RadarIcon size={20} className="mr-2 text-indigo-500" />
                        运维效率多维评估
                    </h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="#e2e8f0" strokeOpacity={0.5} />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                <Radar name="本月评估" dataKey="A" stroke="#6366f1" strokeWidth={3} fill="#6366f1" fillOpacity={0.2} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Row 4: Road Distribution & Trend */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Road Distribution */}
                <Card className="lg:col-span-2">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                        <MapPin size={20} className="mr-2 text-indigo-500" />
                        道路资产密度排行
                    </h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={roadData} layout="vertical" margin={{ left: 0, right: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={80} tick={{ fill: '#475569', fontWeight: 500 }} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} />
                                <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={24}>
                                    {roadData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#6366f1', '#8b5cf6', '#d946ef', '#ec4899'][index % 4]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Growth Trend */}
                <Card className="lg:col-span-1">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                        <TrendingUp size={20} className="mr-2 text-purple-500" />
                        资产增长趋势
                    </h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} domain={['dataMin - 1000', 'dataMax + 500']} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Filter Sidebar Overlay */}
            {
                showFilter && (
                    <div className="fixed inset-0 z-50 flex">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
                            onClick={() => setShowFilter(false)}
                        ></div>

                        {/* Sidebar Panel */}
                        <div className="relative ml-auto w-80 bg-white h-full shadow-2xl p-6 flex flex-col animate-in slide-in-from-right duration-300">
                            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center">
                                    <Filter size={20} className="mr-2 text-blue-600" />
                                    数据筛选
                                </h3>
                                <button
                                    onClick={() => setShowFilter(false)}
                                    className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 space-y-6 overflow-y-auto">
                                {/* Filter Groups */}
                                <div className="space-y-3">
                                    <label className="text-sm font-semibold text-slate-700 block">管理区域</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['全域', '西湖区', '余杭区', '拱墅区', '滨江区', '萧山区'].map(area => (
                                            <label key={area} className="flex items-center space-x-2 cursor-pointer group">
                                                <input type="checkbox" defaultChecked={area === '全域'} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                                <span className="text-sm text-slate-600 group-hover:text-blue-600">{area}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-semibold text-slate-700 block">资产类型</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['全部', '交通标志', '护栏', '标线', '井盖', '信号灯', '监控杆'].map(type => (
                                            <label key={type} className="flex items-center space-x-2 cursor-pointer group">
                                                <input type="checkbox" defaultChecked={type === '全部'} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                                <span className="text-sm text-slate-600 group-hover:text-blue-600">{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-semibold text-slate-700 block">健康状态</label>
                                    <div className="space-y-2">
                                        <label className="flex items-center justify-between p-2 rounded border border-slate-200 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all">
                                            <span className="text-sm text-slate-600 flex items-center">
                                                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                                正常
                                            </span>
                                            <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                        </label>
                                        <label className="flex items-center justify-between p-2 rounded border border-slate-200 cursor-pointer hover:border-orange-300 hover:bg-orange-50 transition-all">
                                            <span className="text-sm text-slate-600 flex items-center">
                                                <div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
                                                需维护
                                            </span>
                                            <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setShowFilter(false)}
                                    className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
                                >
                                    重置
                                </button>
                                <button
                                    onClick={() => { setShowFilter(false); refreshData(); }}
                                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-md transition-colors flex justify-center items-center"
                                >
                                    <Check size={16} className="mr-1.5" />
                                    应用筛选
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default AssetStatsView;
