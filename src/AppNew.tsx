/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MAIN APP - Redux Provider & System Loader
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This wraps the entire application with Redux Provider and System Loader.
 * The old App.jsx functionality will be refactored into feature components.
 */

import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import store from './app/store';
import { useSystemLoader } from './hooks/useSystemLoader';
import { useAppSelector } from './app/hooks';
import { selectCompendiumStatus, selectCompendiumError } from './app/selectors';

// Placeholder components
const LoadingScreen = () => (
  <div style={styles.container}>
    <div style={styles.content}>
      <h1>🔄 RDO CHARACTER OS</h1>
      <p>Boot sequence in progress...</p>
      <div style={styles.spinner}></div>
    </div>
  </div>
);

const ErrorScreen = ({ error }: { error: string }) => (
  <div style={styles.container}>
    <div style={{ ...styles.content, background: '#8B0000' }}>
      <h1>❌ Boot Failed</h1>
      <p>{error}</p>
      <button onClick={() => window.location.reload()} style={styles.button}>
        Restart
      </button>
    </div>
  </div>
);

// Import the actual App UI from App.jsx
import RDO_Character_OS from './App';

const MainDashboard = () => <RDO_Character_OS />;

/**
 * Inner App Component (rendered after Provider)
 * This is where the actual app logic goes
 */
function AppContent() {
  const { isReady, isLoading, error } = useSystemLoader();
  
  // === FIX 1: Use Redux selectors for compendium status ===
  const compendiumStatus = useAppSelector(selectCompendiumStatus);
  const compendiumError = useAppSelector(selectCompendiumError);

  // Show loading screen while data is being fetched
  if (isLoading || compendiumStatus === 'loading' || compendiumStatus === 'idle') {
    return <LoadingScreen />;
  }
  
  // Show error screen if critical error occurred
  if (error || compendiumStatus === 'error') {
    return <ErrorScreen error={error || compendiumError || 'Unknown error'} />;
  }
  
  // Only render app when data is ready
  if (!isReady || compendiumStatus !== 'ready') {
    return <LoadingScreen />;
  }

  // Final State: Render the actual app
  return <MainDashboard />;
}

/**
 * Root App Component
 * Wraps everything in Redux Provider and system initialization
 */
export default function App() {
  return (
    <Provider store={store}>
      <Suspense fallback={<LoadingScreen />}>
        <AppContent />
      </Suspense>
    </Provider>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// STYLES (Will be replaced with Tailwind/CSS)
// ═══════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0a0a0a',
    color: '#f5deb3',
    fontFamily: 'monospace',
  } as React.CSSProperties,
  
  content: {
    padding: '40px',
    borderRadius: '8px',
    background: '#1a1410',
    border: '2px solid #D4AF37',
    textAlign: 'center',
    maxWidth: '500px',
  } as React.CSSProperties,
  
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #D4AF37',
    borderTop: '4px solid transparent',
    borderRadius: '50%',
    margin: '20px auto',
    animation: 'spin 1s linear infinite',
  } as React.CSSProperties,
  
  button: {
    padding: '10px 20px',
    background: '#D4AF37',
    color: '#2d2620',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '20px',
  } as React.CSSProperties,
  
  info: {
    background: '#0a0a0a',
    padding: '15px',
    borderRadius: '4px',
    fontSize: '11px',
    textAlign: 'left',
    marginTop: '20px',
    overflow: 'auto',
  } as React.CSSProperties,
};
