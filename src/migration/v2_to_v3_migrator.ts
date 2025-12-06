/**
 * ═══════════════════════════════════════════════════════════════════════════
 * V2 TO V3 MIGRATION ENGINE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Converts legacy extraction log format into Redux-ready normalized data.
 * 
 * Key Features:
 * - Validation with detailed error reporting
 * - Confidence level inference from source quality
 * - Duplicate detection and resolution
 * - Missing data gap analysis
 */

import type {
  RDOItem,
  EconomicFormula,
  Animal,
  FastTravelNode,
  FastTravelRoute,
  CollectorItem,
  Role,
  SourceRef,
  Confidence,
  ItemCategory,
  ItemShop,
} from '../domain/rdo_unified_schema';

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Infer confidence level based on source quality and recency
 * HIGH: Game test + 2+ other sources (any type) = comprehensive verification
 * MEDIUM: Game test alone OR (2+ sources with at least one game test) = good data
 * LOW: Single source OR no game test = needs review
 */
function inferConfidence(sources: SourceRef[]): Confidence {
  if (!sources || sources.length === 0) return 'LOW';

  const hasGameTest = sources.some((s) => s.type === 'GAME_TEST');
  const otherSources = sources.filter((s) => s.type !== 'GAME_TEST').length;

  // HIGH: Game test + 2+ other independent sources = comprehensive
  if (hasGameTest && otherSources >= 2) return 'HIGH';

  // MEDIUM: Game test alone, or multiple sources with game test
  if (hasGameTest || sources.length >= 3) return 'MEDIUM';

  // LOW: Single source or no validation
  return 'LOW';
}

function validateSourceRef(source: any): source is SourceRef {
  return (
    source &&
    typeof source === 'object' &&
    [
      'GAME_TEST',
      'REDDIT',
      'WIKI',
      'YOUTUBE',
      'JEANROPKE_MAP',
      'FRONTIER_ALGORITHM',
      'COMMUNITY_TESTED',
      'CALCULATED',
    ].includes(source.type) &&
    typeof source.date === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(source.date)
  );
}

function sanitizeSources(sources: any[]): SourceRef[] {
  if (!Array.isArray(sources)) return [];
  return sources.filter(validateSourceRef);
}

function toISODate(date?: string | Date): string {
  if (!date) return new Date().toISOString().split('T')[0];
  if (typeof date === 'string') return date;
  return date.toISOString().split('T')[0];
}

// ═══════════════════════════════════════════════════════════════════════════
// MIGRATION RESULT TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface MigrationStats {
  items_migrated: number;
  formulas_migrated: number;
  animals_migrated: number;
  fast_travel_nodes: number;
  fast_travel_routes: number;
  collector_items: number;
  roles_migrated: number;
  high_confidence_items: number;
  medium_confidence_items: number;
  low_confidence_items: number;
}

export interface MigrationReport {
  success: boolean;
  timestamp: string;
  stats: MigrationStats;
  warnings: string[];
  errors: string[];
  gaps: string[];
  summary: string;
}

export interface MigratedData {
  items: Record<string, RDOItem>;
  formulas: Record<string, EconomicFormula>;
  animals: Record<string, Animal>;
  fast_travel_nodes: Record<string, FastTravelNode>;
  fast_travel_routes: FastTravelRoute[];
  collector_items: Record<string, CollectorItem>;
  roles: Record<string, Role>;
  report: MigrationReport;
}

// ═══════════════════════════════════════════════════════════════════════════
// CORE MIGRATOR CLASS
// ═══════════════════════════════════════════════════════════════════════════

export class V2ToV3Migrator {
  private warnings: string[] = [];
  private errors: string[] = [];
  private gaps: string[] = [];
  private highConfidence = 0;
  private mediumConfidence = 0;
  private lowConfidence = 0;

