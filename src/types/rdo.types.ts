// FILE: src/types/rdo.types.ts
// Domain types for the RDO Command-OS decision engine

// ═══════════════════════════════════════════════════════════════════════════
// PROFILE & GAME STATE
// ═══════════════════════════════════════════════════════════════════════════

export interface RDORoles {
  bountyHunter: number;
  trader: number;
  collector: number;
  moonshiner: number;
  naturalist: number;
}

export interface TraderState {
  goodsPercent: number;
}

export interface RDOProfile {
  rank: number;
  xp: number;
  cash: number;
  gold: number;
  tokens?: number;
  location?: string;
  roles: Partial<RDORoles>;
  traderState?: TraderState;
}

export interface WagonState {
  load?: number;
  fillPercent?: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// DECISION RULES CONFIG
// ═══════════════════════════════════════════════════════════════════════════

export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';
export type PhaseFocus = 'CASH' | 'EFFICIENCY' | 'GOLD';
export type PhaseId = 'early' | 'mid' | 'late';
export type RecommendationType = 'critical' | 'warning' | 'info';

export interface Phase {
  id: PhaseId;
  name: string;
  color: string;
  range: [number, number];
  focus: PhaseFocus;
  description: string;
}

export interface Priority {
  level: PriorityLevel;
  order: number;
  badge: string;
  style: string;
}

export type VectorCategory =
  | 'TRADER'
  | 'BOUNTY'
  | 'COLLECTOR'
  | 'MOONSHINER'
  | 'FREE_ROAM'
  | 'DAILIES';

export interface Vector {
  id: string;
  icon: string;
  category: VectorCategory;
  baseYield: string | null;
  description: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// ACTION RECOMMENDATIONS (nextBestAction output)
// ═══════════════════════════════════════════════════════════════════════════

export interface ActionDetail {
  icon: string;
  text: string;
  subtext: string;
  impact: string;
}

export interface SecondaryAction {
  text: string;
}

export interface RuleResult {
  priority: PriorityLevel;
  primary: ActionDetail;
  secondary: SecondaryAction | null;
  constraints: string[];
}

export interface ActionRecommendation {
  phase: Phase;
  priority: PriorityLevel;
  primaryAction: ActionDetail;
  secondaryAction: SecondaryAction | null;
  constraints: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// RULE REGISTRY (nextBestAction internals)
// ═══════════════════════════════════════════════════════════════════════════

export interface DecisionRule {
  id: string;
  predicate: (profile: RDOProfile, wagon: WagonState) => boolean;
  explain: (profile: RDOProfile, wagon: WagonState) => string;
  build: (profile: RDOProfile, wagon: WagonState) => RuleResult;
}

// ═══════════════════════════════════════════════════════════════════════════
// DIAGNOSTICS (explainAnalysis output)
// ═══════════════════════════════════════════════════════════════════════════

export interface InputSnapshot {
  rank: number;
  cash: number;
  gold: number;
  wagonLoad: number;
  hasTrader: boolean;
  hasBounty: boolean;
  hasCollector: boolean;
  isGoldCritical: boolean;
  isGoldSafe: boolean;
  isCashPoor: boolean;
  isWagonFull: boolean;
  isWagonEmpty: boolean;
  isWagonNearFull: boolean;
}

export interface RuleEvaluation {
  id: string;
  matched: boolean;
  reason: string;
}

export interface SkipTraceEntry {
  id: string;
  reason: string;
}

export interface Diagnostics {
  ruleId: string;
  inputSnapshot: InputSnapshot;
  ruleEvaluations: RuleEvaluation[];
  skipTrace: SkipTraceEntry[];
  timestamp: number;
}

export interface ExplainedRecommendation extends ActionRecommendation {
  diagnostics: Diagnostics;
}

// ═══════════════════════════════════════════════════════════════════════════
// EFFICIENCY ENGINE (DecisionTree)
// ═══════════════════════════════════════════════════════════════════════════

export interface CatalogItem {
  id: string;
  name: string;
  price?: number;
  gold?: number;
  rank?: number;
  type?: string;
}

export interface CartTotals {
  cash: number;
  gold: number;
}

export interface EfficiencyMetrics {
  bottleneck: string;
  efficiency: number;
  cashUtilization: number;
  goldUtilization: number;
}

export interface Recommendation {
  priority: number;
  title: string;
  desc: string;
  action?: string;
  type: RecommendationType;
  itemId?: string;
}

export interface EarningsPerHour {
  cash: number;
  gold: number;
}

export interface Discount {
  itemId: string;
  name: string;
  percentOff: number;
  originalPrice: number;
  salePrice?: number;
  goldCost?: number;
}

export interface Bonus {
  multiplier: number;
  role?: string;
  label: string;
  description: string;
}

export interface WeeklySpecials {
  discounts?: Discount[];
  bonuses?: Bonus[];
  meta?: {
    validUntil?: string;
  };
}

export interface EfficiencyAnalysis {
  metrics: EfficiencyMetrics;
  recommendations: Recommendation[];
  cartTotals: CartTotals;
  remaining: { cash: number; gold: number };
  summary: string;
}
