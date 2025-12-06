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
// 2. MASTER CATALOG (Merged Verified Data)
// =========================================================================

export const CATALOG = [
  // --- WEAPONS (Essential/Meta) ---
  { id: 'w_rev_navy', type: 'weapon', category: 'Revolver', name: 'Navy Revolver', price: 275, gold: 0, rank: 1, priority: 'essential', desc: 'META. Highest damage/accuracy sidearm.' },
  { id: 'w_rep_lancaster', type: 'weapon', category: 'Repeater', name: 'Lancaster Repeater', price: 243, gold: 0, rank: 12, priority: 'essential', desc: 'META. Best accuracy and fire rate balance.' },
  { id: 'w_rif_bolt', type: 'weapon', category: 'Rifle', name: 'Bolt Action Rifle', price: 216, gold: 0, rank: 7, priority: 'starter', desc: 'FIRST MAJOR PURCHASE. One-shot kills for deer/combat. Buy at Rank 7.' },
  { id: 'w_rif_varmint', type: 'weapon', category: 'Rifle', name: 'Varmint Rifle', price: 72, gold: 0, rank: 8, priority: 'starter', desc: 'SECOND PURCHASE. Required for small game (birds/rabbits). Buy after Bolt Action.' },
  { id: 'w_rif_carcano', type: 'weapon', category: 'Sniper', name: 'Carcano Rifle', price: 456, gold: 0, rank: 50, priority: 'essential', desc: 'META. King of PvP/Long-range PvE.' },
  { id: 'w_sg_pump', type: 'weapon', category: 'Shotgun', name: 'Pump-Action Shotgun', price: 266, gold: 0, rank: 5, priority: 'essential', desc: 'Most reliable close-quarters weapon.' },
  { id: 'w_bow_improved', type: 'weapon', category: 'Bow', name: 'Improved Bow', price: 275, gold: 0, rank: 1, priority: 'essential', desc: 'Long range stealth. Good vs Slippery Bastard.' },
  { id: 'w_rev_lemat', type: 'weapon', category: 'Revolver', name: 'LeMat Revolver', price: 317, gold: 0, rank: 1, priority: 'recommended', desc: '9 rounds + 1 shotgun shell.' },
  { id: 'w_pst_mauser', type: 'weapon', category: 'Pistol', name: 'Mauser Pistol', price: 600, gold: 0, rank: 34, priority: 'recommended', desc: 'Rapid fire "spray and pray" meta.' },
  
  // --- ABILITY CARDS (Price = Tier 1 + 2 + 3 Upgrade Cost) ---
  { id: 'a_de_pib', type: 'ability', category: 'Dead Eye', name: 'Paint It Black (Max)', price: 900, gold: 0, rank: 1, priority: 'essential', desc: '100% Accuracy. The most used card in RDO.' },
  { id: 'a_pc_ss', type: 'ability', category: 'Combat', name: 'Sharpshooter (Max)', price: 900, gold: 0, rank: 10, priority: 'essential', desc: 'Scope damage boost. Sniper meta.' },
  { id: 'a_pd_il', type: 'ability', category: 'Defense', name: 'Iron Lung (Max)', price: 900, gold: 0, rank: 10, priority: 'essential', desc: 'Take less damage at high stamina.' },
  { id: 'a_pd_fmo', type: 'ability', category: 'Defense', name: 'Fool Me Once (Max)', price: 900, gold: 0, rank: 34, priority: 'essential', desc: 'Consecutive damage reduction. Tank meta.' },
  { id: 'a_pr_sm', type: 'ability', category: 'Recovery', name: 'Strange Medicine (Max)', price: 900, gold: 0, rank: 32, priority: 'essential', desc: 'Heal on damage dealt. PvE God Mode.' },
  { id: 'a_de_sns', type: 'ability', category: 'Dead Eye', name: 'Slow and Steady (Max)', price: 900, gold: 0, rank: 24, priority: 'recommended', desc: 'Tank build. Headshots do not kill instantly.' },

  // --- ROLE INVESTMENTS ---
  { id: 'r_lic_bh', type: 'role', category: 'License', name: 'Bounty Hunter License', price: 0, gold: 15, rank: 1, priority: 'essential', desc: 'ONLY role that earns Gold. Buy first.' },
  { id: 'r_lic_tr', type: 'role', category: 'License', name: 'Trader Butcher Table', price: 0, gold: 15, rank: 1, priority: 'essential', desc: 'Passive income business.' },
  { id: 'r_lic_col', type: 'role', category: 'License', name: 'Collector Bag', price: 0, gold: 15, rank: 1, priority: 'essential', desc: 'Active income king (with online map).' },
  
  // --- ROLE UPGRADES ---
  { id: 'u_col_det', type: 'tool', category: 'Collector', name: 'Metal Detector', price: 700, gold: 0, rank: 5, priority: 'essential', desc: 'Unlocks Jewelry/Coins. Huge ROI.' },
  { id: 'u_col_sho', type: 'tool', category: 'Collector', name: 'Pennington Field Shovel', price: 350, gold: 0, rank: 1, priority: 'essential', desc: 'Required to dig.' },
  { id: 'u_trd_wagL', type: 'tool', category: 'Trader', name: 'Large Delivery Wagon', price: 750, gold: 0, rank: 10, priority: 'essential', desc: 'Max profit ($500-$625) per run.' },
  { id: 'u_trd_hunt', type: 'tool', category: 'Trader', name: 'Hunting Wagon', price: 875, gold: 0, rank: 10, priority: 'essential', desc: 'Stores 5 large carcasses safely.' },
  { id: 'u_moon_cop', type: 'tool', category: 'Moonshiner', name: 'Polished Copper Upgrade', price: 875, gold: 0, rank: 10, priority: 'essential', desc: 'Unlocks Strong Moonshine ($226/hr).' },
  { id: 'u_nat_camp', type: 'camp', category: 'Camp', name: 'Wilderness Camp', price: 750, gold: 0, rank: 5, priority: 'essential', desc: 'Portable campfire. Combine with Fast Travel pamphlet.' },

  // --- HORSES & SADDLES ---
  { id: 'h_red_arab', type: 'horse', category: 'Elite', name: 'Red Chestnut Arabian', price: 250, gold: 0, rank: 1, priority: 'starter', desc: 'Best cheap horse. Buy after Bolt Action Rifle.' },
  { id: 'h_mft', type: 'horse', category: 'Multi', name: 'Missouri Fox Trotter', price: 1125, gold: 0, rank: 58, priority: 'essential', desc: 'Best stats (Speed + Health).' },
  { id: 'h_turk', type: 'horse', category: 'Multi', name: 'Turkoman', price: 950, gold: 0, rank: 56, priority: 'recommended', desc: 'High health combat horse.' },
  { id: 'h_mus', type: 'horse', category: 'Multi', name: 'Mustang (Buckskin)', price: 500, gold: 0, rank: 1, priority: 'recommended', desc: 'Best budget horse. Max health/stamina at Lvl 4.' },
  { id: 's_naco', type: 'saddle', category: 'Special', name: 'Nacogdoches Saddle', price: 512, gold: 0, rank: 35, priority: 'essential', desc: 'META. +35% Stamina Regen. The only saddle you need.' },
  { id: 't_stir', type: 'saddle', category: 'Stirrups', name: 'Hooded Stirrups', price: 144, gold: 0, rank: 54, priority: 'essential', desc: 'Required for Naco saddle stats.' },

  // --- QoL & PAMPHLETS ---
  { id: 'p_ft_wild', type: 'pamphlet', category: 'Travel', name: 'Fast Travel from Wilderness Camp', price: 1280, gold: 0, rank: 5, priority: 'essential', desc: 'GOD TIER. Teleport from anywhere on the map.' },
  { id: 'p_ammo_exp', type: 'pamphlet', category: 'Ammo', name: 'Explosive Express Ammo', price: 1000, gold: 0, rank: 90, priority: 'luxury', desc: 'Anti-griefer tool.' },
  { id: 'c_ft_post', type: 'camp', category: 'Camp', name: 'Fast Travel Post', price: 700, gold: 0, rank: 65, priority: 'essential', desc: 'Teleport from your main camp.' }
];
