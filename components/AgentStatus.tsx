
import React from 'react';
import { AgentLog } from '../types';
import { Activity, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

const icons = {
  pending: <Activity className="w-5 h-5 text-gray-400" />,
  processing: <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />,
  completed: <CheckCircle className="w-5 h-5 text-green-500" />,
  error: <AlertCircle className="w-5 h-5 text-red-500" />,
};

interface AgentStatusProps {
  logs: AgentLog[];
}

export const AgentStatus: React.FC<AgentStatusProps> = ({ logs }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 w-full">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Multi-Agent Orchestration</h3>
      <div className="space-y-3">
        {logs.map((log, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="mt-0.5">{icons[log.status]}</div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-800 text-sm">{log.agentName}</span>
                <span className="text-[10px] text-slate-400">{log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{log.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
