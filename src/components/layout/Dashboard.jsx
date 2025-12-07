// FILE: src/components/layout/Dashboard.jsx
// Layout orchestrator that renders panels from PanelsRegistry
import React from 'react';
import { PanelsRegistry } from '../PanelsRegistry';

/**
 * Dashboard component - orchestrates panel rendering from registry
 * @param {Object} props
 * @param {Object} props.layoutConfig - Optional config with active panel IDs
 * @param {string[]} props.layoutConfig.panels - Array of panel IDs to render (defaults to all registry entries)
 */
const Dashboard = ({ layoutConfig }) => {
  // Get active panels from config, or default to all registry entries
  const activePanels = layoutConfig?.panels || Object.keys(PanelsRegistry);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {activePanels.map((panelId) => {
        const Component = PanelsRegistry[panelId];
        if (!Component) return null;

        return (
          <React.Suspense
            key={panelId}
            fallback={<div className="h-20 animate-pulse bg-black/20 rounded" />}
          >
            <Component />
          </React.Suspense>
        );
      })}
    </div>
  );
};

export default Dashboard;

