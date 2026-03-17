import React, { useState } from 'react';
import {
    X, MapPin, Calendar, Activity, Wrench, Clock, FileText,
    AlertTriangle, Camera, Plane, ChevronRight, Layers,
    Thermometer, Wind, Gauge, ArrowRight, Eye, ExternalLink
} from 'lucide-react';
import clsx from 'clsx';
import { MOCK_BRIDGE_DISEASES, MOCK_UAV_FLEET } from '../MockData';

// 获取健康状态颜色
const getHealthColor = (score) => {
    if (score >= 90) return { text: 'text-emerald-400', bg: 'bg-emerald-500', ring: 'ring-emerald-500/30', label: '优秀' };
    if (score >= 80) return { text: 'text-blue-400', bg: 'bg-blue-500', ring: 'ring-blue-500/30', label: '良好' };
    if (score >= 60) return { text: 'text-amber-400', bg: 'bg-amber-500', ring: 'ring-amber-500/30', label: '一般' };
    return { text: 'text-red-400', bg: 'bg-red-500', ring: 'ring-red-500/30', label: '较差' };
};

const getTechGradeLabel = (grade) => {
    const labels = { 1: '一类（完好）', 2: '二类（良好）', 3: '三类（较差）', 4: '四类（差）', 5: '五类（危险）' };
    return labels[grade] || '未评定';
};

