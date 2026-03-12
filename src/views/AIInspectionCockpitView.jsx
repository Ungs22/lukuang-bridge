import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    Play, Pause, SkipBack, SkipForward, Volume2, Maximize,
    Eye, EyeOff, Camera, Battery, Wifi, MapPin,
    AlertTriangle, ChevronRight, Download, Clock,
    Target, Crosshair, Map as MapIcon,
    Radio, Calendar, Sun,
    Thermometer, Gauge, Activity, Cpu, Signal, Layers, Plane
} from 'lucide-react';
import clsx from 'clsx';
import { MOCK_UAV_FLEET, AI_BRIDGE_INSPECTION_DATA, getAllBridgeDetections, DISEASE_TYPES } from '../MockData';

// --- AI 桥梁检测工作台 ---
const AIInspectionCockpitView = ({ onNavigate }) => {
    // --- State ---
    const [selectedUavIndex, setSelectedUavIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
    const [showAIMask, setShowAIMask] = useState(true);
    const [selectedDetection, setSelectedDetection] = useState(null);
    const canvasRef = useRef(null);
    const containerRef = useRef(null);

    const currentUav = MOCK_UAV_FLEET[selectedUavIndex];
    const inspectionData = AI_BRIDGE_INSPECTION_DATA;
    const allFrames = inspectionData.frames || [];
    const currentFrame = allFrames[currentFrameIndex] || null;
    const allDetections = getAllBridgeDetections();

    // --- 帧播放控制 ---
    useEffect(() => {
        let timer;
        if (isPlaying && allFrames.length > 0) {
            timer = setInterval(() => {
                setCurrentFrameIndex(prev => {
                    if (prev >= allFrames.length - 1) {
                        setIsPlaying(false);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 2000);
        }
        return () => clearInterval(timer);
    }, [isPlaying, allFrames.length]);

    // --- Canvas 绘制掩膜 ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !currentFrame) return;

        const container = containerRef.current;
        if (!container) return;
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!showAIMask) return;

        currentFrame.diseases?.forEach(det => {
            if (!det.mask_polygon || det.mask_polygon.length < 3) return;

            const typeInfo = DISEASE_TYPES.find(t => t.name === det.type);
            const color = typeInfo ? typeInfo.color : '#06b6d4';

            // 解析颜色并设置透明度
            ctx.beginPath();
            const firstPt = det.mask_polygon[0];
            ctx.moveTo(firstPt[0] * canvas.width, firstPt[1] * canvas.height);
            det.mask_polygon.slice(1).forEach(pt => {
                ctx.lineTo(pt[0] * canvas.width, pt[1] * canvas.height);
            });
            ctx.closePath();

            const isSelected = selectedDetection?.id === det.id;
            const hasSelection = !!selectedDetection;
            const alpha = isSelected ? '80' : (hasSelection ? '15' : '40');
            const strokeAlpha = isSelected ? 'FF' : (hasSelection ? '40' : 'FF');

            // 填充半透明
            ctx.fillStyle = color + alpha;
            ctx.fill();

            // 描边
            ctx.strokeStyle = color + strokeAlpha;
            ctx.lineWidth = isSelected ? 3 : 2;
            ctx.stroke();

            // 发光效果 (如果选中)
            if (isSelected) {
                ctx.shadowColor = color;
                ctx.shadowBlur = 10;
                ctx.stroke();
                ctx.shadowBlur = 0; // reset
            }

            // 标签
            const centerX = det.mask_polygon.reduce((s, p) => s + p[0], 0) / det.mask_polygon.length * canvas.width;
            const centerY = det.mask_polygon.reduce((s, p) => s + p[1], 0) / det.mask_polygon.length * canvas.height;

            ctx.font = 'bold 11px sans-serif';
            const label = `${det.type} [${(det.confidence * 100).toFixed(0)}%]`;
            const textWidth = ctx.measureText(label).width;

            ctx.fillStyle = 'rgba(0,0,0,0.75)';
            ctx.fillRect(centerX - textWidth / 2 - 4, centerY - 8, textWidth + 8, 18);
            ctx.fillStyle = color;
            ctx.fillText(label, centerX - textWidth / 2, centerY + 5);
        });
    }, [currentFrame, showAIMask]);

    // --- 病害严重程度颜色 ---
    const getSeverityColor = (severity) => {
        switch (severity) {
            case '重度': return 'text-red-500 bg-red-500/10 border-red-500/30';
            case '中度': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
            case '轻度': return 'text-green-500 bg-green-500/10 border-green-500/30';
            default: return 'text-slate-400';
        }
    };

    return (
        <div className="flex h-full bg-slate-950 text-white overflow-hidden">
            {/* 左侧主视频区 */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* 顶部信息栏 */}
                <div className="h-12 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <Plane size={16} className="text-cyan-400" />
                            <span className="font-bold text-sm">{currentUav.name}</span>
                            <span className="text-xs text-slate-400">({currentUav.id})</span>
                        </div>
                        <div className="h-4 w-px bg-slate-700"></div>
                        <div className="flex items-center space-x-1 text-xs text-slate-400">
                            <MapPin size={12} className="text-cyan-500" />
                            <span>{inspectionData.bridgeName}</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-slate-400">
                        <div className="flex items-center space-x-1">
                            <Battery size={14} className="text-green-500" />
                            <span>{currentUav.battery}%</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Signal size={14} className="text-cyan-500" />
                            <span>{currentUav.signal?.strength || 100}%</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Gauge size={14} />
                            <span>高度 {currentUav.altitude}m</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Thermometer size={14} />
                            <span>{currentUav.temperature}°C</span>
                        </div>
                    </div>
                </div>

                {/* 视频画面区域 */}
                <div className="flex-1 relative bg-slate-900" ref={containerRef}>
                    {/* 模拟检测画面 — 用渐变背景模拟桥梁 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-full max-w-lg mx-auto">
                                {/* 模拟桥梁构件 */}
                                <div className="bg-gradient-to-b from-slate-500 to-slate-600 h-48 rounded-lg shadow-inner relative overflow-hidden">
                                    <div className="absolute inset-2 border border-dashed border-slate-400/30 rounded"></div>
                                    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-slate-700/50"></div>
                                    <div className="absolute top-4 left-4 text-xs text-slate-300/60 font-mono">
                                        UAV 实时画面 · {inspectionData.bridgeName}
                                    </div>
                                    <div className="absolute bottom-4 right-4 text-xs text-slate-300/60 font-mono">
                                        帧 {currentFrameIndex + 1}/{allFrames.length}
                                    </div>
                                </div>
                            </div>
                            {currentFrame && (
                                <div className="mt-2 text-xs text-slate-400">
                                    {currentFrame.time}s · 构件: {currentFrame.diseases?.[0]?.component || '-'} · 检出 {currentFrame.diseases?.length || 0} 个病害
                                </div>
                            )}
                        </div>
                    </div>

                    {/* AI 掩膜 Canvas */}
                    <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

                    {/* AI 检测状态角标 */}
                    <div className="absolute top-4 left-4 z-20 flex items-center space-x-2">
                        <div className={clsx(
                            "flex items-center space-x-2 px-3 py-1.5 rounded-lg border backdrop-blur-sm text-xs font-bold",
                            showAIMask
                                ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                                : "bg-slate-800/80 border-slate-700 text-slate-400"
                        )}>
                            <Cpu size={14} />
                            <span>AI {showAIMask ? 'ON' : 'OFF'}</span>
                        </div>
                        <button
                            onClick={() => setShowAIMask(!showAIMask)}
                            className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-white transition-colors"
                        >
                            {showAIMask ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                    </div>

                    {/* 当前帧检测结果悬浮 */}
                    {currentFrame && currentFrame.diseases?.length > 0 && showAIMask && (
                        <div className="absolute top-4 right-4 z-20 bg-slate-900/90 backdrop-blur-md rounded-lg border border-slate-700 p-3 min-w-[220px]">
                            <div className="text-xs font-bold text-cyan-400 mb-2 flex items-center">
                                <Target size={14} className="mr-1" />
                                当前帧检测 ({currentFrame.diseases?.length || 0})
                            </div>
                            <div className="space-y-1.5">
                                {currentFrame.diseases?.map((det, i) => (
                                    <div key={i}
                                        className="flex items-center justify-between text-xs cursor-pointer hover:bg-slate-800 rounded px-2 py-1 transition-colors"
                                        onClick={() => setSelectedDetection(det)}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: DISEASE_TYPES.find(t => t.name === det.type)?.color || '#06b6d4' }}></div>
                                            <span className="text-slate-200">{det.type}</span>
                                        </div>
                                        <span className="text-slate-400">{(det.confidence * 100).toFixed(0)}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* 播放控制栏 */}
                <div className="h-14 bg-slate-900 border-t border-slate-800 flex items-center px-4 space-x-4">
                    <div className="flex items-center space-x-2">
                        <button onClick={() => setCurrentFrameIndex(Math.max(0, currentFrameIndex - 1))}
                            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                            <SkipBack size={16} />
                        </button>
                        <button onClick={() => setIsPlaying(!isPlaying)}
                            className="p-2 rounded-full bg-cyan-600 text-white hover:bg-cyan-500 transition-colors">
                            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                        <button onClick={() => setCurrentFrameIndex(Math.min(allFrames.length - 1, currentFrameIndex + 1))}
                            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                            <SkipForward size={16} />
                        </button>
                    </div>

                    {/* 时间轴 */}
                    <div className="flex-1 flex items-center space-x-3">
                        <span className="text-xs text-slate-400 w-10 text-right font-mono">{currentFrame?.time ? currentFrame.time + 's' : '--:--'}</span>
                        <div className="flex-1 relative">
                            <div className="w-full h-1.5 bg-slate-700 rounded-full">
                                <div className="h-full bg-cyan-500 rounded-full transition-all" style={{ width: `${allFrames.length > 0 ? (currentFrameIndex / (allFrames.length - 1)) * 100 : 0}%` }}></div>
                            </div>
                            {/* 病害标记 */}
                            {allFrames.map((frame, idx) => (
                                frame.diseases?.length > 0 && (
                                    <div key={idx}
                                        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500 cursor-pointer hover:scale-150 transition-transform"
                                        style={{ left: `${(idx / (allFrames.length - 1)) * 100}%` }}
                                        onClick={() => setCurrentFrameIndex(idx)}
                                    ></div>
                                )
                            ))}
                        </div>
                        <span className="text-xs text-slate-400 font-mono">
                            {currentFrameIndex + 1}/{allFrames.length}
                        </span>
                    </div>

                    <div className="flex items-center space-x-2 text-slate-400">
                        <button className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors">
                            <Camera size={16} />
                        </button>
                        <button className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors">
                            <Download size={16} />
                        </button>
                        <button className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors">
                            <Maximize size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* 右侧面板 */}
            <div className="w-[380px] bg-slate-900 border-l border-slate-800 flex flex-col overflow-hidden">
                {/* 无人机选择 */}
                <div className="p-3 border-b border-slate-800">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">无人机列表</div>
                    <div className="flex space-x-2 overflow-x-auto pb-1">
                        {MOCK_UAV_FLEET.map((uav, idx) => (
                            <button key={uav.id}
                                onClick={() => { setSelectedUavIndex(idx); setCurrentFrameIndex(0); }}
                                className={clsx(
                                    "flex-shrink-0 px-3 py-2 rounded-lg border text-xs font-medium transition-all",
                                    idx === selectedUavIndex
                                        ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                                        : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600"
                                )}
                            >
                                <div className="flex items-center space-x-1.5">
                                    <div className={clsx("w-2 h-2 rounded-full",
                                        uav.status === 'flying' ? 'bg-green-400 animate-pulse' :
                                        uav.status === 'idle' ? 'bg-slate-500' : 'bg-orange-400'
                                    )}></div>
                                    <span>{uav.name}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 巡检信息 */}
                <div className="p-3 border-b border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">巡检信息</div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700/50">
                            <div className="text-[10px] text-slate-500">目标桥梁</div>
                            <div className="text-sm font-bold text-white truncate">{inspectionData.bridgeName}</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700/50">
                            <div className="text-[10px] text-slate-500">巡检日期</div>
                            <div className="text-sm font-bold text-white">{inspectionData.inspectionDate}</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700/50">
                            <div className="text-[10px] text-slate-500">检测帧数</div>
                            <div className="text-sm font-bold text-cyan-400">{allFrames.length}</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700/50">
                            <div className="text-[10px] text-slate-500">发现病害</div>
                            <div className="text-sm font-bold text-red-400">{allDetections.length}</div>
                        </div>
                    </div>
                </div>

                {/* 检测结果列表 */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-3">
                        <div className="flex items-center justify-between mb-3">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">全部病害检测结果</div>
                            <span className="text-[10px] px-2 py-0.5 bg-red-500/20 text-red-400 rounded border border-red-500/30">{allDetections.length}</span>
                        </div>

                        <div className="space-y-2">
                            {allDetections.map((det, idx) => {
                                const typeInfo = DISEASE_TYPES.find(t => t.name === det.type);
                                return (
                                    <div key={idx}
                                        className={clsx(
                                            "p-3 rounded-lg border cursor-pointer transition-all",
                                            selectedDetection === det
                                                ? "bg-cyan-500/10 border-cyan-500/40"
                                                : "bg-slate-800/50 border-slate-700/50 hover:border-slate-600"
                                        )}
                                        onClick={() => {
                                            setSelectedDetection(det);
                                            // 跳转到对应帧
                                            const frameIdx = allFrames.findIndex(f => f.diseases?.includes(det));
                                            if (frameIdx >= 0) setCurrentFrameIndex(frameIdx);
                                        }}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: typeInfo?.color || '#06b6d4' }}></div>
                                                <span className="text-sm font-bold text-white">{det.type}</span>
                                            </div>
                                            <span className={clsx("text-[10px] px-1.5 py-0.5 rounded border", getSeverityColor(det.severity))}>
                                                {det.severity}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
                                            <div className="text-slate-500">置信度</div>
                                            <div className="text-slate-300 font-medium">{(det.confidence * 100).toFixed(1)}%</div>
                                            {det.quantification?.length_m && (
                                                <>
                                                    <div className="text-slate-500">裂缝长度</div>
                                                    <div className="text-slate-300 font-mono">{det.quantification.length_m}m</div>
                                                </>
                                            )}
                                            {det.quantification?.max_width_mm && (
                                                <>
                                                    <div className="text-slate-500">最大宽度</div>
                                                    <div className="text-slate-300 font-mono">{det.quantification.max_width_mm}mm</div>
                                                </>
                                            )}
                                            {det.quantification?.area_m2 && (
                                                <>
                                                    <div className="text-slate-500">面积</div>
                                                    <div className="text-slate-300 font-mono">{det.quantification.area_m2}m²</div>
                                                </>
                                            )}
                                            {det.quantification?.corrosion_grade && (
                                                <>
                                                    <div className="text-slate-500">锈蚀等级</div>
                                                    <div className="text-slate-300 font-mono">{det.quantification.corrosion_grade}</div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* 底部操作 */}
                <div className="p-3 border-t border-slate-800 space-y-2">
                    <button className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-sm transition-colors flex items-center justify-center"
                        onClick={() => onNavigate('disease-list')}>
                        <Layers size={16} className="mr-2" />
                        查看病害台账
                    </button>
                    <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg text-sm transition-colors border border-slate-700 flex items-center justify-center"
                        onClick={() => onNavigate('work-orders')}>
                        <Download size={16} className="mr-2" />
                        导出检测报告
                    </button>
                </div>
            </div>

            {/* 病害详情弹窗 */}
            {selectedDetection && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
                    onClick={() => setSelectedDetection(null)}>
                    <div className="bg-slate-900 rounded-xl border border-slate-700 shadow-2xl max-w-lg w-full mx-4 p-6"
                        onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white flex items-center">
                                <AlertTriangle size={20} className="mr-2 text-orange-400" />
                                病害详细信息
                            </h3>
                            <button onClick={() => setSelectedDetection(null)} className="text-slate-400 hover:text-white text-xl">×</button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-xs text-slate-500 mb-1">病害类型</div>
                                    <div className="text-white font-bold">{selectedDetection.type}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 mb-1">严重等级</div>
                                    <span className={clsx("text-sm px-2 py-1 rounded border font-medium", getSeverityColor(selectedDetection.severity))}>
                                        {selectedDetection.severity}
                                    </span>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 mb-1">AI 置信度</div>
                                    <div className="text-cyan-400 font-bold text-lg">{(selectedDetection.confidence * 100).toFixed(1)}%</div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 mb-1">掩膜顶点数</div>
                                    <div className="text-white font-mono">{selectedDetection.mask_polygon?.length || 0}</div>
                                </div>
                            </div>

                            {selectedDetection.quantification && (
                                <div>
                                    <div className="text-xs text-slate-500 mb-2 font-bold uppercase tracking-wider">物理量化数据</div>
                                    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 grid grid-cols-2 gap-3 text-sm">
                                        {selectedDetection.quantification.length_m && (
                                            <div>
                                                <div className="text-slate-500 text-xs">裂缝长度</div>
                                                <div className="text-white font-bold font-mono">{selectedDetection.quantification.length_m} m</div>
                                            </div>
                                        )}
                                        {selectedDetection.quantification.max_width_mm && (
                                            <div>
                                                <div className="text-slate-500 text-xs">最大宽度</div>
                                                <div className="text-white font-bold font-mono">{selectedDetection.quantification.max_width_mm} mm</div>
                                            </div>
                                        )}
                                        {selectedDetection.quantification.area_m2 && (
                                            <div>
                                                <div className="text-slate-500 text-xs">剥落面积</div>
                                                <div className="text-white font-bold font-mono">{selectedDetection.quantification.area_m2} m²</div>
                                            </div>
                                        )}
                                        {selectedDetection.quantification.depth_mm && (
                                            <div>
                                                <div className="text-slate-500 text-xs">最大深度</div>
                                                <div className="text-white font-bold font-mono">{selectedDetection.quantification.depth_mm} mm</div>
                                            </div>
                                        )}
                                        {selectedDetection.quantification.rebar_count && (
                                            <div>
                                                <div className="text-slate-500 text-xs">裸露根数</div>
                                                <div className="text-white font-bold font-mono">{selectedDetection.quantification.rebar_count} 根</div>
                                            </div>
                                        )}
                                        {selectedDetection.quantification.corrosion_grade && (
                                            <div>
                                                <div className="text-slate-500 text-xs">锈蚀等级</div>
                                                <div className="text-white font-bold font-mono">{selectedDetection.quantification.corrosion_grade}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex space-x-3 pt-2">
                                <button className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg text-sm transition-colors"
                                    onClick={() => { setSelectedDetection(null); onNavigate('disease-list'); }}>
                                    添加至台账
                                </button>
                                <button className="flex-1 py-2 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-lg text-sm transition-colors"
                                    onClick={() => { setSelectedDetection(null); onNavigate('work-orders'); }}>
                                    生成工单
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIInspectionCockpitView;