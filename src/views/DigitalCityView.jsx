
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
import { Layers, Car, Zap, Activity, Navigation, Download, Truck, Play, X, Battery, Thermometer, Gauge, MapPin, Clock, AlertTriangle, Video, FileText, ExternalLink, Eye } from 'lucide-react';
import clsx from 'clsx';
import { MOCK_TASKS } from '../MockData';
import INITIAL_ROAD_PATHS from '../data/cachedRoadPaths.json';

// --- Configuration ---
const HEALTH_LEVELS = {
    '优秀': { color: '#10b981', label: '健康', range: [90, 100] }, // Green
    '良好': { color: '#3b82f6', label: '良好', range: [80, 89] },  // Blue
    '中度': { color: '#f59e0b', label: '一般', range: [60, 79] },  // Yellow/Orange
    '严重': { color: '#ef4444', label: '较差', range: [0, 59] },   // Red
};

// 获取健康状态对应的颜色
const getHealthColor = (health) => {
    if (health >= 90) return HEALTH_LEVELS['优秀'].color;
    if (health >= 80) return HEALTH_LEVELS['良好'].color;
    if (health >= 60) return HEALTH_LEVELS['中度'].color;
    return HEALTH_LEVELS['严重'].color;
};

// 标签显示的最低缩放级别
const LABEL_MIN_ZOOM = 13;

