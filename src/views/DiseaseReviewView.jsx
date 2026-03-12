import React, { useState } from 'react';
import {
    CheckCircle2, XCircle, AlertOctagon, ArrowRight, Ruler, MapPin, Save, ShieldCheck, Plane
} from 'lucide-react';
import clsx from 'clsx';
import { MOCK_BRIDGE_DISEASES, DISEASE_TYPES } from '../MockData';
import { Card } from '../components/UIComponents';
import DiseaseDetailModal from '../components/DiseaseDetailModal';

const DiseaseReviewView = ({ onNavigate }) => {
    // 获取未处理或待审核的病害作为待审队列
    const [reviewQueue, setReviewQueue] = useState(MOCK_BRIDGE_DISEASES.filter(d => d.status === '待处理' || d.status === '待审核').slice(0, 5));
    const [reviewedCount, setReviewedCount] = useState(34);
    const [selectedDisease, setSelectedDisease] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(null);

    const startEditing = (disease) => {
        setEditForm({ ...disease });
        setIsEditing(true);
    };

    const handleSaveEdit = () => {
        setReviewQueue(prev => prev.map(d => d.id === editForm.id ? editForm : d));
        setIsEditing(false);
        handleReview(editForm.id, 'modified');
    };

    const handleReview = (id, result) => {
        // Animation/Transition effect later
        setReviewQueue(prev => prev.filter(d => d.id !== id));
        setReviewedCount(prev => prev + 1);
        console.log(`Disease ${id} reviewed: ${result}`);
    };

    const currentDisease = reviewQueue[0];
    const typeInfo = currentDisease ? DISEASE_TYPES.find(t => t.name === currentDisease.type) || { color: '#0f766e' } : null;

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500 h-[calc(100vh-64px)] overflow-y-auto bg-slate-50">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mr-4">
                        <ShieldCheck size={28} className="text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">AI检测结果专家复核中心</h2>
                        <p className="text-slate-500 text-sm mt-1">人工干预并校准无人机 AI 视觉识别的病害结果，构建高质量桥梁病害样本库</p>
                    </div>
                </div>
                <div className="flex items-center space-x-6 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="text-right">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">今日待审</div>
                        <div className="text-2xl font-black text-indigo-600 font-mono">{reviewQueue.length}</div>
                    </div>
                    <div className="w-px h-10 bg-slate-200"></div>
                    <div className="text-right">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">今日已审</div>
                        <div className="text-2xl font-black text-emerald-600 font-mono">{reviewedCount}</div>
                    </div>
                </div>
            </div>

            {reviewQueue.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border border-emerald-100 shadow-inner">
                        <CheckCircle2 size={48} className="text-emerald-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">所有AI识别结果已通过审核</h3>
                    <p className="text-slate-500 max-w-md mt-3 text-lg">当前无人机巡检批次的病害识别率与置信度均达到自动入库标准，无需人工干预。</p>
                    <button
                        onClick={() => onNavigate('disease-list')}
                        className="mt-8 px-8 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors shadow-lg shadow-slate-200 font-bold"
                    >
                        前往桥梁建库台账
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full pb-20">
                    {/* Main Review Card */}
                    <div className="lg:col-span-8 flex flex-col space-y-4">
                        {/* Image Area - AI Visualization */}
                        <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 aspect-video group shadow-xl">
                            <img
                                src={currentDisease.imageUrl || '/mock-bridges/image_02.jpg'}
                                alt="Bridge Disease"
                                className="w-full h-full object-cover opacity-80"
                            />
                            {/* Overlay UI */}
                            <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col gap-2">
                                        <span className="bg-slate-900/80 backdrop-blur text-white px-3 py-1.5 rounded-lg text-sm font-mono border border-slate-600 shadow-lg flex items-center">
                                            UID: {currentDisease.id}
                                        </span>
                                        <span className="bg-slate-900/80 backdrop-blur text-slate-300 px-3 py-1.5 rounded-lg text-xs font-mono border border-slate-600 shadow-lg flex items-center">
                                            <Plane size={12} className="mr-2 text-blue-400" />
                                            {currentDisease.bridgeName} ({currentDisease.component})
                                        </span>
                                    </div>
                                    <span className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg border border-indigo-400/50 flex items-center">
                                        AI 置信度: {(currentDisease.confidence * 100).toFixed(1)}%
                                    </span>
                                </div>

                                {/* Mock Polygon Mask representing AI Segmentation */}
                                <div className="absolute top-1/2 left-[45%] -translate-y-1/2 pointer-events-none">
                                    <svg width="200" height="150" viewBox="0 0 200 150">
                                        <polygon points="20,10 180,30 150,140 40,110" fill={typeInfo.color + "40"} stroke={typeInfo.color} strokeWidth="3" className="animate-pulse" />
                                    </svg>
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-[11px] px-2 py-1 rounded shadow-lg border border-slate-700 whitespace-nowrap">
                                        <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ backgroundColor: typeInfo.color }}></span>
                                        {currentDisease.type}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-3 gap-4">
                            <button
                                onClick={() => handleReview(currentDisease.id, 'pass')}
                                className="flex flex-col items-center justify-center p-5 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 hover:shadow-[0_4px_20px_rgba(16,185,129,0.15)] transition-all group"
                            >
                                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-emerald-100 transition-all">
                                    <CheckCircle2 size={28} />
                                </div>
                                <span className="font-bold text-slate-800 text-lg">入库 (Pass)</span>
                                <span className="text-xs text-slate-500 mt-1">确认 AI 分割与分类精准无误</span>
                            </button>

                            <button
                                onClick={() => startEditing(currentDisease)}
                                className={clsx(
                                    "flex flex-col items-center justify-center p-5 rounded-2xl transition-all group",
                                    isEditing ? "bg-indigo-50 border-indigo-400 ring-4 ring-indigo-100" : "bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-[0_4px_20px_rgba(99,102,241,0.15)]"
                                )}
                            >
                                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-indigo-100 transition-all">
                                    <Ruler size={28} />
                                </div>
                                <span className="font-bold text-slate-800 text-lg">微调 (Adjust)</span>
                                <span className="text-xs text-slate-500 mt-1">手工修正病害类别或量化边界</span>
                            </button>

                            <button
                                onClick={() => handleReview(currentDisease.id, 'reject')}
                                className="flex flex-col items-center justify-center p-5 bg-white border border-slate-200 rounded-2xl hover:border-rose-500 hover:shadow-[0_4px_20px_rgba(244,63,94,0.15)] transition-all group"
                            >
                                <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-rose-100 transition-all">
                                    <XCircle size={28} />
                                </div>
                                <span className="font-bold text-slate-800 text-lg">误报 (Discard)</span>
                                <span className="text-xs text-slate-500 mt-1">非结构性病害或光影误判</span>
                            </button>
                        </div>
                    </div>

                    {/* Details Panel */}
                    <div className="lg:col-span-4">
                        <Card className="flex flex-col h-full bg-white shadow-md border-slate-200">
                            <div className="border-b border-slate-100 pb-4 mb-5 flex justify-between items-center">
                                <h3 className="font-bold text-slate-800 flex items-center text-lg">
                                    <AlertOctagon className="mr-2 text-indigo-500" />
                                    {isEditing ? '手工微调量化属性' : 'AI 提取量化详情'}
                                </h3>
                                {isEditing && <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-bold uppercase tracking-wider">专家接管模式</span>}
                            </div>

                            {isEditing ? (
                                <div className="space-y-5">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">病害类别修正</label>
                                        <select
                                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-800"
                                            value={editForm.type}
                                            onChange={e => setEditForm({ ...editForm, type: e.target.value })}
                                        >
                                            <option value="混凝土裂缝">混凝土裂缝</option>
                                            <option value="剥落/掉块">剥落/掉块</option>
                                            <option value="钢筋裸露">钢筋裸露</option>
                                            <option value="钢结构锈蚀">钢结构锈蚀</option>
                                            <option value="泛碱/渗水">泛碱/渗水</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">严重等级评估</label>
                                        <select
                                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-800"
                                            value={editForm.severity}
                                            onChange={e => setEditForm({ ...editForm, severity: e.target.value })}
                                        >
                                            <option value="轻度">轻度</option>
                                            <option value="中度">中度</option>
                                            <option value="重度">重度</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">修正长度 (m)</label>
                                            <input
                                                type="number"
                                                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                                                value={editForm.quantification?.length_m || 0}
                                                onChange={e => setEditForm({ ...editForm, quantification: { ...editForm.quantification, length_m: e.target.value } })}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">修正面积 (m²)</label>
                                            <input
                                                type="number" step="0.01"
                                                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                                                value={editForm.quantification?.area_m2 || 0}
                                                onChange={e => setEditForm({ ...editForm, quantification: { ...editForm.quantification, area_m2: e.target.value } })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">重新标记构件</label>
                                        <input
                                            type="text"
                                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                                            value={editForm.component}
                                            onChange={e => setEditForm({ ...editForm, component: e.target.value })}
                                        />
                                    </div>
                                    <div className="pt-4 flex space-x-3">
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="w-1/3 py-2.5 border border-slate-300 text-slate-600 font-bold rounded-lg bg-white hover:bg-slate-50 transition"
                                        >
                                            放弃
                                        </button>
                                        <button
                                            onClick={handleSaveEdit}
                                            className="w-2/3 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-200 transition"
                                        >
                                            <Save size={18} className="mr-2" />
                                            通过并入库
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-5 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">病害类别</label>
                                            <div className="font-bold text-slate-800 text-lg">{currentDisease.type}</div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">严重评级</label>
                                            <div className={clsx(
                                                "font-bold text-lg inline-flex items-center",
                                                currentDisease.severity === '重度' ? 'text-rose-600' :
                                                    currentDisease.severity === '中度' ? 'text-orange-500' : 'text-emerald-600'
                                            )}>
                                                {currentDisease.severity}
                                            </div>
                                        </div>
                                        <div className="col-span-2 grid grid-cols-3 gap-2 py-2 border-t border-slate-200">
                                            {currentDisease.quantification?.length_m && (
                                                <div>
                                                    <label className="text-[10px] text-slate-500 block">系统提取长度</label>
                                                    <div className="font-mono font-bold text-indigo-700">{currentDisease.quantification.length_m} m</div>
                                                </div>
                                            )}
                                            {currentDisease.quantification?.max_width_mm && (
                                                <div>
                                                    <label className="text-[10px] text-slate-500 block">最大宽缝</label>
                                                    <div className="font-mono font-bold text-indigo-700">{currentDisease.quantification.max_width_mm} mm</div>
                                                </div>
                                            )}
                                            {currentDisease.quantification?.area_m2 && (
                                                <div>
                                                    <label className="text-[10px] text-slate-500 block">提取掩膜面积</label>
                                                    <div className="font-mono font-bold text-indigo-700">{currentDisease.quantification.area_m2} m²</div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-span-2 pt-2 border-t border-slate-200">
                                            <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">物理位置追溯</label>
                                            <div className="font-medium text-slate-700 flex items-center">
                                                <MapPin size={16} className="mr-2 text-red-500" />
                                                {currentDisease.bridgeName} — {currentDisease.component}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-bold text-blue-900 text-sm">类似高置信度样本流</h4>
                                            <span className="text-[10px] font-bold text-blue-600 cursor-pointer hover:underline uppercase tracking-wider">查看模型对比</span>
                                        </div>
                                        <div className="flex space-x-3 overflow-x-auto pb-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-24 h-16 bg-slate-200 rounded-lg flex-shrink-0 cursor-pointer hover:opacity-80 border border-slate-300 overflow-hidden shadow-sm">
                                                    <img src={`/mock-bridges/image_0${i}.jpg`} className="w-full h-full object-cover" alt="ref" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            onClick={() => setSelectedDisease(currentDisease)}
                                            className="w-full py-3.5 border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center group"
                                        >
                                            展开高保真数字档案
                                            <ArrowRight size={18} className="ml-2 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Disease Detail Modal overlay */}
                    <DiseaseDetailModal
                        disease={selectedDisease}
                        onClose={() => setSelectedDisease(null)}
                        onNavigate={onNavigate}
                    />
                </div>
            )}
        </div>
    );
};

export default DiseaseReviewView;
