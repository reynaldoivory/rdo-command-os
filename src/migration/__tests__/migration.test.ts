import { describe, it, expect } from 'vitest';
import { migrateV2ToV3 } from '../v2_to_v3_migrator';

describe('V2 to V3 Migration', () => {
  it('migrates items with full validation', () => {
    const v2Data = {
      items: [
        {
          id: 'metal_detector',
          name: 'Metal Detector',
          category: 'tool',
          shop: 'fence',
          price: 700,
          gold_price: 0,
          type: 'TOOL',
          sources: [
            {
              type: 'GAME_TEST' as const,
              date: '2024-12-01',
              verified_by: 'chad_lance',
            },
          ],
          patch_version: '1.29',
          last_verified: '2024-12-01',
        },
      ],
    };

    const result = migrateV2ToV3(v2Data);

    expect(result.report.success).toBe(true);
    expect(Object.keys(result.items)).toHaveLength(1);
    expect(result.items['metal_detector'].price.cash?.confidence).toBe('MEDIUM');
  });

  it('detects missing required fields', () => {
    const v2Data = {
      items: [{ name: 'Broken Item' }], // missing id
    };

    const result = migrateV2ToV3(v2Data);

    expect(result.report.success).toBe(false);
    expect(result.report.errors.length).toBeGreaterThan(0);
  });

  it('infers HIGH confidence from game tests + multiple other sources', () => {
    const v2Data = {
      items: [
        {
          id: 'carcano',
          name: 'Carcano Rifle',
          category: 'weapon',
          shop: 'gunsmith',
          price: 456,
          sources: [
            { type: 'GAME_TEST' as const, date: '2024-12-01' },
            {
              type: 'REDDIT' as const,
              date: '2024-11-28',
              url: 'https://reddit.com/r/RedDeadOnline/',
            },
            {
              type: 'WIKI' as const,
              date: '2024-12-02',
              url: 'https://reddead.fandom.com/',
            },
          ],
        },
      ],
    };

    const result = migrateV2ToV3(v2Data);

    expect(result.items['carcano'].price.cash?.confidence).toBe('HIGH');
  });

  it('handles missing sources gracefully', () => {
    const v2Data = {
      items: [
        {
          id: 'generic_item',
          name: 'Generic Item',
          category: 'weapon',
          shop: 'general_store',
          price: 100,
          // no sources
        },
      ],
    };

    const result = migrateV2ToV3(v2Data);

    expect(result.report.success).toBe(true);
    expect(result.items['generic_item'].price.cash?.confidence).toBe('LOW');
    expect(result.report.gaps.length).toBeGreaterThan(0);
  });

  it('validates source dates in ISO format', () => {
    const v2Data = {
      items: [
        {
          id: 'dated_item',
          name: 'Dated Item',
          category: 'weapon',
          shop: 'gunsmith',
          price: 200,
          sources: [
            {
              type: 'GAME_TEST' as const,
              date: '2024-12-01', // valid
            },
          ],
        },
      ],
    };

    const result = migrateV2ToV3(v2Data);

    expect(result.report.success).toBe(true);
    expect(result.items['dated_item'].sources[0].date).toBe('2024-12-01');
  });

  it('migrates formulas with system and variables', () => {
    const v2Data = {
      economic_formulas: [
        {
          id: 'bounty_payout',
          system: 'bounty_hunter',
          name: 'Bounty Payout Formula',
          formula: 'P = B × M_tier × M_status × M_rank',
          variables: ['base_payout', 'tier_multiplier', 'status_multiplier', 'rank_multiplier'],
          sources: [
            {
              type: 'GAME_TEST' as const,
              date: '2024-12-01',
              verified_by: 'testing_team',
            },
          ],
          patch_version: '1.29',
        },
      ],
    };

    const result = migrateV2ToV3(v2Data);

    expect(result.report.success).toBe(true);
    expect(Object.keys(result.formulas)).toHaveLength(1);
    expect(result.formulas['bounty_payout'].system).toBe('bounty_hunter');
    expect(result.formulas['bounty_payout'].variables).toHaveLength(4);
  });

  it('migrates animals with materials and spawn info', () => {
    const v2Data = {
      animals: [
        {
          id: 'buck_whitetail',
          name: 'White Tail Buck',
          species: 'Deer',
          size: 'large',
          ai_rating: 7,
          health: 100,
          materials: ['fur', 'antlers'],
          spawns: ['Big Valley', 'West Elizabeth'],
          can_study: true,
          sources: [
            {
              type: 'GAME_TEST' as const,
              date: '2024-12-01',
            },
          ],
        },
      ],
    };

    const result = migrateV2ToV3(v2Data);

    expect(result.report.success).toBe(true);
    expect(result.animals['buck_whitetail'].name).toBe('White Tail Buck');
    expect(result.animals['buck_whitetail'].materials).toContain('fur');
  });

  it('reports confidence statistics', () => {
    const v2Data = {
      items: [
        {
          id: 'high_item',
          name: 'High Confidence',
          category: 'weapon',
          shop: 'gunsmith',
          price: 100,
          sources: [
            { type: 'GAME_TEST' as const, date: '2024-12-01' },
            { type: 'REDDIT' as const, date: '2024-12-02', url: 'https://reddit.com/' },
            { type: 'WIKI' as const, date: '2024-12-03', url: 'https://wiki.com/' },
          ],
        },
        {
          id: 'low_item',
          name: 'Low Confidence',
          category: 'weapon',
          shop: 'gunsmith',
          price: 200,
          sources: [
            { type: 'YOUTUBE' as const, date: '2024-06-01', url: 'https://youtube.com/' },
          ],
        },
      ],
    };

    const result = migrateV2ToV3(v2Data);

    expect(result.report.stats.high_confidence_items).toBe(1);
    expect(result.report.stats.low_confidence_items).toBe(1);
    expect(result.report.summary).toContain('HIGH');
  });

  it('generates meaningful migration report', () => {
    const v2Data = {
      items: [
        {
          id: 'test_item',
          name: 'Test Item',
          category: 'weapon',
          shop: 'gunsmith',
          price: 150,
          sources: [{ type: 'GAME_TEST' as const, date: '2024-12-01' }],
        },
      ],
    };

    const result = migrateV2ToV3(v2Data);

    expect(result.report.timestamp).toBeTruthy();
    expect(result.report.summary).toContain('MIGRATION COMPLETE');
    expect(result.report.stats.items_migrated).toBe(1);
  });
});