const getSeverityStyle = (severity) => {
    switch (severity) {
        case '重度': return 'bg-red-500/20 text-red-400 border-red-500/30';
        case '中度': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
        case '轻度': return 'bg-green-500/20 text-green-400 border-green-500/30';
        default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
};

const BridgeDetailPanel = ({ bridge, onClose, onNavigate }) => {
    const [activeTab, setActiveTab] = useState('info'); // 'info' | 'sensors' | 'diseases'
    
    if (!bridge) return null;
    
    const healthInfo = getHealthColor(bridge.healthScore);
    
    // 筛选此桥梁的病害
    const bridgeDiseases = MOCK_BRIDGE_DISEASES.filter(d => d.bridgeName === bridge.name);
    
    // 查找正在巡检此桥的无人机
    const activeUAV = MOCK_UAV_FLEET.find(u => u.currentBridge === bridge.name && u.status === 'flying');
    
    const tabs = [
        { id: 'info', label: '专业档案', icon: FileText },
        { id: 'sensors', label: '实时监测', icon: Activity },
        { id: 'diseases', label: `病害记录 (${bridgeDiseases.length})`, icon: AlertTriangle },
    ];
    
    return (
        <div className="absolute top-0 right-0 bottom-0 w-[420px] z-30 flex flex-col bg-slate-900/95 backdrop-blur-xl border-l border-slate-700/50 shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/80 to-slate-900/80">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-lg font-bold text-white truncate">{bridge.name}</h2>
                            <span className={clsx("px-2 py-0.5 rounded text-[10px] font-bold border", getSeverityStyle(healthInfo.label === '较差' ? '重度' : healthInfo.label === '一般' ? '中度' : '轻度'))}>
                                {bridge.type}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                            <span className="font-mono">{bridge.bridgeCode}</span>
                            <span className="flex items-center gap-1"><MapPin size={10} />{bridge.crossType}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white flex-shrink-0">
                        <X size={18} />
                    </button>
                </div>
                
                {/* Health Score Bar */}
                <div className="flex items-center gap-4 bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
                    <div className={clsx("w-14 h-14 rounded-xl flex flex-col items-center justify-center ring-2", healthInfo.ring, healthInfo.bg + '/20')}>
                        <span className={clsx("text-xl font-bold font-mono", healthInfo.text)}>{bridge.healthScore}</span>
                        <span className="text-[8px] text-slate-400">BHI</span>
                    </div>
                    <div className="flex-1 space-y-1.5">
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-400">综合健康指数</span>
                            <span className={clsx("font-bold", healthInfo.text)}>{healthInfo.label}</span>
                        </div>
                        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <div className={clsx("h-full rounded-full transition-all", healthInfo.bg)} style={{ width: `${bridge.healthScore}%` }} />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500">
                            <span>BCI: {bridge.bci}</span>
                            <span>技术等级: {getTechGradeLabel(bridge.techGrade)}</span>
                        </div>
                    </div>
                </div>
                
                {/* Active UAV Badge */}
                {activeUAV && (
                    <div className="mt-2 flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-2">
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                        <Plane size={14} className="text-blue-400" />
                        <span className="text-xs text-blue-300">{activeUAV.name} 正在巡检 · {activeUAV.mode}</span>
                        <span className="text-[10px] text-blue-400/60 font-mono ml-auto">ALT {activeUAV.altitude}m</span>
                    </div>
                )}
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-slate-700/50 bg-slate-800/30">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={clsx(
                                "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-all border-b-2",
                                activeTab === tab.id
                                    ? "text-cyan-400 border-cyan-400 bg-cyan-500/5"
                                    : "text-slate-500 border-transparent hover:text-slate-300"
                            )}
                        >
                            <Icon size={13} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>
            
            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {activeTab === 'info' && (
                    <div className="p-4 space-y-4">
                        {/* 基本信息 */}
                        <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                <FileText size={12} /> 基本信息
                            </h4>
                            <div className="bg-slate-800/40 rounded-lg border border-slate-700/50 divide-y divide-slate-700/30">
                                {[
                                    ['桥梁名称', bridge.name],
                                    ['桥梁编号', bridge.bridgeCode],
                                    ['桥型', bridge.type],
                                    ['管养单位', bridge.managementUnit],
                                    ['设计荷载等级', bridge.designLoad],
                                    ['抗震设防烈度', bridge.seismicIntensity],
                                    ['跨越类型', bridge.crossType],
                                    ['施工单位', bridge.constructionUnit],
                                    ['通车日期', bridge.openDate],
                                    ['最近巡检', bridge.lastInspectionDate],
                                ].map(([label, value]) => (
                                    <div key={label} className="flex justify-between items-center px-3 py-2 text-xs">
                                        <span className="text-slate-500">{label}</span>
                                        <span className="text-slate-200 font-medium text-right max-w-[55%] truncate" title={value}>{value || '-'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* 结构尺寸 */}
                        <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                <Layers size={12} /> 结构尺寸
                            </h4>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    ['全长', bridge.length ? `${bridge.length}m` : '-'],
                                    ['主跨径', bridge.mainSpan ? `${bridge.mainSpan}m` : '-'],
                                    ['桥宽', bridge.width ? `${bridge.width}m` : '-'],
                                    ['主塔高/净高', bridge.height ? `${bridge.height}m` : '-'],
                                    ['跨数', bridge.spanCount || '-'],
                                    ['墩台数', bridge.pierCount || '-'],
                                    ['车道数', `${bridge.lanes}车道`],
                                    ['建成年份', bridge.buildYear],
                                    ['桥龄', `${new Date().getFullYear() - bridge.buildYear}年`],
                                ].map(([label, value]) => (
                                    <div key={label} className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/40 text-center">
                                        <div className="text-[10px] text-slate-500 mb-0.5">{label}</div>
                                        <div className="text-sm font-bold text-white font-mono">{value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* 材料与工艺 */}
                        <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                <Wrench size={12} /> 材料与工艺
                            </h4>
                            <div className="bg-slate-800/40 rounded-lg border border-slate-700/50 divide-y divide-slate-700/30">
                                {[
                                    ['上部结构', bridge.superstructureMaterial],
                                    ['下部结构', bridge.substructureMaterial],
                                    ['桥面铺装', bridge.deckPavement],
                                ].map(([label, value]) => (
                                    <div key={label} className="flex justify-between items-center px-3 py-2 text-xs">
                                        <span className="text-slate-500 flex-shrink-0 mr-2">{label}</span>
                                        <span className="text-cyan-400 font-medium text-right">{value || '-'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                
                {activeTab === 'sensors' && (
                    <div className="p-4 space-y-3">
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 mb-1">
                            <Clock size={10} />
                            数据更新于 {new Date().toLocaleTimeString()} · 实时采集
                        </div>
                        {[
                            { label: '阵风风速', value: bridge.sensors.windSpeed, unit: 'm/s', icon: Wind, max: 15, warn: 10, color: 'cyan' },
                            { label: '结构应变', value: bridge.sensors.strain, unit: 'με', icon: Activity, max: 0.5, warn: 0.3, color: 'blue' },
                            { label: '振动幅值', value: bridge.sensors.vibration, unit: 'mm/s', icon: Activity, max: 2, warn: 1.5, color: 'purple' },
                            { label: '主跨挠度', value: bridge.sensors.deflection, unit: 'mm', icon: Gauge, max: 10, warn: 5, color: 'indigo' },
                            { label: '倾斜角', value: bridge.sensors.tiltAngle, unit: '°', icon: Gauge, max: 0.5, warn: 0.2, color: 'teal' },
                            { label: '频率偏移', value: bridge.sensors.freqShift, unit: 'Hz', icon: Activity, max: 1.0, warn: 0.5, color: 'violet' },
                            { label: '氯离子浓度', value: bridge.sensors.chlorideConc, unit: 'kg/m³', icon: Thermometer, max: 1.0, warn: 0.6, color: 'orange' },
                            ...(bridge.sensors.stringTension !== null ? [
                                { label: '索力', value: bridge.sensors.stringTension, unit: 'kN', icon: Gauge, max: 2000, warn: 1500, color: 'emerald' }
                            ] : []),
                        ].map((item, i) => {
                            const Icon = item.icon;
                            const percent = Math.min((item.value / item.max) * 100, 100);
                            const isWarning = item.value >= item.warn;
                            const statusLabel = isWarning ? '偏高' : '正常';
                            const statusColor = isWarning ? 'text-amber-400 bg-amber-500/20' : 'text-emerald-400 bg-emerald-500/20';
                            const barColor = isWarning ? `bg-amber-500` : `bg-${item.color}-500`;
                            
                            return (
                                <div key={i} className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/40 relative overflow-hidden">
                                    <div className="absolute right-2 top-2 opacity-5">
                                        <Icon size={36} />
                                    </div>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                                            <Icon size={11} className={`text-${item.color}-400`} />
                                            {item.label}
                                        </span>
                                        <span className={clsx("text-[10px] px-1.5 py-0.5 rounded font-bold", statusColor)}>
                                            {statusLabel}
                                        </span>
                                    </div>
                                    <div className="flex items-end gap-1 mb-2">
                                        <span className="text-xl font-extrabold text-white font-mono">{item.value}</span>
                                        <span className="text-[10px] text-slate-500 mb-0.5">{item.unit}</span>
                                    </div>
                                    <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                                        <div className={clsx("h-full rounded-full transition-all", isWarning ? 'bg-amber-500' : 'bg-cyan-500')} style={{ width: `${percent}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                
                {activeTab === 'diseases' && (
                    <div className="p-4 space-y-3">
                        {bridgeDiseases.length === 0 ? (
                            <div className="text-center py-12 text-slate-500">
                                <AlertTriangle size={32} className="mx-auto mb-3 opacity-30" />
                                <p className="text-sm">暂未发现病害记录</p>
                            </div>
                        ) : (
                            <>
                                {/* 病害统计 */}
                                <div className="grid grid-cols-3 gap-2 mb-2">
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 text-center">
                                        <div className="text-lg font-bold text-red-400 font-mono">{bridgeDiseases.filter(d => d.severity === '重度').length}</div>
                                        <div className="text-[10px] text-red-400/70">重度</div>
                                    </div>
                                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 text-center">
                                        <div className="text-lg font-bold text-amber-400 font-mono">{bridgeDiseases.filter(d => d.severity === '中度').length}</div>
                                        <div className="text-[10px] text-amber-400/70">中度</div>
                                    </div>
                                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2 text-center">
                                        <div className="text-lg font-bold text-green-400 font-mono">{bridgeDiseases.filter(d => d.severity === '轻度').length}</div>
                                        <div className="text-[10px] text-green-400/70">轻度</div>
                                    </div>
                                </div>
                                
                                {/* 病害列表 */}
                                {bridgeDiseases.map(disease => {
                                    // 查找发现此病害的无人机
                                    const discovererUAV = MOCK_UAV_FLEET.find(u => u.currentBridge === bridge.name) || MOCK_UAV_FLEET[0];
                                    
                                    return (
                                        <div key={disease.id} className="bg-slate-800/50 rounded-lg border border-slate-700/40 overflow-hidden hover:border-cyan-500/30 transition-colors group">
                                            {/* 病害图片 + 标签 */}
                                            <div className="relative h-32 bg-slate-800">
                                                <img
                                                    src={disease.imageUrl}
                                                    alt={disease.type}
                                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent" />
                                                
                                                {/* 标签 */}
                                                <div className="absolute top-2 left-2 flex gap-1.5">
                                                    <span className={clsx("px-1.5 py-0.5 rounded text-[10px] font-bold border", getSeverityStyle(disease.severity))}>
                                                        {disease.severity}
                                                    </span>
                                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-900/80 text-white border border-slate-600">
                                                        {disease.type}
                                                    </span>
                                                </div>
                                                
                                                {/* 置信度 */}
                                                <div className="absolute top-2 right-2">
                                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-900/80 text-cyan-300 border border-cyan-500/30">
                                                        AI {(disease.confidence * 100).toFixed(0)}%
                                                    </span>
                                                </div>
                                                
                                                {/* 底部信息 */}
                                                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                                                    <div className="text-white">
                                                        <div className="text-xs font-bold">{disease.component}</div>
                                                        <div className="text-[10px] text-slate-300">{disease.id}</div>
                                                    </div>
                                                    <span className={clsx("px-1.5 py-0.5 rounded text-[10px] font-medium",
                                                        disease.status === '已修复' ? 'bg-green-500/20 text-green-400' :
                                                        disease.status === '维修中' ? 'bg-blue-500/20 text-blue-400' :
                                                        disease.status === '已上报' ? 'bg-amber-500/20 text-amber-400' :
                                                        'bg-red-500/20 text-red-400'
                                                    )}>
                                                        {disease.status}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            {/* 详情 */}
                                            <div className="p-3 space-y-2">
                                                {/* 无人机巡检信息 */}
                                                <div className="flex items-center gap-2 text-[10px] text-slate-400 bg-slate-700/30 rounded px-2 py-1.5">
                                                    <Plane size={11} className="text-blue-400" />
                                                    <span>由 <span className="text-blue-300 font-medium">{discovererUAV.name}</span> ({discovererUAV.model.split(' ')[0]}) 发现</span>
                                                </div>
                                                
                                                {/* 发现时间 + 位置 */}
                                                <div className="flex justify-between text-[10px] text-slate-500">
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={10} />
                                                        {disease.time}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MapPin size={10} />
                                                        {disease.coord[0].toFixed(4)}, {disease.coord[1].toFixed(4)}
                                                    </span>
                                                </div>
                                                
                                                {/* 量化数据 */}
                                                {disease.quantification && (
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {Object.entries(disease.quantification).map(([k, v]) => {
                                                            const labels = {
                                                                length_m: '长度', max_width_mm: '宽度', depth_mm: '深度',
                                                                area_m2: '面积', rust_grade: '锈蚀等级', exposed_count: '钢筋裸露',
                                                                corrosion_rate: '腐蚀率', moisture_level: '潮湿程度',
                                                            };
                                                            return (
                                                                <span key={k} className="px-1.5 py-0.5 rounded bg-slate-700/50 text-[10px] text-cyan-400 font-mono">
                                                                    {labels[k] || k}: {v}
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                                
                                                {/* AI建议 */}
                                                <div className="text-[10px] text-slate-400 bg-slate-800/50 rounded px-2 py-1.5 border-l-2 border-cyan-500/50">
                                                    💡 {disease.advice}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        )}
                    </div>
                )}
            </div>
            
            {/* Footer Actions */}
            <div className="p-3 border-t border-slate-700/50 bg-slate-800/50 flex gap-2">
                <button
                    onClick={() => {
                        onClose();
                        onNavigate?.('bridge-assets', { bridgeId: bridge.id });
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-colors shadow-lg shadow-cyan-900/30"
                >
                    <ExternalLink size={14} />
                    查看详细台账
                </button>
                <button
                    onClick={() => {
                        onClose();
                        onNavigate?.('work-orders', { sourceType: 'bridge', initialTarget: bridge });
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-bold transition-colors border border-slate-600"
                >
                    <Wrench size={14} />
                    发起维修工单
                </button>
            </div>
        </div>
    );
};

export default BridgeDetailPanel;