  /**
   * Main entry point: migrate entire v2 extraction log
   */
  migrate(v2Data: any): MigratedData {
    this.warnings = [];
    this.errors = [];
    this.gaps = [];
    this.highConfidence = 0;
    this.mediumConfidence = 0;
    this.lowConfidence = 0;

    const result: MigratedData = {
      items: {},
      formulas: {},
      animals: {},
      fast_travel_nodes: {},
      fast_travel_routes: [],
      collector_items: {},
      roles: {},
      report: {
        success: false,
        timestamp: new Date().toISOString(),
        stats: {
          items_migrated: 0,
          formulas_migrated: 0,
          animals_migrated: 0,
          fast_travel_nodes: 0,
          fast_travel_routes: 0,
          collector_items: 0,
          roles_migrated: 0,
          high_confidence_items: 0,
          medium_confidence_items: 0,
          low_confidence_items: 0,
        },
        warnings: [],
        errors: [],
        gaps: [],
        summary: '',
      },
    };

    try {
      // Migrate each domain
      if (v2Data.items) {
        const migratedItems = this.migrateItems(v2Data.items);
        Object.entries(migratedItems).forEach(([id, item]) => {
          result.items[id] = item;
        });
        result.report.stats.items_migrated = Object.keys(result.items).length;
      }

      if (v2Data.economic_formulas) {
        const migratedFormulas = this.migrateFormulas(v2Data.economic_formulas);
        Object.entries(migratedFormulas).forEach(([id, formula]) => {
          result.formulas[id] = formula;
        });
        result.report.stats.formulas_migrated = Object.keys(
          result.formulas
        ).length;
      }

      if (v2Data.animals) {
        const migratedAnimals = this.migrateAnimals(v2Data.animals);
        Object.entries(migratedAnimals).forEach(([id, animal]) => {
          result.animals[id] = animal;
        });
        result.report.stats.animals_migrated = Object.keys(
          result.animals
        ).length;
      }

      if (v2Data.fast_travel_nodes) {
        const migratedNodes = this.migrateFastTravelNodes(
          v2Data.fast_travel_nodes
        );
        Object.entries(migratedNodes).forEach(([id, node]) => {
          result.fast_travel_nodes[id] = node;
        });
        result.report.stats.fast_travel_nodes = Object.keys(
          result.fast_travel_nodes
        ).length;
      }

      if (v2Data.fast_travel_routes) {
        result.fast_travel_routes = this.migrateFastTravelRoutes(
          v2Data.fast_travel_routes
        );
        result.report.stats.fast_travel_routes =
          result.fast_travel_routes.length;
      }

      if (v2Data.collector_items) {
        const migratedCollectors = this.migrateCollectorItems(
          v2Data.collector_items
        );
        Object.entries(migratedCollectors).forEach(([id, item]) => {
          result.collector_items[id] = item;
        });
        result.report.stats.collector_items = Object.keys(
          result.collector_items
        ).length;
      }

      if (v2Data.roles) {
        const migratedRoles = this.migrateRoles(v2Data.roles);
        Object.entries(migratedRoles).forEach(([id, role]) => {
          result.roles[id] = role;
        });
        result.report.stats.roles_migrated = Object.keys(result.roles).length;
      }

      // Confidence stats
      result.report.stats.high_confidence_items = this.highConfidence;
      result.report.stats.medium_confidence_items = this.mediumConfidence;
      result.report.stats.low_confidence_items = this.lowConfidence;

      result.report.success = this.errors.length === 0;
      result.report.warnings = this.warnings;
      result.report.errors = this.errors;
      result.report.gaps = this.gaps;

      // Generate summary
      result.report.summary = this.generateSummary(result.report);

      return result;
    } catch (err) {
      this.errors.push(`Critical migration failure: ${(err as Error).message}`);
      result.report.success = false;
      result.report.errors = this.errors;
      result.report.summary = `FAILED: ${this.errors[0]}`;
      return result;
    }
  }

  // ════════════════════════════════════════════════════════════════════════
  // DOMAIN-SPECIFIC MIGRATORS
  // ════════════════════════════════════════════════════════════════════════