// 模块级别的 AMap 加载缓存，确保只加载一次
let amapLoadPromise = null;
const loadAMap = () => {
    if (amapLoadPromise) {
        return amapLoadPromise;
    }

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
        amapLoadPromise = null; // 加载失败时允许重试
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
    const allLabelDataRef = useRef([]); // 用于存储最新的标签数据引用
    const [roadPaths, setRoadPaths] = useState([]); // 初始为空，由 useEffect 加载
    const [visibleLabels, setVisibleLabels] = useState([]); // 当前视野内的标签
    const [currentZoom, setCurrentZoom] = useState(13.5); // 当前缩放级别
    const [selectedVehicle, setSelectedVehicle] = useState(null); // 选中的车辆详情

    // 预处理所有道路的标签数据 (移至独立 useEffect 处理大数据)
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

    // 同步 allLabelDataRef
    useEffect(() => {
        allLabelDataRef.current = allLabelData;
    }, [allLabelData]);

    // 延迟加载大数据文件，避免初次渲染阻塞
    useEffect(() => {
        const timer = setTimeout(() => {
            setRoadPaths(INITIAL_ROAD_PATHS);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    // 过滤视野范围内的标签 - 只在达到缩放阈值时过滤
    const filterLabelsInBounds = useCallback((map, zoom) => {
        if (!map) return;

        console.log(`[DigitalCity] filterLabelsInBounds 调用，zoom=${zoom?.toFixed?.(1) || zoom}`);

        // 如果缩放级别低于阈值，清空标签
        if (zoom < LABEL_MIN_ZOOM) {
            console.log(`[DigitalCity] 缩放级别 ${zoom?.toFixed?.(1) || zoom} < ${LABEL_MIN_ZOOM}，清空标签`);
            setVisibleLabels([]);
            return;
        }

        const bounds = map.getBounds();
        if (!bounds) return;

        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();

        // 使用 ref 获取最新数据，避免闭包陈旧引用
        const filtered = allLabelDataRef.current.filter(label => {
            return label.lng >= sw.lng && label.lng <= ne.lng &&
                label.lat >= sw.lat && label.lat <= ne.lat;
        });

        console.log(`[DigitalCity] 缩放级别 ${zoom.toFixed(1)}，渲染 ${filtered.length} 个标签`);
        setVisibleLabels(filtered);
    }, []); // 不再依赖 allLabelData

    // --- Map Initialization ---
    useEffect(() => {
        // 每次 effect 执行生成唯一 ID，用于跟踪这次初始化
        const initId = Date.now();
        let isCurrentInit = true; // 标记这次初始化是否仍然有效
        let localMapInstance = null;
        let localLocaInstance = null;

        console.log(`[DigitalCity #${initId}] 开始加载 AMap...`);

        // 使用缓存的加载函数，确保 AMapLoader.load 只被调用一次
        loadAMap().then((AMap) => {
            // 如果这次初始化已被清理，不执行后续操作
            if (!isCurrentInit) {
                console.log(`[DigitalCity #${initId}] 初始化已取消，跳过`);
                return;
            }
            if (!AMap) {
                console.error(`[DigitalCity #${initId}] AMap 加载返回 undefined`);
                return;
            }
            if (!mapContainerRef.current) {
                console.warn(`[DigitalCity #${initId}] 地图容器不存在`);
                return;
            }

            console.log(`[DigitalCity #${initId}] AMap 加载成功，创建地图...`);

            localMapInstance = new AMap.Map(mapContainerRef.current, {
                viewMode: '3D',
                zoom: 13.5,
                center: [120.20000, 30.27200],
                pitch: 50,
                rotation: -10,
                mapStyle: 'amap://styles/darkblue',
                showLabel: false
            });

            // 等待地图完全加载
            localMapInstance.on('complete', () => {
                if (!isCurrentInit) {
                    console.log(`[DigitalCity #${initId}] 初始化已取消，销毁地图`);
                    localMapInstance?.destroy();
                    return;
                }

                console.log(`[DigitalCity #${initId}] 地图加载完成，初始化图层...`);
                mapInstanceRef.current = localMapInstance;

                // Initialize Loca (仅用于道路线)
                if (window.Loca && window.Loca.Container) {
                    try {
                        localLocaInstance = new window.Loca.Container({ map: localMapInstance });
                        locaRef.current = localLocaInstance;

                        // 空数据源，防止 Loca 渲染时读取 undefined
                        if (window.Loca.GeoJSONSource) {
                            const emptySource = new window.Loca.GeoJSONSource({
                                data: { type: 'FeatureCollection', features: [] }
                            });

                            // Initialize Line Layer (Roads) - 仍使用 Loca
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
                                console.log(`[DigitalCity #${initId}] Loca 道路层初始化完成`);
                            }
                        }
                    } catch (e) {
                        console.error(`[DigitalCity #${initId}] Loca 初始化失败:`, e);
                    }
                } else {
                    console.warn(`[DigitalCity #${initId}] Loca 库或 Container 未加载`);
                }

                // 使用 AMap 原生 LabelsLayer（支持 zooms 自动控制显示）
                try {
                    const amapLabelsLayer = new AMap.LabelsLayer({
                        zooms: [LABEL_MIN_ZOOM, 22], // 只在 15-22 级显示
                        zIndex: 120,
                        collision: true, // 开启碰撞检测
                        allowCollision: false // 不允许重叠
                    });
                    localMapInstance.add(amapLabelsLayer);
                    labelLayerRef.current = amapLabelsLayer;
                    console.log(`[DigitalCity #${initId}] AMap 标签层初始化完成`);
                } catch (e) {
                    console.error(`[DigitalCity #${initId}] AMap 标签层初始化失败:`, e);
                }

                // 监听缩放事件
                localMapInstance.on('zoomend', () => {
                    if (!isCurrentInit) return;
                    const zoom = localMapInstance.getZoom();
                    setCurrentZoom(zoom);
                    filterLabelsInBounds(localMapInstance, zoom);
                });

                // 监听移动事件
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
            console.error(`[DigitalCity #${initId}] AMap 加载失败:`, e);
        });

        // 清理函数 - 标记这次初始化无效，销毁创建的资源
        return () => {
            console.log(`[DigitalCity #${initId}] 清理...`);
            isCurrentInit = false;

            // 清理 Loca
            if (localLocaInstance) {
                try {
                    localLocaInstance.destroy?.();
                } catch (e) { /* ignore */ }
            }
            locaRef.current = null;
            lineLayerRef.current = null;
            labelLayerRef.current = null;

            // 清理地图
            if (localMapInstance) {
                try {
                    localMapInstance.destroy();
                } catch (e) { /* ignore */ }
            }
            mapInstanceRef.current = null;

            // 重置加载状态，允许下次初始化
            setLoading(true);
        };
    }, [filterLabelsInBounds]);

    // --- Render Road Paths (初始化一次) ---
    useEffect(() => {
        if (!mapInstanceRef.current || !locaRef.current || !lineLayerRef.current || !window.Loca || loading) return;

        // Line Geometry (Roads)
        const lineGeojson = {
            type: 'FeatureCollection',
            features: roadPaths.map(road => ({
                type: 'Feature',
                properties: {
                    id: road.id,
                    name: road.name,
                    health: road.health,
                    status: road.status
                },
                geometry: {
                    type: 'LineString',
                    coordinates: road.path
                }
            }))
        };

        const lineLayer = lineLayerRef.current;
        lineLayer.setSource(new window.Loca.GeoJSONSource({ data: lineGeojson }));

        // Style the lines based on health
        lineLayer.setStyle({
            color: (index, feature) => {
                const health = feature.properties.health;
                return getHealthColor(health);
            },
            lineWidth: 3,
            altitude: 0,
            borderWidth: 0,
        });

    }, [roadPaths, loading]);

    // --- Render Labels (使用 AMap 原生 LabelMarker) ---
    useEffect(() => {
        if (!labelLayerRef.current || !mapInstanceRef.current || loading) return;

        const labelsLayer = labelLayerRef.current;
        const AMap = window.AMap;

        // 清空现有标签
        labelsLayer.clear();

        // 如果没有可见标签，直接返回
        if (visibleLabels.length === 0) {
            console.log('[DigitalCity] 无可见标签');
            return;
        }

        console.log(`[DigitalCity] 渲染 ${visibleLabels.length} 个标签`);

        // 创建 LabelMarker 数组
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
                        strokeColor: '#0f172a', // 深色描边
                        strokeWidth: 2,
                        padding: [6, 10],
                        backgroundColor: 'rgba(15, 23, 42, 0.92)', // 深色半透明背景
                        borderColor: label.color, // 边框颜色与健康值对应
                        borderWidth: 1,
                        borderRadius: 4,
                    }
                }
            });
        });

        // 批量添加到标签层
        labelsLayer.add(labelMarkers);

    }, [visibleLabels, loading]);

    // --- Render Vehicles (使用 MOCK_TASKS 的固定坐标) ---
    useEffect(() => {
        if (!mapInstanceRef.current || !window.AMap || loading) return;
        const map = mapInstanceRef.current;
        const AMap = window.AMap;

        // Clear existing markers
        vehicleMarkersRef.current.forEach(m => m.setMap(null));
        vehicleMarkersRef.current = [];

        MOCK_TASKS.forEach((task) => {
            // 根据状态设置颜色
            const statusColors = {
                executing: { bg: 'bg-blue-600', ring: 'bg-blue-600/30', shadow: 'shadow-blue-500/50', animate: 'animate-pulse' },
                pending: { bg: 'bg-amber-500', ring: 'bg-amber-500/30', shadow: 'shadow-amber-400/50', animate: '' },
                completed: { bg: 'bg-emerald-500', ring: 'bg-emerald-500/30', shadow: 'shadow-emerald-400/50', animate: '' }
            };
            const colors = statusColors[task.status] || statusColors.pending;

            // Create a custom content marker
            const content = `
                <div class="relative flex flex-col items-center group cursor-pointer" data-vehicle-id="${task.id}">
                    <div class="absolute -top-10 px-2 py-1 bg-slate-900/95 text-white text-[10px] rounded-lg border border-slate-600 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50 shadow-xl">
                        <div class="font-bold">${task.vehicle}</div>
                        <div class="text-slate-400">${task.status === 'executing' ? '执行中' : task.status === 'pending' ? '待命中' : '已完成'}</div>
                    </div>
                    <div class="w-10 h-10 ${colors.ring} rounded-full flex items-center justify-center ${colors.animate}">
                        <div class="w-7 h-7 ${colors.bg} rounded-full flex items-center justify-center shadow-lg ${colors.shadow} border-2 border-white">
                            <svg width="16\" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
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

            // 点击事件 - 打开详情
            marker.on('click', () => {
                setSelectedVehicle(task);
            });

            map.add(marker);
            vehicleMarkersRef.current.push(marker);
        });

    }, [loading]);


    return (
        <div className="absolute inset-0 bg-slate-900">
            {/* Map Container */}
            <div ref={mapContainerRef} className="w-full h-full" />

            {/* Title Overlay */}
            <div className="absolute top-6 left-6 z-10 pointer-events-none select-none">
                <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 pl-5 pr-8 py-5 rounded-2xl shadow-2xl flex items-center gap-4">
                    {/* Stylized Vertical Bar */}
                    <div className="h-10 w-1.5 bg-gradient-to-b from-blue-500 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>

                    <div>
                        <h1 className="text-2xl font-black text-white tracking-wide leading-none font-mono">
                            智途·孪生
                        </h1>
                        <p className="text-xs font-bold text-slate-400 mt-1.5 tracking-wider">
                            全息感知与动态映射系统
                        </p>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="absolute top-6 right-6 z-10 flex flex-col gap-2">
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

                {/* Road Status Distribution */}
                <div className="bg-slate-900/80 backdrop-blur border border-slate-700 p-4 rounded-xl shadow-2xl">
                    <h3 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider flex items-center">
                        <Layers size={12} className="mr-2" /> 结构健康状态分布
                    </h3>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center">
                                <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: '#10b981' }}></span>
                                <span className="text-slate-300">健康</span>
                            </div>
                            <span className="text-emerald-400 font-mono font-bold">62.3%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center">
                                <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: '#3b82f6' }}></span>
                                <span className="text-slate-300">良好</span>
                            </div>
                            <span className="text-blue-400 font-mono font-bold">24.7%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center">
                                <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: '#f59e0b' }}></span>
                                <span className="text-slate-300">一般</span>
                            </div>
                            <span className="text-amber-400 font-mono font-bold">9.8%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center">
                                <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: '#ef4444' }}></span>
                                <span className="text-slate-300">较差</span>
                            </div>
                            <span className="text-red-400 font-mono font-bold">3.2%</span>
                        </div>
                        {/* Progress Bar */}
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden flex mt-2">
                            <div className="h-full bg-emerald-500" style={{ width: '62.3%' }}></div>
                            <div className="h-full bg-blue-500" style={{ width: '24.7%' }}></div>
                            <div className="h-full bg-amber-500" style={{ width: '9.8%' }}></div>
                            <div className="h-full bg-red-500" style={{ width: '3.2%' }}></div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Bottom Panel - Vehicles */}
            <div className="absolute bottom-6 left-6 right-6 z-10 flex justify-center pointer-events-none">
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
                            {/* Task Info */}
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

                            {/* Stats Grid */}
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

                            {/* Issues */}
                            {selectedVehicle.issues > 0 && (
                                <div
                                    className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-amber-500/20 transition-colors"
                                    onClick={() => {
                                        setSelectedVehicle(null);
                                        onNavigate?.('inspection-tasks');
                                    }}
                                >
                                    <AlertTriangle size={20} className="text-amber-400" />
                                    <div>
                                        <div className="text-sm font-medium text-amber-400">发现 {selectedVehicle.issues} 个问题</div>
                                        <div className="text-xs text-slate-400">点击查看详细检测报告 →</div>
                                    </div>
                                </div>
                            )}

                            {/* Quick Actions */}
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    onClick={() => {
                                        setSelectedVehicle(null);
                                        onNavigate?.('inspection-tasks');
                                    }}
                                    className="flex flex-col items-center gap-1.5 p-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-xl transition-all group"
                                >
                                    <FileText size={20} className="text-blue-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs text-blue-400 font-medium">巡检任务</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedVehicle(null);
                                        onNavigate?.('inspection-video', { vehicleId: selectedVehicle.vehicle });
                                    }}
                                    className="flex flex-col items-center gap-1.5 p-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition-all group"
                                >
                                    <Video size={20} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs text-emerald-400 font-medium">实时视频</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedVehicle(null);
                                        onNavigate?.('disease-list');
                                    }}
                                    className="flex flex-col items-center gap-1.5 p-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-xl transition-all group"
                                >
                                    <Eye size={20} className="text-purple-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs text-purple-400 font-medium">检测报告</span>
                                </button>
                            </div>

                            {/* Time Info */}
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
