import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import {
    MapPin, Search, Filter, Layers, Navigation,
    Maximize, AlertTriangle, Activity,
    Sliders, X, Plane,
    ChevronsLeft, Menu
} from 'lucide-react';
import clsx from 'clsx';
import AMapLoader from '@amap/amap-jsapi-loader';
import { MOCK_BRIDGE_DISEASES, DISEASE_TYPES, MOCK_BRIDGES, MOCK_UAV_FLEET } from '../MockData';
import DiseaseDetailModal from '../components/DiseaseDetailModal';

// --- 桥梁病害类型配置 ---
const DISEASE_TYPE_CONFIG = {
    '混凝土裂缝': { icon: Activity, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' },
    '剥落/掉块': { icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
    '钢筋裸露': { icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-600/10', border: 'border-rose-600/30' },
    '钢结构锈蚀': { icon: Activity, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
    '泛碱/渗水': { icon: Activity, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
    'default': { icon: MapPin, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30' }
};

const CityMapView = ({ defaultMode = 'inspection', onNavigate }) => {
    const [showPanel, setShowPanel] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [showFilters, setShowFilters] = useState(true);
    const [activeDiseaseTypes, setActiveDiseaseTypes] = useState(new Set(Object.keys(DISEASE_TYPE_CONFIG).filter(k => k !== 'default')));

    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]);

    const displayData = useMemo(() => {
        return MOCK_BRIDGE_DISEASES.filter(item =>
            activeDiseaseTypes.has(item.type) &&
            (searchText === '' ||
                item.id.toLowerCase().includes(searchText.toLowerCase()) ||
                item.bridgeName.includes(searchText) ||
                item.type.includes(searchText))
        );
    }, [activeDiseaseTypes, searchText]);

    const stats = useMemo(() => {
        const total = displayData.length;
        const severe = displayData.filter(d => d.severity === '重度').length;
        return { label1: '发现病害', val1: total, label2: '重度/紧急', val2: severe, color2: 'text-red-500' };
    }, [displayData]);

    const toggleType = (type) => {
        const next = new Set(activeDiseaseTypes);
        if (next.has(type)) next.delete(type);
        else next.add(type);
        setActiveDiseaseTypes(next);
    };

    // Initialize Map
    useEffect(() => {
        window._AMapSecurityConfig = {
            securityJsCode: 'a7b749b93b63a98fcf4978be5c940f52',
        };

        AMapLoader.load({
            key: '133f790dfcda8e42eb201a61399357f4',
            version: '2.0',
            plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.ControlBar'],
        }).then((AMap) => {
            const map = new AMap.Map(mapContainerRef.current, {
                viewMode: '3D',
                zoom: 12,
                center: [120.18000, 30.23000],
                pitch: 45,
                rotation: -15,
                mapStyle: 'amap://styles/darkblue',
            });

            map.addControl(new AMap.ControlBar({ position: 'RT' }));
            mapInstanceRef.current = map;
            renderMarkers(map, AMap);
        }).catch(e => console.error(e));

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.destroy();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // Re-render markers when data changes
    useEffect(() => {
        if (mapInstanceRef.current && window.AMap) {
            renderMarkers(mapInstanceRef.current, window.AMap);
        }
    }, [displayData]);

    const renderMarkers = (map, AMap) => {
        markersRef.current.forEach(m => m.setMap(null));
        markersRef.current = [];

        displayData.forEach(item => {
            if (!item.coord || !item.coord[0] || !item.coord[1]) return;

            const config = DISEASE_TYPE_CONFIG[item.type] || DISEASE_TYPE_CONFIG['default'];
            const Icon = config.icon;
            const isSevere = item.severity === '重度';

            const markerContent = document.createElement('div');
            const root = createRoot(markerContent);

            root.render(
                <div className="relative transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
                    {isSevere && (
                        <div className="absolute inset-0 rounded-full animate-ping opacity-75 w-8 h-8 bg-red-500"></div>
                    )}
                    <div className={clsx(
                        "relative w-8 h-8 rounded-full flex items-center justify-center border shadow-lg transition-transform hover:scale-110 duration-200 bg-slate-900",
                        isSevere ? "border-red-500 text-red-500" : `${config.border} ${config.bg} ${config.color}`
                    )}>
                        <Icon size={16} />
                    </div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 border border-slate-700 font-sans">
                        <div className="font-bold flex items-center gap-1">
                            {item.type}
                            <span className={clsx("w-2 h-2 rounded-full", item.severity === '重度' ? 'bg-red-500' : item.severity === '中度' ? 'bg-orange-500' : 'bg-green-500')}></span>
                        </div>
                        <div className="text-slate-400 text-[10px]">{item.bridgeName} · {item.component}</div>
                    </div>
                </div>
            );

            const marker = new AMap.Marker({
                position: new AMap.LngLat(Number(item.coord[0]), Number(item.coord[1])),
                content: markerContent,
                offset: new AMap.Pixel(0, 0),
                zIndex: isSevere ? 100 : 10
            });

            marker.on('click', () => {
                setSelectedItem(item);
                map.setZoomAndCenter(15, [Number(item.coord[0]), Number(item.coord[1])], true);
            });

            map.add(marker);
            markersRef.current.push(marker);
        });

        // 桥梁位置标注
        MOCK_BRIDGES.forEach(bridge => {
            const bridgeMarker = new AMap.Marker({
                position: new AMap.LngLat(bridge.coord[0], bridge.coord[1]),
                content: `<div style="background:#0f172a;border:1px solid #06b6d4;color:#06b6d4;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:bold;white-space:nowrap;">${bridge.name}</div>`,
                offset: new AMap.Pixel(-40, -30),
                zIndex: 5
            });
            map.add(bridgeMarker);
            markersRef.current.push(bridgeMarker);
        });

        // 无人机飞行轨迹与实时位置标注
        MOCK_UAV_FLEET.forEach(uav => {
            if (uav.trajectory && uav.trajectory.length > 0) {
                const path = uav.trajectory.map(p => new AMap.LngLat(p[0], p[1]));
                const polyline = new AMap.Polyline({
                    path: path,
                    isOutline: true,
                    outlineColor: '#0891b2',
                    borderWeight: 1,
                    strokeColor: '#06b6d4', 
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    strokeStyle: 'dashed',
                    lineJoin: 'round',
                    lineCap: 'round',
                    zIndex: 40,
                });
                map.add(polyline);
                markersRef.current.push(polyline);
            }
            
            if (uav.position) {
                const uavContent = document.createElement('div');
                const root = createRoot(uavContent);
                root.render(
                    <div className="relative transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
                        {uav.status === 'flying' && (
                            <div className="absolute inset-0 rounded-full animate-ping opacity-50 bg-cyan-400"></div>
                        )}
                        <div className="relative w-8 h-8 rounded-full flex items-center justify-center bg-slate-900 border border-cyan-500 shadow-lg text-cyan-400">
                            <Plane size={16} />
                        </div>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 bg-slate-800 text-cyan-300 text-[10px] rounded shadow border border-cyan-800 whitespace-nowrap opacity-100 font-bold font-sans">
                            {uav.name} · {uav.currentBridge}
                        </div>
                    </div>
                );
                const uavMarker = new AMap.Marker({
                    position: new AMap.LngLat(uav.position[0], uav.position[1]),
                    content: uavContent,
                    offset: new AMap.Pixel(0, 0),
                    zIndex: 50
                });
                map.add(uavMarker);
                markersRef.current.push(uavMarker);
            }
        });
    };

    return (
        <div className="relative w-full h-full bg-slate-900 overflow-hidden">
            <div ref={mapContainerRef} className="w-full h-full" />

            {/* Header Overlay */}
            <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start pointer-events-none">
                <div className="flex flex-col gap-2 pointer-events-auto items-start">
                    {!showPanel && (
                        <button onClick={() => setShowPanel(true)}
                            className="p-3 bg-slate-900/90 backdrop-blur-md rounded-xl text-white shadow-xl border border-slate-700/50 hover:bg-slate-800 transition-all">
                            <Menu size={24} />
                        </button>
                    )}

                    {showPanel && (
                        <div className="bg-slate-900/90 backdrop-blur-md rounded-xl p-4 border border-slate-700/50 shadow-2xl min-w-[320px]">
                            <div className="flex items-center justify-between mb-4 gap-3">
                                <div className="flex items-center text-white font-bold text-lg">
                                    <Plane size={20} className="mr-2 text-cyan-400" />
                                    桥梁巡检地图
                                </div>
                                <button onClick={() => setShowPanel(false)} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800">
                                    <ChevronsLeft size={20} />
                                </button>
                            </div>

                            {/* Search */}
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder-slate-500"
                                    placeholder="搜索病害编号 / 桥梁名称..."
                                    value={searchText}
                                    onChange={e => setSearchText(e.target.value)}
                                />
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                                    <div className="text-slate-400 text-xs mb-1">{stats.label1}</div>
                                    <div className="text-xl font-bold text-white">{stats.val1}</div>
                                </div>
                                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                                    <div className="text-slate-400 text-xs mb-1">{stats.label2}</div>
                                    <div className={clsx("text-xl font-bold", stats.color2)}>{stats.val2}</div>
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="space-y-1">
                                <div className="flex items-center justify-between text-xs text-slate-400 mb-2 uppercase font-bold tracking-wider">
                                    <span>病害类型筛选</span>
                                    <button onClick={() => setShowFilters(!showFilters)} className="hover:text-white flex items-center">
                                        {showFilters ? '隐藏' : '展开'} <Sliders size={12} className="ml-1" />
                                    </button>
                                </div>

                                {showFilters && (
                                    <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                                        {Object.keys(DISEASE_TYPE_CONFIG).filter(t => t !== 'default').map(type => {
                                            const config = DISEASE_TYPE_CONFIG[type];
                                            const Icon = config.icon;
                                            const isActive = activeDiseaseTypes.has(type);
                                            return (
                                                <button key={type} onClick={() => toggleType(type)}
                                                    className={clsx(
                                                        "flex items-center text-xs px-2 py-2 rounded-lg border transition-all duration-200",
                                                        isActive
                                                            ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-100"
                                                            : "bg-slate-800 border-slate-700 text-slate-400 opacity-70 hover:opacity-100"
                                                    )}>
                                                    <div className={clsx("w-6 h-6 rounded-full flex items-center justify-center mr-2 border shrink-0", config.bg, config.border, config.color)}>
                                                        <Icon size={12} />
                                                    </div>
                                                    {type}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex space-x-2 pointer-events-auto">
                    <button className="p-2 bg-slate-900/90 backdrop-blur border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 shadow-xl">
                        <Navigation size={20} />
                    </button>
                    <button className="p-2 bg-slate-900/90 backdrop-blur border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 shadow-xl">
                        <Maximize size={20} />
                    </button>
                </div>
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-6 left-6 text-slate-500 text-xs pointer-events-none z-10">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-slate-800 border border-slate-600 mr-2"></div> 轻度/中度</div>
                    <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-slate-800 border border-red-500 mr-2"></div> 重度</div>
                    <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-cyan-600 mr-2"></div> 桥梁标注</div>
                </div>
                <div className="mt-1 opacity-50">Map Data © 2026 AutoNavi | 桥视·智检 - 桥梁巡检模式</div>
            </div>

            {/* Modal */}
            {selectedItem && (
                <DiseaseDetailModal disease={selectedItem} onClose={() => setSelectedItem(null)} onNavigate={onNavigate} />
            )}
        </div>
    );
};

export default CityMapView;
