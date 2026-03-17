
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
import { Layers, Car, Zap, Activity, Navigation, Download, Truck, Play, X, Battery, Thermometer, Gauge, MapPin, Clock, AlertTriangle, Video, FileText, ExternalLink, Eye, Plane } from 'lucide-react';
import clsx from 'clsx';
import { MOCK_TASKS, MOCK_BRIDGES } from '../MockData';
import INITIAL_ROAD_PATHS from '../data/cachedRoadPaths.json';
import BridgeDetailPanel from '../components/BridgeDetailPanel';

// --- Configuration ---
const HEALTH_LEVELS = {
    '优秀': { color: '#10b981', label: '健康', range: [90, 100] },
    '良好': { color: '#3b82f6', label: '良好', range: [80, 89] },
    '中度': { color: '#f59e0b', label: '一般', range: [60, 79] },
    '严重': { color: '#ef4444', label: '较差', range: [0, 59] },
};

const getHealthColor = (health) => {
    if (health >= 90) return HEALTH_LEVELS['优秀'].color;
    if (health >= 80) return HEALTH_LEVELS['良好'].color;
    if (health >= 60) return HEALTH_LEVELS['中度'].color;
    return HEALTH_LEVELS['严重'].color;
};

const LABEL_MIN_ZOOM = 13;

// 模块级别的 AMap 加载缓存
let amapLoadPromise = null;
const loadAMap = () => {
    if (amapLoadPromise) return amapLoadPromise;

    if (!window._AMapSecurityConfig) {
        window._AMapSecurityConfig = {
            securityJsCode: 'a7b749b93b63a98fcf4978be5c940f52',
        };
    }

    amapLoadPromise = AMapLoader.load({
        key: '133f790dfcda8e42eb201a61399357f4',
        version: '2.0',
        plugins: ['AMap.LineSearch', 'AMap.Driving', 'AMap.MoveAnimation', 'AMap.ControlBar', 'AMap.Scale', 'AMap.ToolBar'],
        Loca: { version: '2.0.0' }
    }).catch(err => {
        amapLoadPromise = null;
        throw err;
    });

    return amapLoadPromise;
};

