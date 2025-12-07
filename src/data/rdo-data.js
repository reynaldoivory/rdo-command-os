// FILE: src/data/rdo-data.js
import { Compass, Box, Skull, Wine, Leaf, Crosshair, Zap, Sparkles, Star, Award, Package, ScrollText, Shirt, Tent, Target } from 'lucide-react';

// =========================================================================
// 1. GAME CONSTANTS & XP TABLES
// =========================================================================

export const FAST_TRAVEL_LOCATIONS = {
  valentine: { name: 'Valentine', region: 'New Hanover', x: 0, y: 0 },
  saintdenis: { name: 'Saint Denis', region: 'Lemoyne', x: 50, y: -50 },
  blackwater: { name: 'Blackwater', region: 'West Elizabeth', x: -40, y: -40 },
  rhodes: { name: 'Rhodes', region: 'Lemoyne', x: 30, y: -30 },
  tumbleweed: { name: 'Tumbleweed', region: 'New Austin', x: -100, y: -60 },
  strawberry: { name: 'Strawberry', region: 'West Elizabeth', x: -60, y: 10 },
  vanhorn: { name: 'Van Horn', region: 'New Hanover', x: 60, y: 20 },
  annesburg: { name: 'Annesburg', region: 'New Hanover', x: 60, y: 40 },
  colter: { name: 'Colter', region: 'Ambarino', x: -20, y: 60 },
  wapiti: { name: 'Wapiti', region: 'Ambarino', x: 10, y: 55 },
  macfarlane: { name: 'MacFarlanes Ranch', region: 'New Austin', x: -60, y: -30 },
};

export const RANK_XP_TABLE = [
  0, 0, 500, 1100, 1800, 2600, 3500, 4500, 5600, 6800, 8100,
  9500, 11000, 12600, 14300, 16100, 18000, 20000, 22100, 24300, 26600,
  29000, 31500, 34100, 36800, 39600, 42500, 45500, 48600, 51800, 55100,
  58500, 62000, 65600, 69300, 73100, 77000, 81000, 85100, 89300, 93600,
  98000, 102500, 107100, 111800, 116600, 121500, 126500, 131600, 136800, 142100,
  147500, 153000, 158600, 164300, 170100, 176000, 182000, 188100, 194300, 200600,
  207000, 213500, 220100, 226800, 233600, 240500, 247500, 254600, 261800, 269100,
  276500, 284000, 291600, 299300, 307100, 315000, 323000, 331100, 339300, 347600,
  356000, 364500, 373100, 381800, 390600, 399500, 408500, 417600, 426800, 436100,
  445500, 455000, 464600, 474300, 484100, 494000, 504000, 514100, 524300, 534600,
];

export const ROLE_XP_TABLE = [
  0, 0, 400, 900, 1500, 2200, 3000, 3900, 4900, 5900, 7000,
  8200, 9500, 10900, 12400, 14000, 15700, 17500, 19400, 21400, 23500,
  25700, 28000, 30400, 32900, 35500, 38200, 41000, 43900, 46900, 50000,
];

export const ROLES = {
  collector: { name: 'Collector', color: 'text-violet-400', bg: 'bg-violet-500', icon: Compass, maxLevel: 20, desc: 'Highest Cash/Hr' },
  trader: { name: 'Trader', color: 'text-amber-500', bg: 'bg-amber-500', icon: Box, maxLevel: 20, desc: 'Passive Business' },
  bountyHunter: { name: 'Bounty Hunter', color: 'text-red-400', bg: 'bg-red-500', icon: Skull, maxLevel: 30, desc: 'Gold Earner' },
  moonshiner: { name: 'Moonshiner', color: 'text-cyan-400', bg: 'bg-cyan-500', icon: Wine, maxLevel: 20, desc: 'Semi-Passive' },
  naturalist: { name: 'Naturalist', color: 'text-emerald-400', bg: 'bg-emerald-500', icon: Leaf, maxLevel: 20, desc: 'Utility/Legendaries' },
};