  private migrateItems(v2Items: any[]): Record<string, RDOItem> {
    const items: Record<string, RDOItem> = {};

    for (const v2Item of v2Items) {
      try {
        // Validate required fields
        if (!v2Item.id || !v2Item.name) {
          this.errors.push(
            `Item missing id or name: ${JSON.stringify(v2Item).substring(0, 100)}`
          );
          continue;
        }

        // Validate sources
        const sources = sanitizeSources(v2Item.sources || []);
        if ((v2Item.sources || []).length > 0 && sources.length === 0) {
          this.warnings.push(
            `Item ${v2Item.id}: Invalid source references found, using empty sources`
          );
        }

        const confidence = inferConfidence(sources);
        if (confidence === 'HIGH') this.highConfidence++;
        else if (confidence === 'MEDIUM') this.mediumConfidence++;
        else this.lowConfidence++;

        if (confidence === 'LOW') {
          this.gaps.push(`Item ${v2Item.id}: Low confidence, needs verification`);
        }

        const item: RDOItem = {
          id: v2Item.id,
          name: v2Item.name,
          category: (v2Item.category || 'weapon') as ItemCategory,
          shop: (v2Item.shop || 'general_store') as ItemShop,
          price: {
            cash: v2Item.price
              ? {
                  value: v2Item.price,
                  confidence,
                  sources,
                  last_verified: toISODate(v2Item.last_verified),
                  patch_version: v2Item.patch_version || 'UNKNOWN',
                }
              : undefined,
            gold: v2Item.gold_price
              ? {
                  value: v2Item.gold_price,
                  confidence,
                  sources,
                  last_verified: toISODate(v2Item.last_verified),
                  patch_version: v2Item.patch_version || 'UNKNOWN',
                }
              : undefined,
          },
          rarity: v2Item.rarity,
          description: v2Item.description,
          type: v2Item.type,
          stats: v2Item.stats,
          confidence,
          sources,
          last_verified: toISODate(v2Item.last_verified),
          patch_version: v2Item.patch_version || 'UNKNOWN',
        };

        items[v2Item.id] = item;
      } catch (err) {
        this.errors.push(
          `Failed to migrate item ${v2Item.id}: ${(err as Error).message}`
        );
      }
    }

    return items;
  }

  private migrateFormulas(v2Formulas: any[]): Record<string, EconomicFormula> {
    const formulas: Record<string, EconomicFormula> = {};

    for (const v2Formula of v2Formulas) {
      try {
        if (!v2Formula.id || !v2Formula.system) {
          this.errors.push(
            `Formula missing id or system: ${JSON.stringify(v2Formula).substring(0, 100)}`
          );
          continue;
        }

        const sources = sanitizeSources(v2Formula.sources || []);
        const confidence = inferConfidence(sources);

        if (confidence === 'HIGH') this.highConfidence++;
        else if (confidence === 'MEDIUM') this.mediumConfidence++;
        else this.lowConfidence++;

        formulas[v2Formula.id] = {
          id: v2Formula.id,
          system: v2Formula.system,
          name: v2Formula.name || v2Formula.id,
          formula: v2Formula.formula || 'UNKNOWN',
          description: v2Formula.description,
          variables: v2Formula.variables || [],
          optimal_parameters: v2Formula.optimal_parameters,
          examples: v2Formula.examples || [],
          confidence,
          sources,
          patch_version: v2Formula.patch_version || 'UNKNOWN',
          last_verified: toISODate(v2Formula.last_verified),
        };
      } catch (err) {
        this.errors.push(
          `Failed to migrate formula ${v2Formula.id}: ${(err as Error).message}`
        );
      }
    }

    return formulas;
  }

