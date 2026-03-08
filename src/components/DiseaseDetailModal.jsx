import React from 'react';
import { Camera, MoreHorizontal, Settings } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DiseaseDetailModal = ({ disease, onClose, onNavigate }) => {
    if (!disease) return null;

    // Mock Chart Data for modal
    const historyData = [
        { time: 'T-10', d: 0.2 }, { time: 'T-5', d: 1.5 }, { time: 'Now', d: 5.2 }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-[900px] max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 flex justify-between items-start border-b border-slate-100">
                    <div>
                        <div className="flex items-center space-x-3 mb-1">
                            <h2 className="text-xl font-bold text-slate-800">病害详情</h2>
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-600 border border-red-200">
                                {disease.type} · {disease.level}
                            </span>
                        </div>
                        <div className="flex space-x-4 text-xs text-slate-500 font-mono">
                            <span>ID: {disease.code}</span>
                            <span>Time: {disease.time}</span>
                            <span>Speed: {disease.speed} km/h</span>
                            <span>Loc: {disease.lng}, {disease.lat}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                        <MoreHorizontal size={24} className="text-slate-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-50">
                    {/* Left: AI Vision */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center px-1">
                            <h3 className="font-bold text-slate-700 flex items-center">
                                <Camera size={16} className="mr-2 text-blue-500" />
                                AI 视觉识别
                            </h3>
                            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">Confidence: 98.2%</span>
                        </div>
                        <div className="relative rounded-lg overflow-hidden border border-slate-300 bg-slate-200 aspect-video group">
                            <img src={disease.imageUrl} alt="Road Surface" className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 transition-all duration-500" />

                            {/* Bounding Box Overlay */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                <rect x="30%" y="40%" width="20%" height="15%" fill="none" stroke="#f97316" strokeWidth="3" strokeDasharray="10 5" className="animate-pulse" />
                            </svg>

                            {/* Label */}
                            <div className="absolute top-[35%] left-[30%] bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded shadow-lg">
                                {disease.type} ({disease.area}m²)
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="bg-white p-2 rounded border border-slate-200">
                                <div className="text-xs text-slate-400">面积</div>
                                <div className="font-bold text-slate-700">{disease.area} m²</div>
                            </div>
                            <div className="bg-white p-2 rounded border border-slate-200">
                                <div className="text-xs text-slate-400">长度</div>
                                <div className="font-bold text-slate-700">1.2 m</div>
                            </div>
                            <div className="bg-white p-2 rounded border border-slate-200">
                                <div className="text-xs text-slate-400">深度</div>
                                <div className="font-bold text-slate-700">35 mm</div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Analysis */}
                    <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg border border-slate-200 h-64 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-700 mb-4">病害劣化趋势</h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={historyData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                                    <YAxis tick={{ fontSize: 10 }} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="d" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Timeline Logic Step */}
                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                                <span>发现 (Detected)</span>
                                <span>识别 (Analyzed)</span>
                                <span>审核 (Reviewed)</span>
                                <span>派单 (Dispatched)</span>
                            </div>
                            <div className="relative h-2 bg-slate-100 rounded-full">
                                <div className="absolute top-0 left-0 h-full w-2/3 bg-blue-500 rounded-full"></div>
                                <div className="absolute top-0 left-0 w-3 h-3 bg-blue-600 rounded-full -mt-0.5 border-2 border-white shadow"></div>
                                <div className="absolute top-0 left-1/3 w-3 h-3 bg-blue-600 rounded-full -mt-0.5 border-2 border-white shadow"></div>
                                <div className="absolute top-0 left-2/3 w-3 h-3 bg-blue-600 rounded-full -mt-0.5 border-2 border-white shadow"></div>
                            </div>
                            <div className="mt-3 text-center">
                                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">
                                    当前状态: 待人工审核
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-white border border-slate-300 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">
                        暂时忽略
                    </button>
                    <button className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-sm font-medium hover:bg-blue-100">
                        加入重点关注
                    </button>
                    <button
                        onClick={() => {
                            if (onNavigate) {
                                onClose();
                                onNavigate('disease-orders', { initialDisease: disease });
                            }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-blue-700 flex items-center"
                    >
                        <Settings size={16} className="mr-2" />
                        生成维修工单
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DiseaseDetailModal;