export const UI_CONFIG = {
  priorities: {
    starter: { label: 'Fresh Spawn', emoji: '🌱', color: 'text-lime-300', bg: 'bg-lime-950/60', border: 'border-lime-700/40', order: 0 },
    essential: { label: 'Essential', emoji: '⚡', color: 'text-emerald-300', bg: 'bg-emerald-950/60', border: 'border-emerald-700/40', order: 1 },
    recommended: { label: 'Recommended', emoji: '⭐', color: 'text-sky-300', bg: 'bg-sky-950/60', border: 'border-sky-700/40', order: 2 },
    optional: { label: 'Optional', emoji: '👍', color: 'text-amber-300', bg: 'bg-amber-950/60', border: 'border-amber-700/40', order: 3 },
    luxury: { label: 'Luxury', emoji: '💎', color: 'text-fuchsia-300', bg: 'bg-fuchsia-950/60', border: 'border-fuchsia-700/40', order: 4 },
  },
  types: {
    weapon: { label: 'Weapons', icon: Crosshair },
    ability: { label: 'Abilities', icon: Zap },
    role: { label: 'Roles', icon: Target },
    tool: { label: 'Tools', icon: Compass },
    horse: { label: 'Horses', icon: Compass },
    saddle: { label: 'Saddles', icon: Box },
    camp: { label: 'Camp', icon: Tent },
    clothing: { label: 'Clothing', icon: Shirt },
    pamphlet: { label: 'Pamphlets', icon: ScrollText },
    item: { label: 'Items', icon: Package },
  }
};

// =========================================================================
// 2. MASTER CATALOG - Verified 2025 Functional SKUs (~150 items)
// =========================================================================
// Contains ONLY gameplay-impacting items (stats, efficiency, economy).
// Cosmetic items (3000+ clothing colorways) are handled via Data Sharding.
//
// COST ANALYSIS:
// - Essential Items: ~$12,500 Cash + ~110 Gold Bars
// - Full Catalog: ~$25,000 Cash + ~150 Gold Bars
// =========================================================================

