# RDO Command OS Architecture

## Overview

Context-First React app. No prop drilling. State managed via ProfileContext.

## Folder Structure

- `src/context/` - Global state (ProfileContext split into hooks/constants/provider)
  - `ProfileContext.jsx` - Main provider component
  - `profileHooks.js` - React hooks (useProfile, useCart, useWallet)
  - `profileConstants.js` - Default profile and constants
  - `profileContextInstance.js` - Context instance creation
  - `index.js` - Central export point

- `src/components/widgets/` - Reusable UI panels (Wallet, Roles, MissionControl, etc.)

- `src/components/layout/` - Dashboard orchestrator

- `src/components/common/` - Shared UI primitives (ItemImage, etc.)

- `src/logic/` - Pure business logic (nextBestAction, etc.)

- `src/engine/` - Decision trees and algorithms

- `src/hooks/` - Reusable data access hooks

- `src/data/` - Static configuration and schemas

- `src/utils/` - Generic utilities (geo, graph, schedule, etc.)

## Key Patterns

- **Context-First**: Shared state via React Context, not prop drilling
- **Registry Pattern**: `PanelsRegistry.jsx` maps section IDs to components
- **Persistent State**: `usePersistentState` hook handles localStorage with versioning
- **Edit Modes**: Wallet and Roles have explicit edit modes with Save/Cancel