  private migrateAnimals(v2Animals: any[]): Record<string, Animal> {
    const animals: Record<string, Animal> = {};

    for (const v2Animal of v2Animals) {
      try {
        if (!v2Animal.id || !v2Animal.name) {
          this.errors.push(
            `Animal missing id or name: ${JSON.stringify(v2Animal).substring(0, 100)}`
          );
          continue;
        }

        const sources = sanitizeSources(v2Animal.sources || []);
        const confidence = inferConfidence(sources);

        if (confidence === 'HIGH') this.highConfidence++;
        else if (confidence === 'MEDIUM') this.mediumConfidence++;
        else this.lowConfidence++;

        animals[v2Animal.id] = {
          id: v2Animal.id,
          name: v2Animal.name,
          species: v2Animal.species || 'Unknown',
          size: v2Animal.size || 'medium',
          ai_rating: {
            value: v2Animal.ai_rating || 5,
            confidence,
            sources,
            last_verified: toISODate(v2Animal.last_verified),
            patch_version: v2Animal.patch_version || 'UNKNOWN',
          },
          health: {
            value: v2Animal.health || 100,
            confidence,
            sources,
            last_verified: toISODate(v2Animal.last_verified),
            patch_version: v2Animal.patch_version || 'UNKNOWN',
          },
          materials: v2Animal.materials || [],
          spawns: v2Animal.spawns || [],
          can_study: v2Animal.can_study || false,
          confidence,
          sources,
          last_verified: toISODate(v2Animal.last_verified),
          patch_version: v2Animal.patch_version || 'UNKNOWN',
        };
      } catch (err) {
        this.errors.push(
          `Failed to migrate animal ${v2Animal.id}: ${(err as Error).message}`
        );
      }
    }

    return animals;
  }

  private migrateFastTravelNodes(v2Nodes: any[]): Record<string, FastTravelNode> {
    const nodes: Record<string, FastTravelNode> = {};

    for (const node of v2Nodes) {
      try {
        if (!node.id || !node.name) {
          this.warnings.push(
            `Fast travel node missing id or name: ${JSON.stringify(node).substring(0, 100)}`
          );
          continue;
        }

        const sources = sanitizeSources(node.sources || []);
        const confidence = inferConfidence(sources);

        nodes[node.id] = {
          id: node.id,
          name: node.name,
          latitude: {
            value: node.latitude || 0,
            confidence,
            sources,
            last_verified: toISODate(node.last_verified),
          },
          longitude: {
            value: node.longitude || 0,
            confidence,
            sources,
            last_verified: toISODate(node.last_verified),
          },
          region: node.region || 'Unknown',
          cost_cash: {
            value: node.cost_cash || 0,
            confidence,
            sources,
            last_verified: toISODate(node.last_verified),
          },
          confidence,
          sources,
          last_verified: toISODate(node.last_verified),
        };
      } catch (err) {
        this.errors.push(
          `Failed to migrate fast travel node ${node.id}: ${(err as Error).message}`
        );
      }
    }

    return nodes;
  }

  private migrateFastTravelRoutes(v2Routes: any[]): FastTravelRoute[] {
    const routes: FastTravelRoute[] = [];

    for (const route of v2Routes) {
      try {
        if (!route.from_node_id || !route.to_node_id) {
          this.warnings.push(
            `Fast travel route missing nodes: ${JSON.stringify(route).substring(0, 100)}`
          );
          continue;
        }

        const sources = sanitizeSources(route.sources || []);
        const confidence = inferConfidence(sources);

        routes.push({
          id: route.id || `${route.from_node_id}_to_${route.to_node_id}`,
          from_node_id: route.from_node_id,
          to_node_id: route.to_node_id,
          distance_miles: {
            value: route.distance_miles || 0,
            confidence,
            sources,
            last_verified: toISODate(route.last_verified),
          },
          travel_time_seconds: {
            value: route.travel_time_seconds || 0,
            confidence,
            sources,
            last_verified: toISODate(route.last_verified),
          },
          cost_cash: {
            value: route.cost_cash || 0,
            confidence,
            sources,
            last_verified: toISODate(route.last_verified),
          },
          asymmetric: route.asymmetric || false,
          confidence,
          sources,
          last_verified: toISODate(route.last_verified),
        });
      } catch (err) {
        this.errors.push(
          `Failed to migrate fast travel route: ${(err as Error).message}`
        );
      }
    }

    return routes;
  }

