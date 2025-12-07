// FILE: src/App.jsx
// RDO COMMAND OS.25 - The Infinite Horizon
// Clean Architecture: Container → Provider → Dashboard
import React, { useState } from 'react';
import './index.css';

// CONTEXT - Stage 2 State Management
import { ProfileProvider } from './context';

// DATA & UTIL HOOKS
import { useLayoutConfig } from './hooks/useLayoutConfig';

// COMPONENTS
import { ProfileManager } from './components/widgets/ProfileManager';
import { DraggableSection, LayoutEditToggle } from './components/DraggableSection';
import { Chronometer } from './components/widgets/Chronometer';
import { PanelsRegistry } from './components/PanelsRegistry';
import { MissionControl } from './components/widgets/MissionControl';
import { CommandCenter } from './components/CommandCenter';

// Dashboard: Minimal orchestrator using PanelsRegistry
const Dashboard = () => {
  const { leftSections, rightSections, moveSection, resetLayout } = useLayoutConfig();
  const [isEditingLayout, setIsEditingLayout] = useState(false);

  const renderSection = (sectionId, column, index, total) => {
    // console.log('renderSection', sectionId);
    const Component = PanelsRegistry[sectionId];
    if (!Component) return null;
    return (
      <DraggableSection
        key={sectionId}
        id={sectionId}
        column={column}
        index={index}
        total={total}
        onMove={moveSection}
        editMode={isEditingLayout}
      >
        <React.Suspense fallback={<div className="h-20 animate-pulse bg-black/20 rounded" />}>
          <Component />
        </React.Suspense>
      </DraggableSection>
    );
  };

  return (
    <>
      <header className="max-w-7xl mx-auto mb-8 border-b border-[#D4AF37]/20 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">
            RDO COMMAND <span className="text-gray-600 font-light text-xl">OS.25</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Workflow Optimization & Economy Simulator</p>
        </div>
        <div className="flex items-end gap-4">
          <Chronometer />
          <LayoutEditToggle
            isEditing={isEditingLayout}
            onToggle={() => setIsEditingLayout(!isEditingLayout)}
            onReset={resetLayout}
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className={`lg:col-span-4 space-y-6 ${isEditingLayout ? 'pl-8' : ''}`}>
          {leftSections.map((sectionId, index) => renderSection(sectionId, 'left', index, leftSections.length))}
        </div>
        <div className={`lg:col-span-8 space-y-6 ${isEditingLayout ? 'pl-8' : ''}`}>
          {rightSections.map((sectionId, index) => renderSection(sectionId, 'right', index, rightSections.length))}
        </div>
      </main>
    </>
  );
};

export default function App() {
  const [currentProfileId, setCurrentProfileId] = useState(() => localStorage.getItem('rdo_active_slot') || 'Main');

  const handleSwitchProfile = (id) => {
    localStorage.setItem('rdo_active_slot', id);
    setCurrentProfileId(id);
  };

  const handleCloneProfile = (newId) => {
    const currentData = localStorage.getItem(`rdo_os_profile_${currentProfileId}`);
    const currentCart = localStorage.getItem(`rdo_os_cart_${currentProfileId}`);
    if (currentData) localStorage.setItem(`rdo_os_profile_${newId}`, currentData);
    if (currentCart) localStorage.setItem(`rdo_os_cart_${newId}`, currentCart);
    handleSwitchProfile(newId);
  };

  const handleResetProfile = () => {
    localStorage.removeItem(`rdo_os_profile_${currentProfileId}`);
    localStorage.removeItem(`rdo_os_cart_${currentProfileId}`);
    const tempKey = `__reset_${Date.now()}`;
    setCurrentProfileId(tempKey);
    setTimeout(() => setCurrentProfileId(currentProfileId), 0);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans p-4 lg:p-8">
      <div className="fixed top-4 right-4 z-50">
        <ProfileManager currentProfileId={currentProfileId} setProfileId={handleSwitchProfile} onClone={handleCloneProfile} onReset={handleResetProfile} />
      </div>

      <ProfileProvider key={currentProfileId} profileId={currentProfileId}>
        {/* Global window error logging for E2E debugging */}
        <script dangerouslySetInnerHTML={{ __html: `window.addEventListener('error', e => console.error('[WindowError]', e.error || e.message)); window.addEventListener('unhandledrejection', e => console.error('[UnhandledRejection]', e.reason));` }} />
        <Dashboard />
      </ProfileProvider>
    </div>
  );
}
