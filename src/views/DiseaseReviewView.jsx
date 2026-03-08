import React, { useState } from 'react';
import {
    CheckCircle2, XCircle, AlertOctagon, ArrowRight, User, Ruler, MapPin, Save
} from 'lucide-react';
import clsx from 'clsx';
import { MOCK_DISEASES } from '../MockData';
import { Card } from '../components/UIComponents';
import DiseaseDetailModal from '../components/DiseaseDetailModal';

const DiseaseReviewView = ({ onNavigate }) => {
    // Mock review queue: Assuming items without a specific status are 'pending review'
    // For this prototype, we'll slice a few items from mock data to represent the review queue
    const [reviewQueue, setReviewQueue] = useState(MOCK_DISEASES.slice(0, 5));
    const [reviewedCount, setReviewedCount] = useState(12);
    const [selectedDisease, setSelectedDisease] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(null);

    const startEditing = (disease) => {
        setEditForm({ ...disease });
        setIsEditing(true);
    };

    const handleSaveEdit = () => {
        // Update the item in the queue with edited values
        setReviewQueue(prev => prev.map(d => d.id === editForm.id ? editForm : d));
        setIsEditing(false);
        // Then perform the review action (e.g., pass as modified)
        handleReview(editForm.id, 'modified');
    };

    const handleReview = (id, result) => {
        // Animation/Transition effect later
        // Remove from queue
        setReviewQueue(prev => prev.filter(d => d.id !== id));
        setReviewedCount(prev => prev + 1);

        // In a real app, send API request here
        console.log(`Disease ${id} reviewed: ${result}`);
    };

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500 h-[calc(100vh-64px)] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">病害智能审核 (AI Review)</h2>
                    <p className="text-slate-500 text-sm mt-1">人工复核 AI 识别的病害结果，确保数据准确性</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-right">
                        <div className="text-xs text-slate-500">今日待审</div>
                        <div className="text-xl font-bold text-blue-600">{reviewQueue.length}</div>
                    </div>
                    <div className="w-px h-8 bg-slate-200"></div>
                    <div className="text-right">
                        <div className="text-xs text-slate-500">今日已审</div>
                        <div className="text-xl font-bold text-green-600">{reviewedCount}</div>
                    </div>
                </div>
            </div>

            {reviewQueue.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 size={40} className="text-green-500" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">任务已完成</h3>
                    <p className="text-slate-500 max-w-sm mt-2">所有的待审核病害均已处理完毕。您可以休息一下，或者去查看病害台账。</p>
                    <button
                        onClick={() => onNavigate('disease-list')}
                        className="mt-6 px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
                    >
                        前往病害台账
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full pb-20">
                    {/* Main Review Card */}
                    <div className="lg:col-span-1 flex flex-col space-y-4">
                        {/* Image Area */}
                        <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video group shadow-lg">
                            <img
                                src={reviewQueue[0].imageUrl}
                                alt="Disease"
                                className="w-full h-full object-cover opacity-90"
                            />
                            {/* Overlay UI */}
                            <div className="absolute inset-0 p-6 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <span className="bg-black/60 backdrop-blur text-white px-3 py-1 rounded-full text-sm font-medium border border-white/20">
                                        ID: {reviewQueue[0].code}
                                    </span>
                                    <span className="bg-blue-600/90 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                        AI 置信度: 98.5%
                                    </span>
                                </div>

                                {/* Bounding Box (Mock) */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 border-2 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)] rounded-lg pointer-events-none">
                                    <div className="absolute -top-6 left-0 bg-orange-500 text-white text-xs px-2 py-0.5 rounded">
                                        {reviewQueue[0].type}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-3 gap-4">
                            <button
                                onClick={() => handleReview(reviewQueue[0].id, 'pass')}
                                className="flex flex-col items-center justify-center p-4 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 hover:border-green-300 transition-all group"
                            >
                                <div className="w-10 h-10 rounded-full bg-green-200 text-green-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                    <CheckCircle2 size={24} />
                                </div>
                                <span className="font-bold text-green-800">通过 (Pass)</span>
                                <span className="text-xs text-green-600/70 mt-1">确认AI识别准确</span>
                            </button>

                            <button
                                onClick={() => startEditing(reviewQueue[0])}
                                className={clsx(
                                    "flex flex-col items-center justify-center p-4 border rounded-xl transition-all group",
                                    isEditing ? "bg-blue-50 border-blue-300 ring-2 ring-blue-200" : "bg-white border-slate-200 hover:border-blue-400 hover:shadow-md"
                                )}
                            >
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                    <Ruler size={24} />
                                </div>
                                <span className="font-bold text-slate-700">修改 (Edit)</span>
                                <span className="text-xs text-slate-400 mt-1">调整类型或范围</span>
                            </button>

                            <button
                                onClick={() => handleReview(reviewQueue[0].id, 'reject')}
                                className="flex flex-col items-center justify-center p-4 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 hover:border-red-300 transition-all group"
                            >
                                <div className="w-10 h-10 rounded-full bg-red-200 text-red-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                    <XCircle size={24} />
                                </div>
                                <span className="font-bold text-red-800">误报 (Reject)</span>
                                <span className="text-xs text-red-600/70 mt-1">非病害或识别错误</span>
                            </button>
                        </div>
                    </div>

                    {/* Details Panel */}
                    <Card className="flex flex-col h-fit">
                        <div className="border-b border-slate-100 pb-4 mb-4 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800 flex items-center text-lg">
                                <AlertOctagon className="mr-2 text-orange-500" />
                                {isEditing ? '修改信息' : '识别详情'}
                            </h3>
                            {isEditing && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded font-bold">编辑中</span>}
                        </div>

                        {isEditing ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 block mb-1">病害类型</label>
                                    <select
                                        className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={editForm.type}
                                        onChange={e => setEditForm({ ...editForm, type: e.target.value })}
                                    >
                                        <option value="网状裂缝">网状裂缝</option>
                                        <option value="纵向裂缝">纵向裂缝</option>
                                        <option value="横向裂缝">横向裂缝</option>
                                        <option value="沉陷">沉陷</option>
                                        <option value="坑槽">坑槽</option>
                                        <option value="井盖破损">井盖破损</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 block mb-1">严重等级</label>
                                    <select
                                        className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={editForm.level}
                                        onChange={e => setEditForm({ ...editForm, level: e.target.value })}
                                    >
                                        <option value="轻度">轻度</option>
                                        <option value="中度">中度</option>
                                        <option value="重度">重度</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 block mb-1">预估面积 (m²)</label>
                                    <input
                                        type="number"
                                        className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={editForm.area}
                                        onChange={e => setEditForm({ ...editForm, area: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 block mb-1">所在道路</label>
                                    <input
                                        type="text"
                                        className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={editForm.road}
                                        onChange={e => setEditForm({ ...editForm, road: e.target.value })}
                                    />
                                </div>
                                <div className="pt-2 flex space-x-2">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="flex-1 py-2 border border-slate-300 text-slate-600 rounded bg-white hover:bg-slate-50"
                                    >
                                        取消
                                    </button>
                                    <button
                                        onClick={handleSaveEdit}
                                        className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold flex items-center justify-center shadow-lg shadow-blue-200"
                                    >
                                        <Save size={16} className="mr-2" />
                                        保存并通过
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-slate-400 block mb-1">病害类型</label>
                                        <div className="font-bold text-slate-800 text-lg">{reviewQueue[0].type}</div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-400 block mb-1">严重等级</label>
                                        <div className={clsx(
                                            "font-bold text-lg inline-flex items-center",
                                            reviewQueue[0].level === '重度' ? 'text-red-600' :
                                                reviewQueue[0].level === '中度' ? 'text-orange-500' : 'text-green-600'
                                        )}>
                                            {reviewQueue[0].level}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-400 block mb-1">预估面积</label>
                                        <div className="font-mono font-medium text-slate-700">{reviewQueue[0].area} m²</div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-400 block mb-1">所在道路</label>
                                        <div className="font-medium text-slate-700 flex items-center">
                                            <MapPin size={14} className="mr-1 text-slate-400" />
                                            {reviewQueue[0].road}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-bold text-slate-700 text-sm">类似病害推荐</h4>
                                        <span className="text-xs text-blue-600 cursor-pointer hover:underline">查看图库</span>
                                    </div>
                                    <div className="flex space-x-2 overflow-x-auto pb-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-24 h-16 bg-slate-200 rounded flex-shrink-0 cursor-pointer hover:opacity-80">
                                                <img src={`https://placehold.co/100x70/${i}00/FFF/png?text=Ref`} className="w-full h-full object-cover rounded" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <button
                                        onClick={() => setSelectedDisease(reviewQueue[0])}
                                        className="w-full py-3 border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center justify-center"
                                    >
                                        查看完整报告
                                        <ArrowRight size={16} className="ml-2" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </Card>
                    {/* Disease Detail Modal */}
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
