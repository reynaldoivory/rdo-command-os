// FILE: src/context/index.js
// Central export point for ProfileContext and related hooks
// This allows backward compatibility while keeping fast refresh happy

export { ProfileProvider } from './ProfileContext';
export { useProfile, useCart, useWallet } from './profileHooks';

