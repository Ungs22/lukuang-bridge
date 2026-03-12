import React, { useState, useEffect } from 'react';
import {
    Activity, ArrowUpRight, ArrowDownRight, RefreshCw, CheckCircle2,
    ShieldAlert, TriangleRight, Cpu, Layers, Radar as RadarIcon, Download,
    AlertTriangle, TrendingUp
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area, ComposedChart, Line, RadarChart, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Card } from '../components/UIComponents';
import clsx from 'clsx';
import { MOCK_BRIDGES, MOCK_BRIDGE_DISEASES } from '../MockData';

const AssetStatsView = () => {
    const [timeRange, setTimeRange] = useState('month'); 
    const [isLoading, setIsLoading] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, [timeRange]);

    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => {
            setIsExporting(false);
            alert('结构健康评估报告成功生成，已归档。');
        }, 1500);
    };

    // Calculate aggregated metrics from MockData
    const totalBridges = MOCK_BRIDGES.length;
    const severeDiseases = MOCK_BRIDGE_DISEASES.filter(d => d.severity === '重度').length;
    const totalDiseases = MOCK_BRIDGE_DISEASES.length;
    const healthScore = 86; // derived conceptually

    // Mock bridge structural types for charts
    const bridgeTypeData = [
        { name: '悬索桥', value: 3, color: '#3b82f6' },
        { name: '斜拉桥', value: 2, color: '#6366f1' },
        { name: '拱桥', value: 4, color: '#10b981' },
        { name: '梁桥', value: 8, color: '#f59e0b' },
        { name: '刚构桥', value: 1, color: '#8b5cf6' },
    ];

    // Disease components distribution
    const componentData = [
        { name: '桥面板', value: 42, color: '#0ea5e9' },
        { name: '主梁', value: 28, color: '#f43f5e' },
        { name: '桥墩/桥台', value: 35, color: '#14b8a6' },
        { name: '铺装层', value: 56, color: '#8b5cf6' },
        { name: '防撞护栏', value: 19, color: '#f59e0b' },
    ];

    // AI Recognition trend (weekly)
    const trendData = [
        { name: '第1周', AI提取数目: 120, 人工确认有效数: 115 },
        { name: '第2周', AI提取数目: 180, 人工确认有效数: 168 },
        { name: '第3周', AI提取数目: 240, 人工确认有效数: 230 },
        { name: '第4周', AI提取数目: 195, 人工确认有效数: 189 },
        { name: '第5周', AI提取数目: 290, 人工确认有效数: 282 },
    ];

    // Bridge Structural Health Radar (BCI/BSI evaluation analog)
    const radarData = [
        { subject: '上部结构承载能力', A: 90, fullMark: 100 },
        { subject: '下部墩台稳定性', A: 85, fullMark: 100 },
        { subject: '桥面系完好率', A: 78, fullMark: 100 },
        { subject: '索塔防腐层寿命', A: 65, fullMark: 100 },
        { subject: '支座/伸缩缝工况', A: 70, fullMark: 100 },
        { subject: '附属性设施状态', A: 95, fullMark: 100 },
    ];

    // Custom Tooltip for Charts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-white text-sm">
                    <p className="font-bold text-slate-300 mb-1">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }} className="font-mono">
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500 min-h-[calc(100vh-64px)] bg-slate-50 overflow-y-auto">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold flex items-center text-slate-800">
                        <RadarIcon className="mr-3 text-indigo-600" size={28} />
                        全域桥梁结构健康大数据监测雷达
                    </h2>
                    <p className="text-slate-500 text-sm mt-1 ml-10">基于无人机视觉解析的桥梁全生命周期多维健康评估中心</p>
                </div>
                <div className="flex items-center space-x-3 mt-4 md:mt-0">
                    <div className="bg-slate-100 p-1.5 rounded-lg flex text-sm font-bold border border-slate-200">
                        {['week', 'month', 'year'].map(r => (
                            <button
                                key={r}
                                onClick={() => setTimeRange(r)}
                                className={clsx(
                                    "px-4 py-1.5 rounded-md transition-all",
                                    timeRange === r ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                )}
                            >
                                {r === 'week' ? '本周' : r === 'month' ? '本月' : '年度'}分析
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md shadow-indigo-200 transition-all flex items-center disabled:opacity-75"
                    >
                        {isExporting ? <RefreshCw className="animate-spin mr-2" size={16} /> : <Download size={16} className="mr-2" />}
                        {isExporting ? '生成报表...' : '导出健康白皮书'}
                    </button>
                </div>
            </div>

            {/* Core Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className={clsx("relative overflow-hidden transition-all duration-300", isLoading ? "opacity-50" : "opacity-100")}>
                    <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl from-blue-100 to-transparent rounded-bl-full opacity-50 z-0 border-l border-b border-blue-50"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="text-slate-500 font-bold uppercase tracking-widest text-xs">辖区建档桥梁数</div>
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600 border border-blue-100"><Layers size={20} /></div>
                        </div>
                        <div className="flex items-baseline">
                            <span className="text-4xl font-black text-slate-800">{totalBridges}</span>
                            <span className="ml-2 text-sm text-slate-500 font-bold">座特大/大中桥</span>
                        </div>
                        <div className="mt-3 flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded">
                            <ArrowUpRight size={14} className="mr-1" /> 当前周期新增 2 座监控
                        </div>
                    </div>
                </Card>

                <Card className={clsx("relative overflow-hidden transition-all duration-300 border-b-4 border-b-emerald-500", isLoading ? "opacity-50" : "opacity-100")}>
                    <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl from-emerald-100 to-transparent rounded-bl-full opacity-50 z-0"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="text-slate-500 font-bold uppercase tracking-widest text-xs">全市桥群综合评估指数</div>
                            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 border border-emerald-100"><Activity size={20} /></div>
                        </div>
                        <div className="flex items-baseline">
                            <span className="text-4xl font-black text-emerald-600">{healthScore}</span>
                            <span className="ml-2 text-sm text-slate-500 font-bold">/ 100 分 (BCI等级 B)</span>
                        </div>
                        <div className="mt-3 flex items-center text-xs font-bold text-red-500 bg-red-50 w-fit px-2 py-1 rounded">
                            <ArrowDownRight size={14} className="mr-1" /> 环比下降 1.2%
                        </div>
                    </div>
                </Card>

                <Card className={clsx("relative overflow-hidden transition-all duration-300", isLoading ? "opacity-50" : "opacity-100")}>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="text-slate-500 font-bold uppercase tracking-widest text-xs">AI 共提取异常表征</div>
                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 border border-indigo-100"><Cpu size={20} /></div>
                        </div>
                        <div className="flex items-baseline">
                            <span className="text-4xl font-black text-slate-800">{totalDiseases}</span>
                            <span className="ml-2 text-sm text-slate-500 font-bold">处病害表征</span>
                        </div>
                        <div className="mt-3 flex items-center text-xs font-bold text-indigo-600 bg-indigo-50 w-fit px-2 py-1 rounded border border-indigo-100">
                            机器视觉识别率提升至 94.6%
                        </div>
                    </div>
                </Card>

                <Card className={clsx("relative overflow-hidden transition-all duration-300 border-l-4 border-l-rose-500", isLoading ? "opacity-50" : "opacity-100")}>
                    <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl from-rose-100 to-transparent rounded-bl-full opacity-50 z-0"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="text-slate-500 font-bold uppercase tracking-widest text-xs">结构安全严峻隐患</div>
                            <div className="p-2 bg-rose-50 rounded-lg text-rose-600 border border-rose-100"><ShieldAlert size={20} /></div>
                        </div>
                        <div className="flex items-baseline">
                            <span className="text-4xl font-black text-rose-600">{severeDiseases}</span>
                            <span className="ml-2 text-sm text-slate-500 font-bold">处 (重度/危急)</span>
                        </div>
                        <div className="mt-3 flex items-center text-xs font-bold text-rose-500 bg-rose-50 w-fit px-2 py-1 rounded">
                            <AlertTriangle size={14} className="mr-1" /> 立即派发加固工单!
                        </div>
                    </div>
                </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Col: Trend */}
                <Card className="lg:col-span-2 flex flex-col h-96">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 text-lg flex items-center">
                            <TrendingUp className="mr-2 text-indigo-500" /> 无人机AI提图时序走势 (机器提取 vs 审核有效)
                        </h3>
                        <span className="text-xs bg-slate-100 text-slate-500 font-bold px-2 py-1 rounded border border-slate-200">
                            算法模型：YOLO-Bridge-V4
                        </span>
                    </div>
                    <div className="flex-1 w-full relative">
                        {isLoading && <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex justify-center items-center"><RefreshCw className="animate-spin text-indigo-600" /></div>}
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorVisual" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                                <RechartsTooltip content={<CustomTooltip />} />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                                <Bar dataKey="AI提取数目" barSize={20} fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                                <Area type="monotone" dataKey="人工确认有效数" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorVisual)" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Right Col: Radar */}
                <Card className="flex flex-col h-96">
                    <div className="mb-2 text-center">
                        <h3 className="font-bold text-slate-800 text-lg">桥梁群多维状态雷达阵图</h3>
                        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Health Radar Anatomy</p>
                    </div>
                    <div className="flex-1 w-full relative -mt-4">
                        {isLoading && <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex justify-center items-center"><RefreshCw className="animate-spin text-indigo-600" /></div>}
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                <Radar name="桥梁群评价(均值)" dataKey="A" stroke="#10b981" strokeWidth={2} fill="#10b981" fillOpacity={0.25} />
                                <RechartsTooltip content={<CustomTooltip />} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Bottom Left: Bridge Types */}
                <Card className="flex flex-col h-80">
                    <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center">
                        <TriangleRight className="mr-2 text-blue-500" /> 区域建档桥梁结构定型
                    </h3>
                    <div className="flex-1 flex flex-row relative items-center">
                        {isLoading && <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex justify-center items-center"><RefreshCw className="animate-spin text-indigo-600" /></div>}
                        <div className="w-1/2 h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={bridgeTypeData}
                                        cx="50%" cy="50%"
                                        innerRadius={50} outerRadius={70}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {bridgeTypeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-1/2 flex flex-col justify-center space-y-3 pl-4">
                            {bridgeTypeData.map((item, i) => (
                                <div key={i} className="flex items-center justify-between text-sm pr-4">
                                    <div className="flex items-center font-bold text-slate-700">
                                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                                        {item.name}
                                    </div>
                                    <div className="font-mono font-black text-slate-500">{item.value}座</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Bottom Right: Defect Locations */}
                <Card className="lg:col-span-2 flex flex-col h-80">
                    <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center">
                        <TriangleRight className="mr-2 text-rose-500" /> 桥梁各构件病害命中布点分布 (基于拓扑重建识别)
                    </h3>
                    <div className="flex-1 w-full relative">
                        {isLoading && <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex justify-center items-center"><RefreshCw className="animate-spin text-indigo-600" /></div>}
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={componentData} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                                <XAxis type="number" hide={true} />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11, fontWeight: 700 }} width={80} />
                                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                                <Bar dataKey="value" barSize={16} radius={[0, 8, 8, 0]}>
                                    {componentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AssetStatsView;
