import React from 'react';
import { Activity } from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';

export const DiagnosticsPanel = () => {
    const { nextBestAction, analysisDiagnostics } = useProfile();
    const analysis = analysisDiagnostics || nextBestAction;
    const data = analysis;
    if (!data) return null;

    return (
        <div className="font-mono text-[10px] p-3 bg-black/90 border border-amber-500/20 rounded-lg mb-4 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-2 text-amber-500 mb-2 border-b border-amber-500/20 pb-1">
                <Activity size={12} /> ENGINE DIAGNOSTICS
            </div>
            <div className="grid grid-cols-2 gap-2 text-gray-400">
                <div>Rule ID: <span className="text-white">{data.diagnostics?.ruleId || 'N/A'}</span></div>
                <div>Phase: <span className="text-cyan-400">{data.phase || 'Unknown'}</span></div>
            </div>
            <div className="mt-2 text-gray-500">
                <div className="uppercase tracking-wider mb-0.5">Skip Trace:</div>
                <div className="text-gray-600 leading-tight">
                    {data.diagnostics?.skipTrace?.length > 0
                        ? data.diagnostics.skipTrace.map(s => `${s.id}`).join(', ')
                        : 'No skips recorded'}
                </div>
            </div>
        </div>
    );
};