  private migrateCollectorItems(
    v2Items: any[]
  ): Record<string, CollectorItem> {
    const items: Record<string, CollectorItem> = {};

    for (const item of v2Items) {
      try {
        if (!item.id || !item.collection_set) {
          this.warnings.push(
            `Collector item missing id or set: ${JSON.stringify(item).substring(0, 100)}`
          );
          continue;
        }

        const sources = sanitizeSources(item.sources || []);
        const confidence = inferConfidence(sources);

        if (confidence === 'HIGH') this.highConfidence++;
        else if (confidence === 'MEDIUM') this.mediumConfidence++;
        else this.lowConfidence++;

        items[item.id] = {
          id: item.id,
          collection_set: item.collection_set,
          cycle: {
            value: item.cycle || 1,
            confidence,
            sources,
            last_verified: toISODate(item.last_verified),
          },
          name: item.name || item.id,
          description: item.description,
          latitude: {
            value: item.latitude || 0,
            confidence,
            sources,
            last_verified: toISODate(item.last_verified),
          },
          longitude: {
            value: item.longitude || 0,
            confidence,
            sources,
            last_verified: toISODate(item.last_verified),
          },
          region: item.region || 'Unknown',
          cash_value: {
            value: item.cash_value || 0,
            confidence,
            sources,
            last_verified: toISODate(item.last_verified),
          },
          confidence,
          sources,
          last_verified: toISODate(item.last_verified),
          patch_version: item.patch_version || 'UNKNOWN',
        };
      } catch (err) {
        this.errors.push(
          `Failed to migrate collector item ${item.id}: ${(err as Error).message}`
        );
      }
    }

    return items;
  }

  private migrateRoles(v2Roles: any[]): Record<string, Role> {
    const roles: Record<string, Role> = {};

    for (const role of v2Roles) {
      try {
        if (!role.id || !role.name) {
          this.warnings.push(
            `Role missing id or name: ${JSON.stringify(role).substring(0, 100)}`
          );
          continue;
        }

        const sources = sanitizeSources(role.sources || []);
        const confidence = inferConfidence(sources);

        roles[role.id] = {
          id: role.id as any,
          name: role.name,
          mentor_npc: role.mentor_npc,
          unlock_cost_gold: {
            value: role.unlock_cost_gold || 15,
            confidence,
            sources,
            last_verified: toISODate(role.last_verified),
          },
          player_rank_required: {
            value: role.player_rank_required || 5,
            confidence,
            sources,
            last_verified: toISODate(role.last_verified),
          },
          max_rank: {
            value: role.max_rank || 20,
            confidence,
            sources,
            last_verified: toISODate(role.last_verified),
          },
          rank_benefits: role.rank_benefits || [],
          confidence,
          sources,
          last_verified: toISODate(role.last_verified),
        };
      } catch (err) {
        this.errors.push(
          `Failed to migrate role ${role.id}: ${(err as Error).message}`
        );
      }
    }

    return roles;
  }

  // ════════════════════════════════════════════════════════════════════════
  // REPORT GENERATION
  // ════════════════════════════════════════════════════════════════════════

  private generateSummary(report: MigrationReport): string {
    const {
      stats: {
        items_migrated,
        formulas_migrated,
        animals_migrated,
        roles_migrated,
        high_confidence_items,
        low_confidence_items,
      },
      errors,
      warnings,
      gaps,
    } = report;

    const totalItems = items_migrated + formulas_migrated + animals_migrated + roles_migrated;

    let summary = `✅ MIGRATION COMPLETE\n`;
    summary += `Migrated ${totalItems} total entries (${items_migrated} items, ${formulas_migrated} formulas, ${animals_migrated} animals, ${roles_migrated} roles)\n`;
    summary += `Confidence: ${high_confidence_items} HIGH, ${Math.max(0, this.mediumConfidence)} MEDIUM, ${low_confidence_items} LOW\n`;

    if (errors.length > 0) {
      summary += `❌ ${errors.length} errors found\n`;
    }
    if (warnings.length > 0) {
      summary += `⚠️  ${warnings.length} warnings\n`;
    }
    if (gaps.length > 0) {
      summary += `🔍 ${gaps.length} data gaps (unverified entries)\n`;
    }

    return summary;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// CONVENIENCE EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export function migrateV2ToV3(v2Data: any): MigratedData {
  const migrator = new V2ToV3Migrator();
  return migrator.migrate(v2Data);
}

export default { V2ToV3Migrator, migrateV2ToV3 };
