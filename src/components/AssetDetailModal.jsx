import React from 'react';
import { X, MapPin, Calendar, Activity, Wrench, Clock, FileText, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AssetDetailModal = ({ asset, onClose, onNavigate }) => {
    if (!asset) return null;

    // Mock health history data
    const healthData = [
        { name: '1月', score: 95 },
        { name: '2月', score: 94 },
        { name: '3月', score: 92 },
        { name: '4月', score: 88 },
        { name: '5月', score: 90 },
        { name: '6月', score: 85 },
    ];

    // Mock maintenance history
    const history = [
        { date: '2025-05-12', type: '日常巡检', desc: '例行检查，外观正常，反光膜完好', status: 'normal' },
        { date: '2025-03-15', type: '专项维护', desc: '紧固螺栓，清洗表面污渍', status: 'fixed' },
        { date: '2024-11-20', type: '首次安装', desc: '设施安装验收通过，投入使用', status: 'new' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div className="flex items-center space-x-4">
                        <div className={clsx("w-10 h-10 rounded-lg flex items-center justify-center shadow-sm",
                            asset.status === '正常' ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"
                        )}>
                            <Activity size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 flex items-center">
                                {asset.type}
                                <span className="ml-3 text-sm font-normal text-slate-500 font-mono px-2 py-0.5 bg-slate-100 rounded border border-slate-200">
                                    {asset.code}
                                </span>
                            </h2>
                            <div className="flex items-center text-sm text-slate-500 mt-1">
                                <MapPin size={14} className="mr-1" />
                                {asset.road} {asset.section} ({asset.mileage})
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Left Column: Basic Info & Image */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Image */}
                            <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200 relative group">
                                <img
                                    src="https://placehold.co/600x400/e2e8f0/64748b?text=Asset+Photo"
                                    alt="Asset"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                    <button className="opacity-0 group-hover:opacity-100 bg-white/90 text-slate-800 px-3 py-1.5 rounded-md text-sm font-medium shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all">
                                        查看大图
                                    </button>
                                </div>
                            </div>

                            {/* Attributes */}
                            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 space-y-3">
                                <h3 className="font-bold text-slate-800 text-sm mb-3">基本属性</h3>
                                <div className="flex justify-between text-sm border-b border-slate-200/50 pb-2">
                                    <span className="text-slate-500">安装时间</span>
                                    <span className="font-medium text-slate-700">2024-11-20</span>
                                </div>
                                <div className="flex justify-between text-sm border-b border-slate-200/50 pb-2">
                                    <span className="text-slate-500">所属管养单位</span>
                                    <span className="font-medium text-slate-700">西湖区市政工程处</span>
                                </div>
                                <div className="flex justify-between text-sm border-b border-slate-200/50 pb-2">
                                    <span className="text-slate-500">预估寿命</span>
                                    <span className="font-medium text-slate-700">10 年</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">当前状态</span>
                                    <span className={clsx("font-medium px-2 py-0.5 rounded text-xs",
                                        asset.status === '正常' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                                    )}>
                                        {asset.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Health & History */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Health Chart */}
                            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-slate-800 text-sm flex items-center">
                                        <Activity size={16} className="mr-2 text-blue-500" />
                                        健康度趋势
                                    </h3>
                                    <span className="text-xs text-slate-400">近 6 个月</span>
                                </div>
                                <div className="h-48 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={healthData}>
                                            <defs>
                                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                            <YAxis hide domain={[60, 100]} />
                                            <Tooltip />
                                            <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Maintenance History */}
                            <div className="bg-white rounded-lg">
                                <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center">
                                    <Clock size={16} className="mr-2 text-purple-500" />
                                    全生命周期记录
                                </h3>
                                <div className="relative pl-4 border-l-2 border-slate-100 space-y-6">
                                    {history.map((record, idx) => (
                                        <div key={idx} className="relative pl-6">
                                            <div className={clsx("absolute -left-[29px] top-0 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center",
                                                record.status === 'normal' ? "bg-green-500" :
                                                    record.status === 'fixed' ? "bg-blue-500" : "bg-slate-400"
                                            )}>
                                                {record.status === 'normal' && <CheckCircle2 size={12} className="text-white" />}
                                                {record.status === 'fixed' && <Wrench size={10} className="text-white" />}
                                                {record.status === 'new' && <FileText size={10} className="text-white" />}
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                                <div className="space-y-1">
                                                    <div className="font-bold text-slate-800 text-sm">{record.type}</div>
                                                    <div className="text-slate-600 text-xs leading-relaxed">{record.desc}</div>
                                                </div>
                                                <div className="text-xs text-slate-400 font-mono mt-1 sm:mt-0">{record.date}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end space-x-3">
                    <button className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 text-sm font-medium hover:bg-white hover:border-slate-400 transition-colors">
                        导出档案
                    </button>
                    <button
                        onClick={() => {
                            if (onNavigate) {
                                onNavigate('work-orders', {
                                    action: 'create',
                                    sourceType: 'asset',
                                    initialTarget: asset
                                });
                            }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors flex items-center"
                    >
                        <Wrench size={16} className="mr-2" />
                        发起维护工单
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AssetDetailModal;
