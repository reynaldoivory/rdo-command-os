// FILE: src/App.jsx
// RDO COMMAND OS.25 - The Infinite Horizon
// Clean Architecture: Container → Provider → Dashboard
import React, { useState, useEffect, useCallback } from 'react';
import './index.css';

// CONTEXT
import { ProfileProvider } from './context';

// CONSTANTS
import { STORAGE_KEYS } from './constants/storage';

// UTILS
import { validateProfileId, sanitizeProfileId, safeSetItem, validatePanelId } from './utils/security';

// HOOKS
import { useLayoutConfig } from './hooks/useLayoutConfig';

// COMPONENTS
import { ProfileManager } from './components/widgets/ProfileManager';
import { DraggableSection, LayoutEditToggle } from './components/DraggableSection';
import { Chronometer } from './components/widgets/Chronometer';
import { PanelsRegistry } from './components/PanelsRegistry';
import { ErrorBoundary } from './components/ErrorBoundary';

// --- SUB-COMPONENTS ---

/**
 * RDO-Themed Loading Skeleton
 * Replaces the generic gray box with a "Processing..." artifact
 * @returns {JSX.Element} Styled skeleton loader matching RDO aesthetic
 */
const WidgetSkeleton = () => (
  <div className="h-full min-h-[120px] w-full rounded border-2 border-[#D4AF37]/30 bg-black/40 p-4 relative overflow-hidden group">
    {/* Scanline effect */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#D4AF37]/5 to-transparent animate-scan" />
    <div className="flex items-center gap-2 mb-3 opacity-50">
      <div className="h-3 w-3 rounded-full bg-[#D4AF37]/50 animate-pulse" />
      <div className="h-3 w-24 bg-[#D4AF37]/20 rounded" />
    </div>
    <div className="space-y-2 opacity-30">
      <div className="h-2 w-full bg-[#D4AF37]/20 rounded" />
      <div className="h-2 w-3/4 bg-[#D4AF37]/20 rounded" />
    </div>
  </div>
);

/**
 * Dashboard Orchestrator
 * Handles layout engine and widget rendering
 * Decoupled from App.jsx for better separation of concerns
 * @returns {JSX.Element} Dashboard with header and main content grid
 */
const Dashboard = () => {
  const { leftSections, rightSections, moveSection, resetLayout } = useLayoutConfig();
  const [isEditingLayout, setIsEditingLayout] = useState(false);

  /**
   * Render a single section/widget
   * @param {string} sectionId - Panel ID from PanelsRegistry
   * @param {string} column - 'left' or 'right'
   * @param {number} index - Position in column
   * @param {number} total - Total sections in column
   * @returns {JSX.Element|null} DraggableSection component or null
   */
  const renderSection = useCallback((sectionId, column, index, total) => {
    // Security: Validate panel ID against whitelist
    if (!validatePanelId(sectionId)) {
      console.warn(`[Security] Invalid panel ID: ${sectionId}`);
      return null;
    }
    
    const Component = PanelsRegistry[sectionId];
    if (!Component || typeof Component !== 'function') {
      return null;
    }
    
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
        <React.Suspense fallback={<WidgetSkeleton />}>
          <Component />
        </React.Suspense>
      </DraggableSection>
    );
  }, [moveSection, isEditingLayout]);

  return (
    <>
      <header className="max-w-7xl mx-auto mb-8 border-b border-[#D4AF37]/20 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-rdo-paper tracking-tighter drop-shadow-md">
            RDO COMMAND <span className="text-[#D4AF37] font-light text-xl">OS.25</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-mono tracking-wide">
            SYSTEM STATUS: ONLINE // PROTOCOL: INFINITE
          </p>
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
        <div className={`lg:col-span-4 space-y-6 transition-all duration-300 ${isEditingLayout ? 'pl-8 border-l-2 border-dashed border-[#D4AF37]/30' : ''}`}>
          {leftSections.map((sectionId, index) => renderSection(sectionId, 'left', index, leftSections.length))}
        </div>
        <div className={`lg:col-span-8 space-y-6 transition-all duration-300 ${isEditingLayout ? 'pl-8 border-l-2 border-dashed border-[#D4AF37]/30' : ''}`}>
          {rightSections.map((sectionId, index) => renderSection(sectionId, 'right', index, rightSections.length))}
        </div>
      </main>
    </>
  );
};

