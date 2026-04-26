import { AlertCircle, Lightbulb } from 'lucide-react';

export const DashboardWidgets = () => {
    return (
        <div className="space-y-3">
            {/* System Alerts */}
            <div className="bg-[#0f0f0f] border border-red-500/20 rounded-md p-4">
                <div className="flex items-center gap-2 mb-3">
                    <AlertCircle size={14} className="text-red-400" />
                    <h3 className="text-[11px] font-semibold text-gray-200 uppercase tracking-wider">System Alerts</h3>
                </div>
                <div className="space-y-2">
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-2.5 rounded text-[10px] font-medium">
                        High Server Load (CPU: 88%)
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 p-2.5 rounded text-[10px] font-medium">
                        12 users awaiting KYC approval
                    </div>
                </div>
            </div>

            {/* AI Insight */}
            <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-md p-4">
                <div className="flex items-center gap-2 mb-3">
                    <Lightbulb size={14} className="text-emerald-500" />
                    <h3 className="text-[11px] font-semibold text-gray-200 uppercase tracking-wider">AI Insight</h3>
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed">
                    AI detected <span className="text-emerald-500 font-medium">12% increase</span> in user engagement after last fund update.
                    Recommend promoting <span className="text-emerald-500 font-medium">high-performing funds</span> to maximize user retention.
                </p>
            </div>

            {/* Recent Admin Actions */}
            <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-md p-4">
                <h4 className="text-[11px] font-semibold text-gray-400 mb-3 uppercase tracking-wider">Recent Actions</h4>
                <div className="space-y-2 text-[10px] text-gray-500">
                    <div className="flex justify-between"><span>Admin updated fund NAV</span> <span className="text-gray-600">2m ago</span></div>
                    <div className="flex justify-between"><span>User account verified</span> <span className="text-gray-600">5m ago</span></div>
                    <div className="flex justify-between"><span>System backup completed</span> <span className="text-gray-600">15m ago</span></div>
                </div>
            </div>
        </div>
    );
};
