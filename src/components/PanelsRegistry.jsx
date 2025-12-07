// FILE: src/components/PanelsRegistry.jsx
// Simple static registry mapping sectionId -> React component
import React from 'react';
import { MissionControl } from './widgets/MissionControl';
import { WalletPanel } from './widgets/WalletPanel';
// Also export widget alias for Registry consistency (widgets/WalletWidget)
import { WalletWidget } from './widgets/WalletWidget';
import { RolesPanel } from './widgets/RolesPanel';
import { TravelMap } from './widgets/TravelMap';
import { MissionTimer } from './widgets/MissionTimer';
import { DailyOracle } from './widgets/DailyOracle';
import { OutlawAlmanac } from './widgets/OutlawAlmanac';
import { WardrobeTracker } from './widgets/WardrobeTracker';
import { CommandCenter } from './CommandCenter';
import { SpecialsBanner } from './widgets/SpecialsBanner';
import { CommandSearch } from './CommandSearch';
const EfficiencyEngine = React.lazy(() => import('./EfficiencyEngine'));
const HuntingTerminal = React.lazy(() => import('./widgets/HuntingTerminal'));
import { Compendium } from './widgets/Compendium';
import { ShopColumn } from './widgets/ShopColumn';
import { CatalogGrid } from './widgets/CatalogGrid';
import { FilterBar } from './widgets/FilterBar';
import { FiltersPanel } from './FiltersPanel';
import { CartPanel } from './widgets/CartPanel';
import { DiagnosticsPanel } from './widgets/DiagnosticsPanel';

export const PanelsRegistry = {
    mission: MissionControl,
    wallet: WalletWidget || WalletPanel,
    roles: RolesPanel,
    travel: TravelMap,
    timer: MissionTimer,
    dailies: DailyOracle,
    almanac: OutlawAlmanac,
    wardrobe: WardrobeTracker,

    // right column
    command: CommandCenter,
    specials: SpecialsBanner,
    search: CommandSearch,
    efficiency: EfficiencyEngine,
    hunting: HuntingTerminal,
    compendium: Compendium,
    catalog: CatalogGrid || ShopColumn,
    filters: FilterBar || FiltersPanel,
    cart: CartPanel,

    // dev diagnostics
    diagnostics: DiagnosticsPanel,
};

// Runtime registration API
export const registerPanel = (id, component, options = {}) => {
    // Don't register dev-only panels in production
    if (options.devOnly && import.meta.env.PROD) return;
    PanelsRegistry[id] = component;
};

// Helper to get a panel component (friendly API)
export const getPanel = (id) => PanelsRegistry[id];