// --- LOGIC HOOKS ---

/**
 * Global error logging hook
 * Replaces unsafe <script> tag injection with proper React hook
 * Logs window errors and unhandled promise rejections for E2E debugging
 */
function useGlobalErrorLogging() {
  useEffect(() => {
    const handleError = (e) => console.error('[WindowError]', e.error || e.message);
    const handleRejection = (e) => console.error('[UnhandledRejection]', e.reason);
    
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);
}

// --- MAIN ENTRY ---

/**
 * App Component - Root Container
 * Manages profile switching, persistence, and provider lifecycle
 * @returns {JSX.Element} Main application shell
 */
export default function App() {
  useGlobalErrorLogging();
  
  const [currentProfileId, setCurrentProfileId] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_SLOT);
    if (stored && validateProfileId(stored)) {
      return stored;
    }
    return 'Main';
  });
  const [resetKey, setResetKey] = useState(0);

  /**
   * Switch to a different profile slot
   * @param {string} id - Profile identifier
   */
  const handleSwitchProfile = (id) => {
    const sanitized = sanitizeProfileId(id);
    if (!sanitized) {
      console.error('[Security] Invalid profile ID:', id);
      return;
    }
    safeSetItem(STORAGE_KEYS.ACTIVE_SLOT, sanitized);
    setCurrentProfileId(sanitized);
  };

  /**
   * Clone current profile to a new slot
   * @param {string} newId - New profile identifier
   */
  const handleCloneProfile = async (newId) => {
    const sanitized = sanitizeProfileId(newId);
    if (!sanitized) {
      console.error('[Security] Invalid profile ID for clone:', newId);
      return;
    }
    
    const currentData = localStorage.getItem(STORAGE_KEYS.PROFILE(currentProfileId));
    const currentCart = localStorage.getItem(STORAGE_KEYS.CART(currentProfileId));
    
    // Validate data exists and isn't corrupted
    if (currentData) {
      try {
        JSON.parse(currentData); // Validate JSON
        await safeSetItem(STORAGE_KEYS.PROFILE(sanitized), currentData);
      } catch (error) {
        console.error('[Security] Invalid profile data, cannot clone:', error);
        return;
      }
    }
    
    if (currentCart) {
      try {
        JSON.parse(currentCart); // Validate JSON
        await safeSetItem(STORAGE_KEYS.CART(sanitized), currentCart);
      } catch (error) {
        console.error('[Security] Invalid cart data, cannot clone:', error);
        return;
      }
    }
    
    handleSwitchProfile(sanitized);
  };

  /**
   * Reset current profile (factory reset)
   * Clears all data and forces provider remount
   */
  const handleResetProfile = () => {
    if (window.confirm('WARNING: This will wipe all data for this profile. Continue?')) {
      localStorage.removeItem(STORAGE_KEYS.PROFILE(currentProfileId));
      localStorage.removeItem(STORAGE_KEYS.CART(currentProfileId));
      setResetKey(k => k + 1);
    }
  };

  return (
    <div className="min-h-screen bg-rdo-dark text-rdo-paper font-body p-4 lg:p-8">
      <div className="fixed top-4 right-4 z-50">
        <ProfileManager 
          currentProfileId={currentProfileId} 
          setProfileId={handleSwitchProfile} 
          onClone={handleCloneProfile} 
          onReset={handleResetProfile} 
        />
      </div>

      <ProfileProvider key={`${currentProfileId}-${resetKey}`} profileId={currentProfileId}>
        <ErrorBoundary>
          <Dashboard />
        </ErrorBoundary>
      </ProfileProvider>
    </div>
  );
}
