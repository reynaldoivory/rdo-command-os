// FILE: src/hooks/useSessionTracker.js
// Session tracking hook - records gameplay sessions for analytics
import { useEffect, useRef } from 'react';
import { usePersistentState } from './usePersistentState';

const DEFAULT_SESSION = {
  startTime: null,
  startProfile: null, // Snapshot of profile at session start
  endTime: null,
  endProfile: null, // Snapshot of profile at session end
  earnings: { cash: 0, gold: 0 },
  xpGains: { total: 0, roles: {} },
  activities: [], // Array of activity records
};

/**
 * Hook to track gameplay sessions
 * Automatically records session start/end and calculates metrics
 */
export function useSessionTracker(profileId, profile) {
  const [sessions, setSessions] = usePersistentState(`sessions_${profileId}`, []);
  const [currentSession, setCurrentSession] = usePersistentState(`current_session_${profileId}`, null);
  const sessionStartRef = useRef(null);
  const lastProfileRef = useRef(null);

  // Initialize session on mount if none exists
  useEffect(() => {
    if (!currentSession && profile) {
      const newSession = {
        ...DEFAULT_SESSION,
        startTime: Date.now(),
        startProfile: {
          cash: profile.cash || 0,
          gold: profile.gold || 0,
          xp: profile.xp || 0,
          rank: profile.rank || 1,
          roles: { ...(profile.roles || {}) }
        }
      };
      setCurrentSession(newSession);
      sessionStartRef.current = newSession.startTime;
      lastProfileRef.current = { ...newSession.startProfile };
    }
  }, [currentSession, profile, setCurrentSession]);

  // Track profile changes to calculate deltas
  useEffect(() => {
    if (!currentSession || !profile || !lastProfileRef.current) return;

    // Calculate earnings
    const cashDelta = (profile.cash || 0) - (lastProfileRef.current.cash || 0);
    const goldDelta = (profile.gold || 0) - (lastProfileRef.current.gold || 0);
    const xpDelta = (profile.xp || 0) - (lastProfileRef.current.xp || 0);

    // Only update if there's a meaningful change (avoid noise from rapid updates)
    if (Math.abs(cashDelta) > 0.01 || Math.abs(goldDelta) > 0.01 || Math.abs(xpDelta) > 0) {
      const roleDeltas = {};
      Object.keys(profile.roles || {}).forEach(roleKey => {
        const oldXP = lastProfileRef.current.roles[roleKey] || 0;
        const newXP = profile.roles[roleKey] || 0;
        if (newXP !== oldXP) {
          roleDeltas[roleKey] = newXP - oldXP;
        }
      });

      setCurrentSession(prev => ({
        ...prev,
        endTime: now,
        endProfile: {
          cash: profile.cash || 0,
          gold: profile.gold || 0,
          xp: profile.xp || 0,
          rank: profile.rank || 1,
          roles: { ...(profile.roles || {}) }
        },
        earnings: {
          cash: (prev.earnings?.cash || 0) + Math.max(0, cashDelta), // Only count positive earnings
          gold: (prev.earnings?.gold || 0) + Math.max(0, goldDelta)
        },
        xpGains: {
          total: (prev.xpGains?.total || 0) + Math.max(0, xpDelta),
          roles: Object.keys(roleDeltas).length > 0 ? {
            ...(prev.xpGains?.roles || {}),
            ...Object.fromEntries(
              Object.entries(roleDeltas).map(([key, delta]) => [key, (prev.xpGains?.roles?.[key] || 0) + Math.max(0, delta)])
            )
          } : (prev.xpGains?.roles || {})
        }
      }));

      lastProfileRef.current = {
        cash: profile.cash || 0,
        gold: profile.gold || 0,
        xp: profile.xp || 0,
        rank: profile.rank || 1,
        roles: { ...(profile.roles || {}) }
      };
    }
  }, [profile, currentSession, setCurrentSession]);

  // End current session and save to history
  const endSession = () => {
    if (!currentSession) return;

    const finalSession = {
      ...currentSession,
      endTime: Date.now(),
      endProfile: {
        cash: profile?.cash || 0,
        gold: profile?.gold || 0,
        xp: profile?.xp || 0,
        rank: profile?.rank || 1,
        roles: { ...(profile?.roles || {}) }
      }
    };

    // Calculate final earnings
    if (finalSession.startProfile && finalSession.endProfile) {
      finalSession.earnings = {
        cash: Math.max(0, finalSession.endProfile.cash - finalSession.startProfile.cash),
        gold: Math.max(0, finalSession.endProfile.gold - finalSession.startProfile.gold)
      };
      finalSession.xpGains = {
        total: Math.max(0, finalSession.endProfile.xp - finalSession.startProfile.xp),
        roles: Object.fromEntries(
          Object.keys(finalSession.endProfile.roles || {}).map(roleKey => [
            roleKey,
            Math.max(0, (finalSession.endProfile.roles[roleKey] || 0) - (finalSession.startProfile.roles[roleKey] || 0))
          ])
        )
      };
    }

    // Save to history (keep last 50 sessions)
    setSessions(prev => [finalSession, ...prev].slice(0, 50));
    setCurrentSession(null);
    sessionStartRef.current = null;
    lastProfileRef.current = null;
  };

  // Start new session
  const startSession = () => {
    if (currentSession) {
      endSession();
    }
    const newSession = {
      ...DEFAULT_SESSION,
      startTime: Date.now(),
      startProfile: {
        cash: profile?.cash || 0,
        gold: profile?.gold || 0,
        xp: profile?.xp || 0,
        rank: profile?.rank || 1,
        roles: { ...(profile?.roles || {}) }
      }
    };
    setCurrentSession(newSession);
    sessionStartRef.current = newSession.startTime;
    lastProfileRef.current = { ...newSession.startProfile };
  };

  return {
    currentSession,
    sessions,
    startSession,
    endSession,
    isActive: !!currentSession
  };
}