const DigitalCityView = ({ onNavigate }) => {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const locaRef = useRef(null);
    const lineLayerRef = useRef(null);
    const labelLayerRef = useRef(null);
    const vehicleMarkersRef = useRef([]);
    const bridgeMarkersRef = useRef([]);
    const [loading, setLoading] = useState(true);
    const allLabelDataRef = useRef([]);
    const [roadPaths, setRoadPaths] = useState([]);
    const [visibleLabels, setVisibleLabels] = useState([]);
    const [currentZoom, setCurrentZoom] = useState(13.5);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [selectedBridge, setSelectedBridge] = useState(null);

    // 预处理标签数据
    const allLabelData = useMemo(() => {
        if (!roadPaths || roadPaths.length === 0) return [];
        return roadPaths.map(road => {
            if (!road.path || road.path.length < 2) return null;
            const midIndex = Math.floor(road.path.length / 2);
            const midPoint = road.path[midIndex];
            return {
                id: road.id,
                name: road.name,
                health: road.health,
                lng: midPoint[0],
                lat: midPoint[1],
                color: getHealthColor(road.health)
            };
        }).filter(Boolean);
    }, [roadPaths]);

    useEffect(() => {
        allLabelDataRef.current = allLabelData;
    }, [allLabelData]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setRoadPaths(INITIAL_ROAD_PATHS);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const filterLabelsInBounds = useCallback((map, zoom) => {
        if (!map) return;
        if (zoom < LABEL_MIN_ZOOM) {
            setVisibleLabels([]);
            return;
        }
        const bounds = map.getBounds();
        if (!bounds) return;
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();
        const filtered = allLabelDataRef.current.filter(label => {
            return label.lng >= sw.lng && label.lng <= ne.lng &&
                label.lat >= sw.lat && label.lat <= ne.lat;
        });
        setVisibleLabels(filtered);
    }, []);

    // --- Map Initialization ---
    useEffect(() => {
        const initId = Date.now();
        let isCurrentInit = true;
        let localMapInstance = null;
        let localLocaInstance = null;

        loadAMap().then((AMap) => {
            if (!isCurrentInit || !AMap || !mapContainerRef.current) return;

            localMapInstance = new AMap.Map(mapContainerRef.current, {
                viewMode: '3D',
                zoom: 12,
                center: [120.1800, 30.2300],
                pitch: 45,
                rotation: -10,
                mapStyle: 'amap://styles/darkblue',
                showLabel: false
            });

            localMapInstance.on('complete', () => {
                if (!isCurrentInit) {
                    localMapInstance?.destroy();
                    return;
                }

                mapInstanceRef.current = localMapInstance;

                // Initialize Loca
                if (window.Loca && window.Loca.Container) {
                    try {
                        localLocaInstance = new window.Loca.Container({ map: localMapInstance });
                        locaRef.current = localLocaInstance;

                        if (window.Loca.GeoJSONSource) {
                            const emptySource = new window.Loca.GeoJSONSource({
                                data: { type: 'FeatureCollection', features: [] }
                            });

                            if (window.Loca.LineLayer) {
                                const lineLayer = new window.Loca.LineLayer({
                                    loca: localLocaInstance,
                                    zIndex: 10,
                                    opacity: 1,
                                    visible: true,
                                    zooms: [10, 22],
                                });
                                lineLayer.setSource(emptySource);
                                lineLayerRef.current = lineLayer;
                            }
                        }
                    } catch (e) {
                        console.error('Loca 初始化失败:', e);
                    }
                }

                // 标签层
                try {
                    const amapLabelsLayer = new AMap.LabelsLayer({
                        zooms: [LABEL_MIN_ZOOM, 22],
                        zIndex: 120,
                        collision: true,
                        allowCollision: false
                    });
                    localMapInstance.add(amapLabelsLayer);
                    labelLayerRef.current = amapLabelsLayer;
                } catch (e) {
                    console.error('标签层初始化失败:', e);
                }

                // 监听缩放/移动事件
                localMapInstance.on('zoomend', () => {
                    if (!isCurrentInit) return;
                    const zoom = localMapInstance.getZoom();
                    setCurrentZoom(zoom);
                    filterLabelsInBounds(localMapInstance, zoom);
                });

                localMapInstance.on('moveend', () => {
                    if (!isCurrentInit) return;
                    const zoom = localMapInstance.getZoom();
                    filterLabelsInBounds(localMapInstance, zoom);
                });

                localMapInstance.addControl(new AMap.ControlBar({ position: 'RT' }));
                setLoading(false);
                setCurrentZoom(localMapInstance.getZoom());
            });

        }).catch(e => {
            console.error('AMap 加载失败:', e);
        });

        return () => {
            isCurrentInit = false;
            if (localLocaInstance) {
                try { localLocaInstance.destroy?.(); } catch (e) { }
            }
            locaRef.current = null;
            lineLayerRef.current = null;
            labelLayerRef.current = null;
            if (localMapInstance) {
                try { localMapInstance.destroy(); } catch (e) { }
            }
            mapInstanceRef.current = null;
            setLoading(true);
        };
    }, [filterLabelsInBounds]);

    // --- Render Road Paths ---
    useEffect(() => {
        if (!mapInstanceRef.current || !locaRef.current || !lineLayerRef.current || !window.Loca || loading) return;

        const lineGeojson = {
            type: 'FeatureCollection',
            features: roadPaths.map(road => ({
                type: 'Feature',
                properties: { id: road.id, name: road.name, health: road.health, status: road.status },
                geometry: { type: 'LineString', coordinates: road.path }
            }))
        };

        const lineLayer = lineLayerRef.current;
        lineLayer.setSource(new window.Loca.GeoJSONSource({ data: lineGeojson }));
        lineLayer.setStyle({
            color: (index, feature) => getHealthColor(feature.properties.health),
            lineWidth: 3,
            altitude: 0,
            borderWidth: 0,
        });
    }, [roadPaths, loading]);

    // --- Render Labels ---
    useEffect(() => {
        if (!labelLayerRef.current || !mapInstanceRef.current || loading) return;
        const labelsLayer = labelLayerRef.current;
        const AMap = window.AMap;
        labelsLayer.clear();
        if (visibleLabels.length === 0) return;

        const labelMarkers = visibleLabels.map(label => {
            return new AMap.LabelMarker({
                position: [label.lng, label.lat],
                zooms: [LABEL_MIN_ZOOM, 22],
                opacity: 1,
                zIndex: 10,
                text: {
                    content: `${label.name} (${label.health})`,
                    direction: 'center',
                    offset: [0, 0],
                    style: {
                        fontSize: 12,
                        fontFamily: 'Inter, system-ui, sans-serif',
                        fontWeight: 'bold',
                        fillColor: label.color,
                        strokeColor: '#0f172a',
                        strokeWidth: 2,
                        padding: [6, 10],
                        backgroundColor: 'rgba(15, 23, 42, 0.92)',
                        borderColor: label.color,
                        borderWidth: 1,
                        borderRadius: 4,
                    }
                }
            });
        });

        labelsLayer.add(labelMarkers);
    }, [visibleLabels, loading]);

    // --- Render Vehicles ---
    useEffect(() => {
        if (!mapInstanceRef.current || !window.AMap || loading) return;
        const map = mapInstanceRef.current;
        const AMap = window.AMap;

        vehicleMarkersRef.current.forEach(m => m.setMap(null));
        vehicleMarkersRef.current = [];

        MOCK_TASKS.forEach((task) => {
            const statusColors = {
                executing: { bg: 'bg-blue-600', ring: 'bg-blue-600/30', shadow: 'shadow-blue-500/50', animate: 'animate-pulse' },
                pending: { bg: 'bg-amber-500', ring: 'bg-amber-500/30', shadow: 'shadow-amber-400/50', animate: '' },
                completed: { bg: 'bg-emerald-500', ring: 'bg-emerald-500/30', shadow: 'shadow-emerald-400/50', animate: '' }
            };
            const colors = statusColors[task.status] || statusColors.pending;

            const content = `
                <div class="relative flex flex-col items-center group cursor-pointer" data-vehicle-id="${task.id}">
                    <div class="absolute -top-10 px-2 py-1 bg-slate-900/95 text-white text-[10px] rounded-lg border border-slate-600 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50 shadow-xl">
                        <div class="font-bold">${task.vehicle}</div>
                        <div class="text-slate-400">${task.status === 'executing' ? '执行中' : task.status === 'pending' ? '待命中' : '已完成'}</div>
                    </div>
                    <div class="w-10 h-10 ${colors.ring} rounded-full flex items-center justify-center ${colors.animate}">
                        <div class="w-7 h-7 ${colors.bg} rounded-full flex items-center justify-center shadow-lg ${colors.shadow} border-2 border-white">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
                        </div>
                    </div>
                </div>
            `;

            const marker = new AMap.Marker({
                position: task.position,
                content: content,
                offset: new AMap.Pixel(-20, -20),
                zIndex: 100
            });

            marker.on('click', () => {
                setSelectedVehicle(task);
                setSelectedBridge(null);
            });

            map.add(marker);
            vehicleMarkersRef.current.push(marker);
        });
    }, [loading]);

    // --- Render Bridge Markers ---
    useEffect(() => {
        if (!mapInstanceRef.current || !window.AMap || loading) return;
        const map = mapInstanceRef.current;
        const AMap = window.AMap;

        // 清理旧标记
        bridgeMarkersRef.current.forEach(m => m.setMap(null));
        bridgeMarkersRef.current = [];

        MOCK_BRIDGES.forEach((bridge) => {
            const healthColor = getHealthColor(bridge.healthScore);
            const isSelected = selectedBridge?.id === bridge.id;
            
            const content = `
                <div class="relative flex flex-col items-center group cursor-pointer bridge-marker" data-bridge-id="${bridge.id}">
                    <div class="absolute -top-12 px-2.5 py-1.5 bg-slate-900/95 text-white text-[10px] rounded-lg border opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50 shadow-xl" style="border-color: ${healthColor}40">
                        <div class="font-bold text-xs">${bridge.name}</div>
                        <div class="flex items-center gap-2 mt-0.5">
                            <span style="color: ${healthColor}">BHI ${bridge.healthScore}</span>
                            <span class="text-slate-400">${bridge.type}</span>
                        </div>
                    </div>
                    <div class="w-11 h-11 rounded-full flex items-center justify-center transition-all ${isSelected ? 'scale-125' : ''}" style="background: ${healthColor}25; box-shadow: 0 0 ${isSelected ? '20' : '12'}px ${healthColor}40">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 transition-all" style="background: ${healthColor}; border-color: ${isSelected ? 'white' : healthColor + '80'}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>
                            </svg>
                        </div>
                    </div>
                    <div class="mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold shadow-lg whitespace-nowrap" style="background: ${healthColor}; color: white">
                        ${bridge.name}
                    </div>
                </div>
            `;

            const marker = new AMap.Marker({
                position: bridge.coord,
                content: content,
                offset: new AMap.Pixel(-22, -40),
                zIndex: isSelected ? 200 : 150
            });

            marker.on('click', () => {
                setSelectedBridge(bridge);
                setSelectedVehicle(null);
                // 平移到桥梁位置
                map.panTo(bridge.coord);
            });

            map.add(marker);
            bridgeMarkersRef.current.push(marker);
        });
    }, [loading, selectedBridge]);


    return (
        <div className="absolute inset-0 bg-slate-900">
            {/* Map Container */}
            <div ref={mapContainerRef} className="w-full h-full" />

            {/* Title Overlay */}
            <div className="absolute top-6 left-6 z-10 pointer-events-none select-none">
                <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 pl-5 pr-8 py-5 rounded-2xl shadow-2xl flex items-center gap-4">
                    <div className="h-10 w-1.5 bg-gradient-to-b from-blue-500 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-wide leading-none font-mono">
                            全息桥网
                        </h1>
                        <p className="text-xs font-bold text-slate-400 mt-1.5 tracking-wider">
                            桥梁群全域感知与智能监测
                        </p>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className={clsx("absolute top-6 z-10 flex flex-col gap-2 transition-all", selectedBridge ? "right-[440px]" : "right-6")}>
                <div className="bg-slate-900/80 backdrop-blur border border-slate-700 p-4 rounded-xl shadow-2xl">
                    <h3 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider flex items-center">
                        <Activity size={12} className="mr-2" /> 桥梁健康指数 (BHI)
                    </h3>
                    <div className="space-y-2">
                        {Object.entries(HEALTH_LEVELS).map(([key, config]) => (
                            <div key={key} className="flex items-center text-xs text-slate-300">
                                <span className="w-8 h-1 mr-3 rounded-full" style={{ backgroundColor: config.color }}></span>
                                <span className="w-12">{config.label}</span>
                                <span className="text-slate-500 font-mono">{config.range[0]}-{config.range[1]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bridge Stats */}
                <div className="bg-slate-900/80 backdrop-blur border border-slate-700 p-4 rounded-xl shadow-2xl">
                    <h3 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider flex items-center">
                        <Layers size={12} className="mr-2" /> 桥梁健康状态分布
                    </h3>
                    <div className="space-y-2">
                        {(() => {
                            const total = MOCK_BRIDGES.length;
                            const excellent = MOCK_BRIDGES.filter(b => b.healthScore >= 90).length;
                            const good = MOCK_BRIDGES.filter(b => b.healthScore >= 80 && b.healthScore < 90).length;
                            const medium = MOCK_BRIDGES.filter(b => b.healthScore >= 60 && b.healthScore < 80).length;
                            const poor = MOCK_BRIDGES.filter(b => b.healthScore < 60).length;
                            const data = [
                                { label: '健康', count: excellent, pct: ((excellent / total) * 100).toFixed(1), color: '#10b981', textColor: 'text-emerald-400' },
                                { label: '良好', count: good, pct: ((good / total) * 100).toFixed(1), color: '#3b82f6', textColor: 'text-blue-400' },
                                { label: '一般', count: medium, pct: ((medium / total) * 100).toFixed(1), color: '#f59e0b', textColor: 'text-amber-400' },
                                { label: '较差', count: poor, pct: ((poor / total) * 100).toFixed(1), color: '#ef4444', textColor: 'text-red-400' },
                            ];
                            return (
                                <>
                                    {data.map(item => (
                                        <div key={item.label} className="flex items-center justify-between text-xs">
                                            <div className="flex items-center">
                                                <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                                                <span className="text-slate-300">{item.label}</span>
                                                <span className="text-slate-600 ml-1">({item.count})</span>
                                            </div>
                                            <span className={clsx("font-mono font-bold", item.textColor)}>{item.pct}%</span>
                                        </div>
                                    ))}
                                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden flex mt-2">
                                        {data.map(item => (
                                            <div key={item.label} className="h-full" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                                        ))}
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </div>
            </div>

            {/* Bottom Panel - Stats */}
            <div className={clsx("absolute bottom-6 left-6 z-10 flex justify-center pointer-events-none transition-all", selectedBridge ? "right-[440px]" : "right-6")}>
                <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 px-6 py-4 rounded-2xl shadow-2xl pointer-events-auto flex items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400"><Plane size={24} /></div>
                        <div>
                            <div className="text-xl font-bold text-white font-mono">{MOCK_TASKS.length}</div>
                            <div className="text-xs text-slate-400">在线无人机</div>
                        </div>
                    </div>
                    <div className="w-px h-8 bg-slate-700"></div>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-cyan-500/20 rounded-xl text-cyan-400"><MapPin size={24} /></div>
                        <div>
                            <div className="text-xl font-bold text-white font-mono">{MOCK_BRIDGES.length}</div>
                            <div className="text-xs text-slate-400">监测桥梁/隧道</div>
                        </div>
                    </div>
                    <div className="w-px h-8 bg-slate-700"></div>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-500/20 rounded-xl text-green-400"><Navigation size={24} /></div>
                        <div>
                            <div className="text-xl font-bold text-white font-mono">{roadPaths.reduce((acc, r) => acc + (r.path?.length * 0.05), 0).toFixed(1)} km</div>
                            <div className="text-xs text-slate-400">已巡检全域</div>
                        </div>
                    </div>
                    <div className="w-px h-8 bg-slate-700"></div>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400"><Download size={24} /></div>
                        <div>
                            <div className="text-xl font-bold text-white font-mono">{roadPaths.length}</div>
                            <div className="text-xs text-slate-400">覆盖结构段</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bridge Detail Panel */}
            {selectedBridge && (
                <BridgeDetailPanel
                    bridge={selectedBridge}
                    onClose={() => setSelectedBridge(null)}
                    onNavigate={onNavigate}
                />
            )}

            {/* Vehicle Detail Modal */}
            {selectedVehicle && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setSelectedVehicle(null)}>
                    <div className="bg-slate-900/95 border border-slate-700 rounded-2xl shadow-2xl w-[400px] max-h-[85vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <Plane size={24} className="text-white" />
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-white">{selectedVehicle.vehicle}</div>
                                    <div className="text-xs text-blue-100">巡检无人机</div>
                                </div>
                            </div>
                            <button onClick={() => setSelectedVehicle(null)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                                <X size={20} className="text-white" />
                            </button>
                        </div>

                        {/* Status Badge */}
                        <div className="px-4 py-2 border-b border-slate-700 flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${selectedVehicle.status === 'executing' ? 'bg-blue-500/20 text-blue-400' :
                                selectedVehicle.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                                    'bg-emerald-500/20 text-emerald-400'
                                }`}>
                                {selectedVehicle.status === 'executing' ? '● 执行中' : selectedVehicle.status === 'pending' ? '○ 待命中' : '✓ 已完成'}
                            </span>
                            <span className="text-xs text-slate-400">任务ID: {selectedVehicle.id}</span>
                        </div>

                        {/* Content */}
                        <div className="p-4 pb-6 space-y-4 overflow-y-auto flex-1">
                            <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                                <div className="text-xs text-slate-400 mb-2 flex items-center gap-1"><MapPin size={12} /> 当前任务</div>
                                <div className="text-white font-medium">{selectedVehicle.type}</div>
                                <div className="text-sm text-slate-400 mt-1">{selectedVehicle.area}</div>
                                {selectedVehicle.progress > 0 && (
                                    <div className="mt-2">
                                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                                            <span>任务进度</span>
                                            <span>{selectedVehicle.progress}%</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all" style={{ width: `${selectedVehicle.progress}%` }} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                                        <Battery size={12} className={selectedVehicle.battery < 20 ? 'text-red-400' : selectedVehicle.battery < 50 ? 'text-amber-400' : 'text-emerald-400'} />
                                        电量
                                    </div>
                                    <div className={`text-xl font-bold font-mono ${selectedVehicle.battery < 20 ? 'text-red-400' : selectedVehicle.battery < 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                        {selectedVehicle.battery}%
                                    </div>
                                </div>
                                <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                                        <Gauge size={12} className="text-blue-400" />
                                        空速
                                    </div>
                                    <div className="text-xl font-bold font-mono text-white">
                                        {selectedVehicle.speed} <span className="text-sm text-slate-400">km/h</span>
                                    </div>
                                </div>
                                <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                                        <Navigation size={12} className="text-purple-400" />
                                        巡航里程
                                    </div>
                                    <div className="text-xl font-bold font-mono text-white">
                                        {selectedVehicle.mileageToday} <span className="text-sm text-slate-400">km</span>
                                    </div>
                                </div>
                                <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                                        <Thermometer size={12} className={selectedVehicle.temperature > 50 ? 'text-red-400' : 'text-cyan-400'} />
                                        温度
                                    </div>
                                    <div className={`text-xl font-bold font-mono ${selectedVehicle.temperature > 50 ? 'text-red-400' : 'text-white'}`}>
                                        {selectedVehicle.temperature}°C
                                    </div>
                                </div>
                            </div>

                            {selectedVehicle.issues > 0 && (
                                <div
                                    className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-amber-500/20 transition-colors"
                                    onClick={() => {
                                        setSelectedVehicle(null);
                                        onNavigate?.('disease-list');
                                    }}
                                >
                                    <AlertTriangle size={20} className="text-amber-400" />
                                    <div>
                                        <div className="text-sm font-medium text-amber-400">发现 {selectedVehicle.issues} 个问题</div>
                                        <div className="text-xs text-slate-400">点击查看详细检测报告 →</div>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    onClick={() => { setSelectedVehicle(null); onNavigate?.('inspection-task'); }}
                                    className="flex flex-col items-center gap-1.5 p-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-xl transition-all group"
                                >
                                    <FileText size={20} className="text-blue-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs text-blue-400 font-medium">巡检任务</span>
                                </button>
                                <button
                                    onClick={() => { setSelectedVehicle(null); onNavigate?.('ai-cockpit'); }}
                                    className="flex flex-col items-center gap-1.5 p-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition-all group"
                                >
                                    <Video size={20} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs text-emerald-400 font-medium">实时视频</span>
                                </button>
                                <button
                                    onClick={() => { setSelectedVehicle(null); onNavigate?.('disease-list'); }}
                                    className="flex flex-col items-center gap-1.5 p-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-xl transition-all group"
                                >
                                    <Eye size={20} className="text-purple-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs text-purple-400 font-medium">检测报告</span>
                                </button>
                            </div>

                            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-700">
                                <div className="flex items-center gap-1"><Clock size={12} /> 开始时间: {selectedVehicle.startTime}</div>
                                <div>坐标: {selectedVehicle.position[0].toFixed(4)}, {selectedVehicle.position[1].toFixed(4)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DigitalCityView;
