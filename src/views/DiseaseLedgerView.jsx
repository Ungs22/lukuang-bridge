import React, { useState } from 'react';
import {
    Search, Filter, RotateCcw, MoreHorizontal, Eye, Settings, Trash2, MapPin, Calendar, Activity
} from 'lucide-react';
import clsx from 'clsx';
import { MOCK_BRIDGE_DISEASES } from '../MockData';
import { Card } from '../components/UIComponents';
import DiseaseDetailModal from '../components/DiseaseDetailModal';

const DiseaseLedgerView = ({ onNavigate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [selectedDisease, setSelectedDisease] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(filteredDiseases.map(d => d.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(sid => sid !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleBatchRevert = () => {
        if (confirm(`确定要将选中的 ${selectedIds.length} 项恢复为"待审核"状态吗？`)) {
            alert(`已将 ${selectedIds.length} 项病害重置为待审核状态。`);
            setSelectedIds([]);
        }
    };

    const filteredDiseases = MOCK_BRIDGE_DISEASES.filter(d => {
        const matchesSearch = d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.bridgeName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || d.type === typeFilter;
        return matchesSearch && matchesType;
    });

    const handleDelete = (id) => {
        if (confirm('确定要删除这条病害记录吗？此操作不可恢复。')) {
            alert('Mock delete: ' + id);
        }
    };

    return (
        <div className="p-6 space-y-4 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">桥梁病害台账</h2>
                    <p className="text-slate-500 text-sm mt-1">所有已识别桥梁表观病害的详细记录与管理</p>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow-sm flex items-center text-sm font-medium">
                        <Search size={16} className="mr-2" />
                        查询
                    </button>
                    <button
                        onClick={() => { setSearchTerm(''); setTypeFilter('all'); }}
                        className="px-4 py-2 bg-white text-slate-600 border border-slate-300 rounded hover:bg-slate-50 shadow-sm flex items-center text-sm font-medium"
                    >
                        <RotateCcw size={16} className="mr-2" />
                        重置
                    </button>
                </div>
            </div>

            {/* Filters */}
            <Card className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500">搜索关键词</label>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="病害编号 / 桥梁名称"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500">病害类型</label>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">全部类型</option>
                        <option value="混凝土裂缝">混凝土裂缝</option>
                        <option value="剥落/掉块">剥落/掉块</option>
                        <option value="钢筋裸露">钢筋裸露</option>
                        <option value="钢结构锈蚀">钢结构锈蚀</option>
                        <option value="泛碱/渗水">泛碱/渗水</option>
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500">严重等级</label>
                    <select className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="all">全部等级</option>
                        <option value="high">重度</option>
                        <option value="medium">中度</option>
                        <option value="low">轻度</option>
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500">处置状态</label>
                    <select className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="all">全部状态</option>
                        <option value="pending">待处置</option>
                        <option value="processing">处置中</option>
                        <option value="completed">已归档</option>
                    </select>
                </div>
            </Card>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="text-sm text-slate-500">共找到 <strong className="text-slate-800">{filteredDiseases.length}</strong> 条记录</div>
                    <div className="flex items-center space-x-3">
                        {selectedIds.length > 0 && (
                            <button onClick={handleBatchRevert}
                                className="text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded text-sm font-medium hover:bg-orange-100 transition-colors">
                                重置为待审核 ({selectedIds.length})
                            </button>
                        )}
                        <button className="text-blue-600 text-sm font-medium hover:underline">导出 Excel</button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 whitespace-nowrap">
                                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        checked={selectedIds.length === filteredDiseases.length && filteredDiseases.length > 0}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th className="px-6 py-3 whitespace-nowrap">病害编号</th>
                                <th className="px-6 py-3 whitespace-nowrap">类型 / 等级</th>
                                <th className="px-6 py-3 whitespace-nowrap">所属桥梁</th>
                                <th className="px-6 py-3 whitespace-nowrap">构件部位</th>
                                <th className="px-6 py-3 whitespace-nowrap">尺寸信息</th>
                                <th className="px-6 py-3 whitespace-nowrap">发现时间</th>
                                <th className="px-6 py-3 whitespace-nowrap">状态</th>
                                <th className="px-6 py-3 text-right whitespace-nowrap">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredDiseases.slice(0, 10).map((item) => (
                                <tr key={item.id} className={clsx("hover:bg-blue-50/30 transition-colors group", selectedIds.includes(item.id) && "bg-blue-50/40")}>
                                    <td className="px-6 py-4">
                                        <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            checked={selectedIds.includes(item.id)}
                                            onChange={() => handleSelectOne(item.id)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-mono text-slate-700 font-medium">{item.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-800">{item.type}</span>
                                            <span className={clsx("text-xs w-fit px-1.5 py-0.5 rounded mt-1",
                                                item.severity === '重度' ? 'bg-red-100 text-red-600' :
                                                    item.severity === '中度' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                                            )}>
                                                {item.severity}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col text-slate-600">
                                            <span className="font-medium flex items-center"><MapPin size={12} className="mr-1" /> {item.bridgeName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{item.component}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-mono text-slate-600 text-xs">
                                            {item.dimensions ? `${item.dimensions.length}m × ${item.dimensions.width}mm` : '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        <div className="flex items-center">
                                            <Calendar size={14} className="mr-1.5 text-slate-400" />
                                            {item.detectTime}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-orange-50 text-orange-600 border border-orange-100 flex items-center w-fit whitespace-nowrap">
                                            <Activity size={12} className="mr-1.5 flex-shrink-0" /> 待审核
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2 opacity-100">
                                            <button onClick={() => setSelectedDisease(item)}
                                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="查看详情">
                                                <Eye size={18} />
                                            </button>
                                            <button onClick={() => onNavigate('work-orders', { initialDisease: item })}
                                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="生成工单">
                                                <Settings size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(item.id)}
                                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="删除">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 bg-slate-50/50">
                    <span className="text-sm text-slate-500">显示 {Math.min(10, filteredDiseases.length)} 条，共 {filteredDiseases.length} 条</span>
                    <div className="flex items-center space-x-1">
                        <button className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-500 hover:bg-white disabled:opacity-50" disabled>上一页</button>
                        <button className="px-3 py-1 border border-blue-500 bg-blue-50 text-blue-600 rounded text-sm font-medium">1</button>
                        <button className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-500 hover:bg-white">2</button>
                        <button className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-500 hover:bg-white">下一页</button>
                    </div>
                </div>
            </div>

            <DiseaseDetailModal
                disease={selectedDisease}
                onClose={() => setSelectedDisease(null)}
                onNavigate={onNavigate}
            />
        </div>
    );
};

export default DiseaseLedgerView;
