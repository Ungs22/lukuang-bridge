import React from 'react';
import { Camera, MoreHorizontal, Settings, Ruler, Cpu, CheckCircle2, AlertTriangle, Layers, Maximize } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DISEASE_TYPES } from '../MockData';

const DiseaseDetailModal = ({ disease, onClose, onNavigate }) => {
    if (!disease) return null;

    // 获取病害类型对应的颜色和图标信息
    const typeInfo = DISEASE_TYPES.find(t => t.name === disease.type) || { color: '#06b6d4', icon: AlertTriangle };
    const TypeIcon = typeInfo.icon;

    // 模拟的桥梁病害劣化趋势图
    const historyData = [
        { time: 'T-3个月', sz: disease.quantification?.area_m2 ? disease.quantification.area_m2 * 0.4 : 0.1 }, 
        { time: 'T-1个月', sz: disease.quantification?.area_m2 ? disease.quantification.area_m2 * 0.7 : 0.3 }, 
        { time: '当前', sz: disease.quantification?.area_m2 || 0.5 }
    ];

    // 获取严重程度样式
    const getSeverityColor = (severity) => {
        switch (severity) {
            case '重度': return 'text-red-500 bg-red-500/10 border-red-500/30';
            case '中度': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
            case '轻度': return 'text-green-500 bg-green-500/10 border-green-500/30';
            default: return 'text-slate-400';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-slate-900 rounded-xl border border-slate-700 shadow-2xl w-[900px] max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 flex justify-between items-start border-b border-slate-700 bg-slate-800/50">
                    <div>
                        <div className="flex items-center space-x-3 mb-1">
                            <h2 className="text-xl font-bold text-white flex items-center">
                                <TypeIcon size={20} className="mr-2" style={{ color: typeInfo.color }} />
                                病害智能量化档案
                            </h2>
                            <span className={ `px-2 py-0.5 rounded text-xs font-bold border ${getSeverityColor(disease.severity)}` }>
                                {disease.type} · {disease.severity}
                            </span>
                        </div>
                        <div className="flex space-x-4 text-xs text-slate-400 font-mono mt-2">
                            <span>UID: {disease.id || disease.code}</span>
                            <span>检测时间: {disease.time || disease.detectTime}</span>
                            <span>所属桥梁: {disease.bridgeName || disease.road}</span>
                            <span>构件: {disease.component}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white">
                        <MoreHorizontal size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-900 text-slate-300">
                    {/* Left: AI Vision */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <h3 className="font-bold text-white flex items-center">
                                <Camera size={16} className="mr-2 text-cyan-500" />
                                无人机 AI 视觉识别底图
                            </h3>
                            <span className="text-xs text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-1 rounded flex items-center">
                                <Cpu size={12} className="mr-1" />
                                置信度: {(disease.confidence * 100).toFixed(1)}%
                            </span>
                        </div>
                        <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-slate-800 aspect-video group shadow-lg">
                            <img src={disease.imageUrl || '/mock-bridges/image_01.jpg'} alt="Bridge Surface" className="w-full h-full object-cover" />

                            {/* Bounding Box / Polygon Overlay (Mock) */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-lg">
                                <polygon points="30%,40% 45%,35% 50%,50% 35%,55%" fill={typeInfo.color + "40"} stroke={typeInfo.color} strokeWidth="2" strokeLinejoin="round" className="animate-pulse" />
                            </svg>

                            {/* Label */}
                            <div className="absolute top-[32%] left-[45%] bg-slate-900/80 backdrop-blur border border-slate-600 text-white text-[10px] px-2 py-1 rounded shadow-lg flex items-center">
                                <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: typeInfo.color }}></div>
                                {disease.type}
                            </div>
                            
                            <button className="absolute bottom-2 right-2 p-1.5 bg-slate-900/80 backdrop-blur rounded hover:bg-slate-700 transition duration-200">
                                <Maximize size={16} className="text-white" />
                            </button>
                        </div>
                        
                        {/* 物理量化数据栏 */}
                        <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
                                <Ruler size={14} className="mr-1 text-slate-400" /> 物理量化与空间几何特征
                            </h4>
                            <div className="grid grid-cols-3 gap-2 text-center text-sm">
                                {disease.quantification?.length_m && (
                                    <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
                                        <div className="text-[10px] text-slate-500">走向长度</div>
                                        <div className="font-bold text-cyan-400 font-mono">{disease.quantification.length_m} m</div>
                                    </div>
                                )}
                                {disease.quantification?.max_width_mm && (
                                    <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
                                        <div className="text-[10px] text-slate-500">最大开裂宽度</div>
                                        <div className="font-bold text-cyan-400 font-mono">{disease.quantification.max_width_mm} mm</div>
                                    </div>
                                )}
                                {disease.quantification?.area_m2 && (
                                    <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
                                        <div className="text-[10px] text-slate-500">病害覆盖面积</div>
                                        <div className="font-bold text-cyan-400 font-mono">{disease.quantification.area_m2} m²</div>
                                    </div>
                                )}
                                {disease.quantification?.depth_mm && (
                                    <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
                                        <div className="text-[10px] text-slate-500">最大深度</div>
                                        <div className="font-bold text-cyan-400 font-mono">{disease.quantification.depth_mm} mm</div>
                                    </div>
                                )}
                                {disease.quantification?.corrosion_grade && (
                                    <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
                                        <div className="text-[10px] text-slate-500">锈蚀评估等级</div>
                                        <div className="font-bold text-cyan-400 font-mono">{disease.quantification.corrosion_grade}</div>
                                    </div>
                                )}
                                {disease.quantification?.rebar_count && (
                                    <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
                                        <div className="text-[10px] text-slate-500">裸露钢筋根数</div>
                                        <div className="font-bold text-cyan-400 font-mono">{disease.quantification.rebar_count} 根</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Analysis */}
                    <div className="space-y-4">
                        <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50 h-56 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center">
                                <Layers size={16} className="mr-2 text-blue-400" />
                                同类型病害历史演变趋势
                            </h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={historyData} margin={{ top: 5, right: 20, left: -25, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} stroke="#475569" />
                                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} stroke="#475569" />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} itemStyle={{ color: typeInfo.color }} />
                                    <Line type="monotone" dataKey="sz" name="量化指标估值" stroke={typeInfo.color} strokeWidth={3} dot={{ r: 4, fill: '#0f172a', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Timeline Logic Step */}
                        <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                            <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-mono">
                                <span>发现 (AI Detect)</span>
                                <span>复核 (Review)</span>
                                <span>建档 (Logged)</span>
                                <span>派单 (Dispatch)</span>
                            </div>
                            <div className="relative h-2 bg-slate-700 rounded-full">
                                <div className="absolute top-0 left-0 h-full w-2/3 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
                                <div className="absolute top-0 left-0 w-3 h-3 bg-cyan-400 rounded-full -mt-0.5 border-2 border-slate-900 shadow"></div>
                                <div className="absolute top-0 left-1/3 w-3 h-3 bg-cyan-400 rounded-full -mt-0.5 border-2 border-slate-900 shadow"></div>
                                <div className="absolute top-0 left-2/3 w-3 h-3 bg-white rounded-full -mt-0.5 border-2 border-cyan-500 shadow animate-pulse"></div>
                            </div>
                            <div className="mt-4 p-3 bg-slate-900/50 rounded border border-slate-700">
                                <h4 className="text-xs font-bold text-slate-400 mb-1">AI 修复建议</h4>
                                <p className="text-sm text-slate-300 leading-relaxed">{disease.advice}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-800/80 px-6 py-4 border-t border-slate-700 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-700 transition">
                        关闭档案
                    </button>
                    <button className="px-4 py-2 border border-cyan-900 text-cyan-400 bg-cyan-900/20 rounded-lg text-sm font-medium hover:bg-cyan-900/40 transition">
                        进入复核沙盒
                    </button>
                    <button
                        onClick={() => {
                            if (onNavigate) {
                                onClose();
                                onNavigate('work-orders', { initialDisease: disease });
                            }
                        }}
                        className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium shadow-md shadow-cyan-900/50 hover:bg-cyan-500 flex items-center transition"
                    >
                        <Settings size={16} className="mr-2" />
                        生成桥梁维修大修工单
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DiseaseDetailModal;