export const CATALOG = [
  // ═══════════════════════════════════════════════════════════════════════
  // 1. WEAPONS (META & ESSENTIAL)
  // ═══════════════════════════════════════════════════════════════════════
  { id: 'w_rev_navy', type: 'weapon', category: 'Revolver', name: 'Navy Revolver', price: 275, gold: 0, rank: 1, priority: 'essential', desc: 'META. Highest damage sidearm. Slow reload (use Gunslingers Choice).', aliases: ['navy', 'navy revolver', 'best revolver', 'meta revolver'] },
  { id: 'w_rev_lemat', type: 'weapon', category: 'Revolver', name: 'LeMat Revolver', price: 317, gold: 0, rank: 1, priority: 'recommended', desc: '9 Rounds + 1 Shotgun Shell. Versatile powerhouse.', aliases: ['lemat', 'le mat', 'shotgun revolver', '9 shot'] },
  { id: 'w_pst_mauser', type: 'weapon', category: 'Pistol', name: 'Mauser Pistol', price: 600, gold: 0, rank: 34, priority: 'luxury', desc: 'Rapid fire PvP meta. Expensive to feed.', aliases: ['mauser', 'c96', 'automatic pistol', 'rapid fire'] },
  { id: 'w_rep_lancaster', type: 'weapon', category: 'Repeater', name: 'Lancaster Repeater', price: 243, gold: 0, rank: 12, priority: 'essential', desc: 'The most accurate repeater. PvE/PvP staple.', aliases: ['lancaster', 'best repeater', 'accurate repeater'] },
  { id: 'w_rep_evans', type: 'weapon', category: 'Repeater', name: 'Evans Repeater', price: 300, gold: 0, rank: 1, priority: 'optional', desc: 'High capacity (26 rounds). Great for PvE hordes.', aliases: ['evans', 'holiday repeater', 'christmas gun', 'winter repeater', '26 round'] },
  { id: 'w_rif_bolt', type: 'weapon', category: 'Rifle', name: 'Bolt Action Rifle', price: 216, gold: 0, rank: 7, priority: 'essential', desc: 'One-shot hunting & combat. Absolute must-have.', aliases: ['bolt action', 'bolt rifle', 'hunting rifle', 'best rifle'] },
  { id: 'w_rif_varmint', type: 'weapon', category: 'Rifle', name: 'Varmint Rifle', price: 72, gold: 0, rank: 8, priority: 'essential', desc: 'Required for pristine small game/birds (Collector).', aliases: ['varmint', 'small game rifle', 'bird rifle', '22'] },
  { id: 'w_rif_carcano', type: 'weapon', category: 'Sniper', name: 'Carcano Rifle', price: 456, gold: 0, rank: 50, priority: 'essential', desc: 'God Tier PvP/PvE Sniper. Highest DPS in game.', aliases: ['carcano', 'sniper', 'best sniper', 'pvp sniper', 'god tier'] },
  { id: 'w_sg_pump', type: 'weapon', category: 'Shotgun', name: 'Pump-Action Shotgun', price: 266, gold: 0, rank: 5, priority: 'essential', desc: 'Reliable, tight spread. Stops griefers instantly.', aliases: ['pump', 'pump action', 'pump shotgun'] },
  { id: 'w_sg_semi', type: 'weapon', category: 'Shotgun', name: 'Semi-Auto Shotgun', price: 540, gold: 0, rank: 42, priority: 'recommended', desc: 'Fastest close-range DPS. Best with Slippery Bastard.', aliases: ['semi auto', 'semi shotgun', 'auto shotgun'] },
  { id: 'w_bow_imp', type: 'weapon', category: 'Bow', name: 'Improved Bow', price: 275, gold: 0, rank: 1, priority: 'essential', desc: 'Further range, less stamina drain than standard bow.', aliases: ['improved bow', 'bow', 'silent weapon', 'hunting bow'] },

  // ═══════════════════════════════════════════════════════════════════════
  // 2. ABILITY CARDS (Total Cost to Max Tier 3: $50 + $350 + $500 = $900)
  // ═══════════════════════════════════════════════════════════════════════
  { id: 'a_de_pib', type: 'ability', category: 'Dead Eye', name: 'Paint It Black (Max)', price: 900, gold: 0, rank: 1, priority: 'essential', desc: '100% Accuracy. Marks targets. The game engine.', aliases: ['pib', 'paint it black', 'deadeye', 'auto aim', 'best card'] },
  { id: 'a_de_sns', type: 'ability', category: 'Dead Eye', name: 'Slow and Steady (Max)', price: 900, gold: 0, rank: 24, priority: 'recommended', desc: 'Tank Mode. Headshots do not kill you instantly.', aliases: ['sns', 'slow and steady', 'tank build', 'headshot protection'] },
  { id: 'a_de_sb', type: 'ability', category: 'Dead Eye', name: 'Slippery Bastard (Max)', price: 900, gold: 0, rank: 50, priority: 'luxury', desc: 'Evasion Mode. Enemy auto-aim is disabled.', aliases: ['sb', 'slippery', 'slippery bastard', 'no autoaim', 'anti lock'] },
  { id: 'a_pc_ss', type: 'ability', category: 'Combat', name: 'Sharpshooter (Max)', price: 900, gold: 0, rank: 10, priority: 'essential', desc: 'More damage + less damage taken while scoped.', aliases: ['sharpshooter', 'sniper card', 'scope damage'] },
  { id: 'a_pc_ws', type: 'ability', category: 'Combat', name: 'Winning Streak (Max)', price: 900, gold: 0, rank: 48, priority: 'essential', desc: 'Consecutive shots deal massive bonus damage.', aliases: ['winning streak', 'ws', 'stacking damage', 'consecutive hits'] },
  { id: 'a_pr_sm', type: 'ability', category: 'Recovery', name: 'Strange Medicine (Max)', price: 900, gold: 0, rank: 32, priority: 'essential', desc: 'Heal on damage dealt. Critical for survival.', aliases: ['strange medicine', 'sm', 'lifesteal', 'heal on hit'] },
  { id: 'a_pd_fmo', type: 'ability', category: 'Defense', name: 'Fool Me Once (Max)', price: 900, gold: 0, rank: 34, priority: 'essential', desc: 'Take less damage each time you are hit.', aliases: ['fool me once', 'fmo', 'damage reduction', 'tank card'] },
  { id: 'a_pd_nwo', type: 'ability', category: 'Defense', name: 'Never Without One (Max)', price: 900, gold: 0, rank: 46, priority: 'recommended', desc: 'Hat blocks one headshot. Saves lives.', aliases: ['never without one', 'nwo', 'hat card', 'headshot block'] },

  // ═══════════════════════════════════════════════════════════════════════
  // 3. CAMP & PROPERTY UPGRADES
  // ═══════════════════════════════════════════════════════════════════════
  { id: 'c_fast_travel', type: 'camp', category: 'Upgrade', name: 'Camp Fast Travel Post', price: 700, gold: 0, rank: 65, priority: 'essential', desc: 'Teleport FROM camp to any town. Huge time saver.', aliases: ['fast travel', 'camp teleport', 'fast travel post'] },
  { id: 'c_stew_pot', type: 'camp', category: 'Upgrade', name: 'Stew Pot', price: 650, gold: 0, rank: 15, priority: 'essential', desc: 'Gold Cores for 3 days. Massive XP for cooking.', aliases: ['stew pot', 'stew', 'cooking pot', 'gold cores'] },
  { id: 'c_tent_covered', type: 'camp', category: 'Tent', name: 'Covered Tent', price: 700, gold: 0, rank: 64, priority: 'luxury', desc: 'Refills cores to 75% instantly when entering camp.', aliases: ['covered tent', 'best tent', 'core refill tent'] },
  { id: 'c_dog_husky', type: 'camp', category: 'Dog', name: 'Camp Husky', price: 400, gold: 0, rank: 1, priority: 'optional', desc: 'Warns you of Trader raids. Also a good boy.', aliases: ['husky', 'camp dog', 'dog', 'raid warning'] },
  { id: 'u_moon_condenser', type: 'tool', category: 'Moonshiner', name: 'Condenser Upgrade', price: 825, gold: 0, rank: 5, priority: 'essential', desc: 'Allows Average Moonshine production.', aliases: ['condenser', 'moonshine upgrade', 'average moonshine'] },
  { id: 'u_moon_copper', type: 'tool', category: 'Moonshiner', name: 'Polished Copper', price: 875, gold: 0, rank: 10, priority: 'essential', desc: 'Allows Strong Moonshine ($226/sale). Mandatory.', aliases: ['polished copper', 'copper still', 'strong moonshine', 'best moonshine'] },
  { id: 'u_moon_bar', type: 'camp', category: 'Moonshiner', name: 'Bar Expansion', price: 950, gold: 0, rank: 1, priority: 'luxury', desc: 'Cosmetic only. Unlocks band and drunk interactions.', aliases: ['bar expansion', 'moonshine bar', 'band upgrade'] },

  // ═══════════════════════════════════════════════════════════════════════
  // 4. ROLE LICENSES (Gold-Only Purchases)
  // ═══════════════════════════════════════════════════════════════════════
  { id: 'r_lic_bh', type: 'role', category: 'License', name: 'Bounty Hunter License', price: 0, gold: 15, rank: 1, priority: 'essential', desc: 'ONLY role that earns Gold. Buy first.', aliases: ['bounty hunter', 'bh license', 'gold farm role', 'first role'] },
  { id: 'r_lic_tr', type: 'role', category: 'License', name: 'Trader License', price: 0, gold: 15, rank: 1, priority: 'essential', desc: 'Passive income business. Hunting required.', aliases: ['trader', 'trader license', 'cripps', 'hunting role'] },
  { id: 'r_lic_col', type: 'role', category: 'License', name: 'Collector Bag', price: 0, gold: 15, rank: 1, priority: 'essential', desc: 'Active income king (with jeanropke map).', aliases: ['collector', 'collector bag', 'madam nazar', 'jeanropke', 'best money'] },
  { id: 'r_lic_moon', type: 'role', category: 'License', name: 'Moonshiner License', price: 0, gold: 25, rank: 1, priority: 'recommended', desc: 'Requires Trader Rank 5. Semi-passive income.', aliases: ['moonshiner', 'moonshine license', 'maggie', 'bootlegger'] },
  { id: 'r_lic_nat', type: 'role', category: 'License', name: 'Naturalist License', price: 0, gold: 25, rank: 1, priority: 'optional', desc: 'Legendary animals for Trader. Niche role.', aliases: ['naturalist', 'harriet', 'legendary animals', 'sedative'] },

  // ═══════════════════════════════════════════════════════════════════════
  // 5. ROLE TOOLS & WAGONS
  // ═══════════════════════════════════════════════════════════════════════
  { id: 'u_col_det', type: 'tool', category: 'Collector', name: 'Metal Detector', price: 700, gold: 0, rank: 5, priority: 'essential', desc: 'Unlocks Coins/Jewelry. The single best ROI item.', aliases: ['metal detector', 'detector', 'coin finder', 'collector tool'] },
  { id: 'u_col_sho', type: 'tool', category: 'Collector', name: 'Pennington Field Shovel', price: 350, gold: 0, rank: 1, priority: 'essential', desc: 'Required to dig up items.', aliases: ['shovel', 'dig', 'pennington', 'collector shovel'] },
  { id: 'u_col_bin', type: 'tool', category: 'Collector', name: 'Refined Binoculars', price: 450, gold: 0, rank: 5, priority: 'optional', desc: 'Glows when looking at dig sites from distance.', aliases: ['binoculars', 'collector binoculars', 'glow finder'] },
  { id: 'u_trd_wag_m', type: 'tool', category: 'Trader', name: 'Medium Delivery Wagon', price: 500, gold: 0, rank: 5, priority: 'essential', desc: '25 -> 50 Goods capacity.', aliases: ['medium wagon', 'delivery wagon', '50 goods'] },
  { id: 'u_trd_wag_l', type: 'tool', category: 'Trader', name: 'Large Delivery Wagon', price: 750, gold: 0, rank: 10, priority: 'essential', desc: '50 -> 100 Goods capacity. Max payout ($625).', aliases: ['large wagon', 'big wagon', '100 goods', 'max wagon'] },
  { id: 'u_trd_hunt', type: 'tool', category: 'Trader', name: 'Hunting Wagon', price: 875, gold: 0, rank: 10, priority: 'essential', desc: 'Stores 5 large carcasses safely. Persists logout.', aliases: ['hunting wagon', 'carcass wagon', '5 carcass', 'hunt wagon'] },
  { id: 'u_bh_wagon', type: 'tool', category: 'Bounty Hunter', name: 'Bounty Wagon', price: 875, gold: 0, rank: 10, priority: 'recommended', desc: 'Secure 4-6 targets. Essential for multi-target bounties.', aliases: ['bounty wagon', 'prisoner wagon', 'target wagon'] },
  { id: 'u_bh_lasso', type: 'weapon', category: 'Tool', name: 'Reinforced Lasso', price: 350, gold: 0, rank: 1, priority: 'essential', desc: 'Targets cannot break free. Critical for solo play.', aliases: ['reinforced lasso', 'lasso', 'unbreakable lasso', 'capture tool'] },

  // ═══════════════════════════════════════════════════════════════════════
  // 6. PAMPHLETS (The Endgame Cash Sinks)
  // ═══════════════════════════════════════════════════════════════════════
  { id: 'p_ft_wild', type: 'pamphlet', category: 'Travel', name: 'Wilderness Camp Fast Travel', price: 1280, gold: 0, rank: 5, priority: 'essential', desc: 'Teleport from anywhere in the wild. God Tier QoL.', aliases: ['wilderness fast travel', 'wild camp teleport', 'anywhere fast travel', 'best pamphlet'] },
  { id: 'p_ammo_exp', type: 'pamphlet', category: 'Ammo', name: 'Explosive Express Ammo', price: 1000, gold: 0, rank: 90, priority: 'luxury', desc: 'One-shot kills. The ultimate anti-griefer tool.', aliases: ['explosive ammo', 'explosive rounds', 'anti griefer', 'one shot kill'] },
  { id: 'p_ammo_fire', type: 'pamphlet', category: 'Ammo', name: 'Incendiary Buckshot', price: 860, gold: 0, rank: 80, priority: 'luxury', desc: 'Sets targets on fire. Great for crowd control.', aliases: ['incendiary', 'fire ammo', 'fire buckshot', 'burn ammo'] },
  { id: 'p_arrow_dynamite', type: 'pamphlet', category: 'Ammo', name: 'Dynamite Arrow', price: 895, gold: 0, rank: 93, priority: 'luxury', desc: 'Explosive archery. Destroy wagons instantly.', aliases: ['dynamite arrow', 'explosive arrow', 'wagon destroyer'] },
  { id: 'p_tonic_spec', type: 'pamphlet', category: 'Tonic', name: 'Special Health Cure', price: 595, gold: 0, rank: 50, priority: 'recommended', desc: 'Craft Tier 3 Tonics (Gold Circles) cheaply.', aliases: ['special health', 'health cure', 'tier 3 tonic', 'gold circles'] },
  { id: 'p_ammo_split', type: 'pamphlet', category: 'Ammo', name: 'Split Point Ammo', price: 385, gold: 0, rank: 28, priority: 'optional', desc: 'Craftable ammo. Slower Dead Eye drain.', aliases: ['split point', 'craft ammo', 'deadeye ammo'] },

  // ═══════════════════════════════════════════════════════════════════════
  // 7. HORSES (Meta Tier Only)
  // ═══════════════════════════════════════════════════════════════════════
  { id: 'h_red_arabian', type: 'horse', category: 'Elite', name: 'Red Chestnut Arabian', price: 250, gold: 0, rank: 1, priority: 'starter', desc: 'Best starter horse handling.', aliases: ['red arabian', 'starter horse', 'cheap arabian'] },
  { id: 'h_mft', type: 'horse', category: 'Multi', name: 'Missouri Fox Trotter', price: 1125, gold: 0, rank: 58, priority: 'essential', desc: 'Best base speed + high stamina. The meta racer.', aliases: ['mft', 'fox trotter', 'missouri', 'fastest horse', 'best horse', 'meta horse'] },
  { id: 'h_turk', type: 'horse', category: 'Multi', name: 'Turkoman', price: 950, gold: 0, rank: 56, priority: 'recommended', desc: 'High health "War/Race" hybrid. Braver than Arabians.', aliases: ['turkoman', 'turk', 'war horse', 'brave horse'] },
  { id: 'h_mustang', type: 'horse', category: 'Multi', name: 'Mustang (Buckskin)', price: 500, gold: 0, rank: 1, priority: 'essential', desc: 'Best value. Max health/stamina at Level 4 bonding.', aliases: ['mustang', 'buckskin', 'budget horse', 'best value horse'] },
  { id: 'h_breton', type: 'horse', category: 'Role', name: 'Breton (Steel Grey)', price: 950, gold: 0, rank: 20, priority: 'recommended', desc: 'Bounty Hunter Lvl 20. Tanky combat horse.', aliases: ['breton', 'steel grey', 'bounty horse', 'tank horse'] },
  { id: 'h_gypsy', type: 'horse', category: 'Role', name: 'Gypsy Cob (Splashed)', price: 950, gold: 0, rank: 20, priority: 'recommended', desc: 'Trader Lvl 20. Highest health pool in game.', aliases: ['gypsy cob', 'gypsy', 'splashed', 'trader horse', 'most health'] },
  { id: 'h_black_arabian', type: 'horse', category: 'Elite', name: 'Black Arabian', price: 0, gold: 42, rank: 70, priority: 'luxury', desc: 'Elite handling. Only buy if you have excess Gold.', aliases: ['black arabian', 'gold horse', 'elite arabian'] },

  // ═══════════════════════════════════════════════════════════════════════
  // 8. SADDLES & STIRRUPS
  // ═══════════════════════════════════════════════════════════════════════
  { id: 's_naco', type: 'saddle', category: 'Special', name: 'Nacogdoches Saddle', price: 512, gold: 0, rank: 35, priority: 'essential', desc: 'The ONLY saddle that matters. +3 speed/accel.', aliases: ['naco', 'nacogdoches', 'best saddle', 'meta saddle', 'speed saddle'] },
  { id: 't_stir_hood', type: 'saddle', category: 'Stirrups', name: 'Hooded Stirrups', price: 144, gold: 0, rank: 54, priority: 'essential', desc: 'Required to max out the Naco saddle stats.', aliases: ['hooded stirrups', 'best stirrups', 'naco stirrups'] },
];
