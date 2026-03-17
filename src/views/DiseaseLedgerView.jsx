import React, { useState } from 'react';
import {
    Search, Filter, RotateCcw, MoreHorizontal, Eye, Settings, Trash2, MapPin, Calendar, Activity
} from 'lucide-react';
import clsx from 'clsx';
import { MOCK_BRIDGE_DISEASES, DISEASE_TYPES } from '../MockData';
import { Card } from '../components/UIComponents';
import DiseaseDetailModal from '../components/DiseaseDetailModal';

const DiseaseLedgerView = ({ onNavigate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [severityFilter, setSeverityFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [componentFilter, setComponentFilter] = useState('all');
    const [selectedDisease, setSelectedDisease] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    
    // Export state
    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);

    const filteredDiseases = MOCK_BRIDGE_DISEASES.filter(d => {
        const matchesSearch = d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.bridgeName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || d.type === typeFilter;
        const matchesSeverity = severityFilter === 'all' || d.severity === severityFilter;
        const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
        const matchesComponent = componentFilter === 'all' || d.component === componentFilter;
        return matchesSearch && matchesType && matchesSeverity && matchesStatus && matchesComponent;
    });

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
        if (confirm(`确定要将重新评估选中的 ${selectedIds.length} 项评估结果吗？`)) {
            alert(`已将 ${selectedIds.length} 项病害重置为待评估状态。`);
            setSelectedIds([]);
        }
    };

    const handleExport = () => {
        setIsExporting(true);
        setExportProgress(0);
        const interval = setInterval(() => {
            setExportProgress(p => {
                if (p >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setIsExporting(false), 800);
                    return 100;
                }
                return p + Math.floor(Math.random() * 10) + 5;
            });
        }, 150);
    };

    const handleDelete = (id) => {
        if (confirm('确定要删除这条病害记录吗？此操作不可恢复。')) {
            alert('Mock delete: ' + id);
        }
    };

    return (
        <div className="p-6 space-y-4 animate-in fade-in duration-500 relative">
            {/* Export Overlay */}
            {isExporting && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm rounded-xl">
                    <div className="bg-white p-6 rounded-xl shadow-2xl w-80 text-center animate-in zoom-in-95">
                        <div className="text-blue-600 mb-2 font-bold text-lg">正在生成分析报告 PDF</div>
                        <div className="text-slate-500 text-xs mb-4">正在汇编无人机航拍图与AI标图数据...</div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-blue-600 rounded-full transition-all duration-200" style={{ width: `${exportProgress}%` }}></div>
                        </div>
                        <div className="text-sm font-bold text-slate-700">{exportProgress}%</div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">桥梁病害台账</h2>
                    <p className="text-slate-500 text-sm mt-1">所有已识别桥梁表观病害的详细记录与管理</p>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow-sm flex items-center text-sm font-medium transition-colors">
                        <Search size={16} className="mr-2" />
                        查询
                    </button>
                    <button
                        onClick={() => { setSearchTerm(''); setTypeFilter('all'); setSeverityFilter('all'); setStatusFilter('all'); setComponentFilter('all'); }}
                        className="px-4 py-2 bg-white text-slate-600 border border-slate-300 rounded hover:bg-slate-50 shadow-sm flex items-center text-sm font-medium transition-colors"
                    >
                        <RotateCcw size={16} className="mr-2" />
                        重置
                    </button>
                </div>
            </div>

            {/* Filters */}
            <Card className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-1 lg:col-span-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">搜索关键词</label>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                        placeholder="编号 / 桥梁"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">病害类型</label>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                    >
                        <option value="all">全部类型</option>
                        {DISEASE_TYPES.map(dt => (
                            <option key={dt.code} value={dt.name}>{dt.name}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">严重等级</label>
                    <select 
                        value={severityFilter}
                        onChange={(e) => setSeverityFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow">
                        <option value="all">全部等级</option>
                        <option value="重度">重度</option>
                        <option value="中度">中度</option>
                        <option value="轻度">轻度</option>
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">构件部位</label>
                    <select 
                        value={componentFilter}
                        onChange={(e) => setComponentFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow">
                        <option value="all">全部部位</option>
                        <option value="桥面铺装">桥面铺装</option>
                        <option value="主梁">主梁</option>
                        <option value="桥墩">桥墩</option>
                        <option value="桥台">桥台</option>
                        <option value="桥塔">桥塔</option>
                        <option value="拉索/吊杆">拉索/吊杆</option>
                        <option value="伸缩缝装置">伸缩缝装置</option>
                        <option value="支座">支座</option>
                        <option value="梁底">梁底</option>
                        <option value="盖梁">盖梁</option>
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">处置状态</label>
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow">
                        <option value="all">全部状态</option>
                        <option value="待处理">待处理</option>
                        <option value="已上报">已上报</option>
                        <option value="维修中">维修中</option>
                        <option value="已修复">已修复</option>
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
                                重新评估 ({selectedIds.length})
                            </button>
                        )}
                        <button onClick={handleExport} className="text-white bg-green-600 border border-green-700 hover:bg-green-700 px-3 py-1.5 rounded text-sm font-medium transition-colors shadow-sm">
                            导出评估报告 (PDF)
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 whitespace-nowrap">
                                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        checked={selectedIds.length === Math.min(10, filteredDiseases.length) && filteredDiseases.length > 0}
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
