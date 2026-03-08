import React from 'react';
import { Camera, Info } from 'lucide-react';

/**
 * 实时视频视图 - 原有占位组件
 * 完整的AI巡检功能请使用 "AI驾驶舱" 页面
 */
const InspectionVideoView = () => {
    return (
        <div className="h-full flex items-center justify-center bg-slate-100">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera size={32} className="text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">实时视频监控</h2>
                <p className="text-slate-500 mb-4">
                    此页面为基础视频流查看功能。
                </p>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-start text-left">
                        <Info size={18} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-blue-700">
                            如需使用完整的 <strong>AI智能检测</strong> 功能，请访问侧边栏中的
                            <strong> "AI驾驶舱"</strong> 页面。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InspectionVideoView;
