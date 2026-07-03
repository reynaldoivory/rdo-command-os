// =========================================================================
// MASTER CATALOG - ALL PURCHASABLE ITEMS IN RDO
// Sources: GTABase.com, Rockstar Newswire, Jean Ropke Map
// Last verified: January 2025
// =========================================================================

export const CATALOG = [
  // ===== WEAPONS - REVOLVERS (Verified from GTABase) =====
  { id: 'w001', type: 'weapon', category: 'Revolver', name: 'Cattleman Revolver', price: 50, gold: 0, rank: 1, priority: 'starter', desc: 'Standard issue revolver. Reliable and accurate.' },
  { id: 'w002', type: 'weapon', category: 'Revolver', name: 'Schofield Revolver', price: 192, gold: 0, rank: 9, priority: 'recommended', desc: 'Higher damage than Cattleman. Slower fire rate.' },
  { id: 'w003', type: 'weapon', category: 'Revolver', name: 'Double-Action Revolver', price: 127, gold: 0, rank: 1, priority: 'optional', desc: 'Fast firing. Lower damage per shot.' },
  { id: 'w004', type: 'weapon', category: 'Revolver', name: 'Navy Revolver', price: 275, gold: 0, rank: 1, priority: 'essential', desc: 'BEST sidearm stats. Holster for 10s bypasses slow reload. META.' },
  { id: 'w005', type: 'weapon', category: 'Revolver', name: 'LeMat Revolver', price: 317, gold: 0, rank: 1, priority: 'recommended', desc: '9 rounds + 1 shotgun shell. Auto-switches between. Great versatility.' },
  { id: 'w006', type: 'weapon', category: 'Revolver', name: 'High Roller Double-Action', price: 190, gold: 0, rank: 1, priority: 'optional', desc: 'Ornate variant of Double-Action. Same stats.' },

  // ===== WEAPONS - PISTOLS (Verified from GTABase) =====
  { id: 'w007', type: 'weapon', category: 'Pistol', name: 'Volcanic Pistol', price: 270, gold: 0, rank: 1, priority: 'optional', desc: 'High damage semi-auto. Slow fire rate.' },
  { id: 'w008', type: 'weapon', category: 'Pistol', name: 'Semi-Automatic Pistol', price: 537, gold: 0, rank: 22, priority: 'recommended', desc: 'Fast firing modern pistol. 8-round magazine.' },
  { id: 'w009', type: 'weapon', category: 'Pistol', name: 'Mauser Pistol', price: 450, gold: 0, rank: 34, priority: 'recommended', desc: '10-round magazine. Very fast reload.' },
  { id: 'w010', type: 'weapon', category: 'Pistol', name: 'M1899 Pistol', price: 350, gold: 0, rank: 56, priority: 'luxury', desc: 'Fastest firing pistol. Low damage.' },

  // ===== WEAPONS - REPEATERS (Verified from GTABase) =====
  { id: 'w011', type: 'weapon', category: 'Repeater', name: 'Carbine Repeater', price: 90, gold: 0, rank: 1, priority: 'starter', desc: 'Starter repeater. Balanced stats.' },
  { id: 'w012', type: 'weapon', category: 'Repeater', name: 'Lancaster Repeater', price: 243, gold: 0, rank: 12, priority: 'essential', desc: 'Best accuracy repeater. 14-round tube. META weapon.' },
  { id: 'w013', type: 'weapon', category: 'Repeater', name: 'Litchfield Repeater', price: 348, gold: 0, rank: 18, priority: 'optional', desc: 'Highest damage repeater. Poor accuracy.' },
  { id: 'w014', type: 'weapon', category: 'Repeater', name: 'Evans Repeater', price: 300, gold: 0, rank: 1, priority: 'optional', desc: '26-round capacity. Longest reload.' },

  // ===== WEAPONS - RIFLES (Verified from GTABase) =====
  { id: 'w015', type: 'weapon', category: 'Rifle', name: 'Springfield Rifle', price: 156, gold: 0, rank: 1, priority: 'recommended', desc: 'Single-shot rifle. High damage.' },
  { id: 'w016', type: 'weapon', category: 'Rifle', name: 'Bolt Action Rifle', price: 216, gold: 0, rank: 7, priority: 'essential', desc: '5-round internal magazine. Versatile. META for hunting.' },
  { id: 'w017', type: 'weapon', category: 'Rifle', name: 'Varmint Rifle', price: 72, gold: 0, rank: 8, priority: 'essential', desc: 'Small game hunting. Required for perfect pelts.' },
  { id: 'w018', type: 'weapon', category: 'Rifle', name: 'Rolling Block Rifle', price: 411, gold: 0, rank: 13, priority: 'recommended', desc: 'Sniper rifle. Highest damage single shot.' },
  { id: 'w019', type: 'weapon', category: 'Rifle', name: 'Carcano Rifle', price: 456, gold: 0, rank: 50, priority: 'essential', desc: '6-round sniper. META PvP weapon.' },
  { id: 'w020', type: 'weapon', category: 'Rifle', name: 'Elephant Rifle', price: 0, gold: 19, rank: 1, priority: 'luxury', desc: 'Naturalist role. Extreme damage. Two-shot before reload.', role: 'naturalist' },

  // ===== WEAPONS - SHOTGUNS (Verified from GTABase) =====
  { id: 'w021', type: 'weapon', category: 'Shotgun', name: 'Double-Barrel Shotgun', price: 185, gold: 0, rank: 1, priority: 'optional', desc: '2 shells. High burst damage.' },
  { id: 'w022', type: 'weapon', category: 'Shotgun', name: 'Pump Shotgun', price: 266, gold: 0, rank: 5, priority: 'essential', desc: 'Better range than Semi-Auto. 5-round tube. Reliable close combat.' },
  { id: 'w023', type: 'weapon', category: 'Shotgun', name: 'Repeating Shotgun', price: 434, gold: 0, rank: 11, priority: 'optional', desc: '6-round tube. Fastest firing.' },
  { id: 'w024', type: 'weapon', category: 'Shotgun', name: 'Semi-Auto Shotgun', price: 495, gold: 0, rank: 42, priority: 'recommended', desc: 'Fastest hip-fire shotgun. 5 quick shots. Great for PIB builds.' },
  { id: 'w025', type: 'weapon', category: 'Shotgun', name: 'Sawed-Off Shotgun', price: 111, gold: 0, rank: 19, priority: 'recommended', desc: 'Sidearm slot shotgun! Dual wield with Navy for versatility.' },

  // ===== WEAPONS - BOW & MELEE (Verified from GTABase) =====
  { id: 'w026', type: 'weapon', category: 'Bow', name: 'Bow', price: 124, gold: 0, rank: 1, priority: 'essential', desc: 'Silent hunting weapon. Required for Trader.' },
  { id: 'w027', type: 'weapon', category: 'Bow', name: 'Improved Bow', price: 275, gold: 0, rank: 1, priority: 'essential', desc: 'Faster draw. Counters Slippery Bastard with PIB. Stealth hunting.', role: 'naturalist' },
  { id: 'w028', type: 'weapon', category: 'Melee', name: 'Machete', price: 0, gold: 5, rank: 1, priority: 'optional', desc: 'Longer reach melee.' },
  { id: 'w029', type: 'weapon', category: 'Melee', name: 'Hatchet', price: 4.25, gold: 0, rank: 28, priority: 'optional', desc: 'Small axe. Can throw.' },
  { id: 'w030', type: 'weapon', category: 'Thrown', name: 'Bolas', price: 30, gold: 0, rank: 1, priority: 'recommended', desc: 'Bounty Hunter role. Trips targets.', role: 'bountyHunter' },
  { id: 'w031', type: 'weapon', category: 'Thrown', name: 'Reinforced Lasso', price: 350, gold: 0, rank: 1, priority: 'essential', desc: 'Bounty Hunter role. Cannot be cut.', role: 'bountyHunter' },
  { id: 'w032', type: 'weapon', category: 'Melee', name: 'Hammer', price: 75, gold: 0, rank: 1, priority: 'optional', desc: 'Trader role melee weapon.', role: 'trader' },
  { id: 'w033', type: 'weapon', category: 'Melee', name: 'Águila Machete', price: 150, gold: 0, rank: 1, priority: 'optional', desc: 'Collector role machete.', role: 'collector' },

  // ===== HORSES - WORK (Verified prices from GTABase) =====
  { id: 'h001', type: 'horse', category: 'Draft', name: 'Belgian Draft', price: 120, gold: 0, rank: 1, priority: 'starter', desc: 'Strong work horse. Low speed.' },
  { id: 'h002', type: 'horse', category: 'Draft', name: 'Shire', price: 130, gold: 0, rank: 1, priority: 'optional', desc: 'Largest horse. High health.' },

  // ===== HORSES - RIDING =====
  { id: 'h003', type: 'horse', category: 'Riding', name: 'Morgan', price: 55, gold: 0, rank: 1, priority: 'starter', desc: 'Starter riding horse.' },
  { id: 'h004', type: 'horse', category: 'Riding', name: 'Kentucky Saddler', price: 50, gold: 0, rank: 1, priority: 'starter', desc: 'Balanced riding horse.' },
  { id: 'h005', type: 'horse', category: 'Riding', name: 'Mustang (Wild Bay)', price: 500, gold: 0, rank: 56, priority: 'recommended', desc: 'Brave horse. War class. High health.' },

  // ===== HORSES - RACE =====
  { id: 'h006', type: 'horse', category: 'Race', name: 'American Standardbred', price: 400, gold: 0, rank: 21, priority: 'recommended', desc: 'Fast race horse. High stamina.' },
  { id: 'h007', type: 'horse', category: 'Race', name: 'Thoroughbred', price: 450, gold: 0, rank: 26, priority: 'recommended', desc: 'Top speed race horse.' },
  { id: 'h008', type: 'horse', category: 'Race', name: 'Norfolk Roadster (Spotted Tri)', price: 950, gold: 0, rank: 20, priority: 'recommended', desc: 'Moonshiner role. Best stamina in game.' },

  // ===== HORSES - MULTI-CLASS (Verified from GTABase) =====
  { id: 'h009', type: 'horse', category: 'Multi', name: 'Missouri Fox Trotter (Amber Champ.)', price: 1125, gold: 0, rank: 54, priority: 'essential', desc: 'Best all-rounder. Speed + Health. META horse.' },
  { id: 'h010', type: 'horse', category: 'Multi', name: 'Missouri Fox Trotter (Silver Dapple)', price: 950, gold: 0, rank: 58, priority: 'essential', desc: 'Alternative MFT coat. Same great stats.' },
  { id: 'h011', type: 'horse', category: 'Multi', name: 'Turkoman (Dark Bay)', price: 925, gold: 0, rank: 54, priority: 'recommended', desc: 'War/Race hybrid. High health.' },
  { id: 'h012', type: 'horse', category: 'Multi', name: 'Turkoman (Gold)', price: 950, gold: 0, rank: 58, priority: 'recommended', desc: 'War/Race hybrid. Gold coat variant.' },
  { id: 'h013', type: 'horse', category: 'Multi', name: 'Turkoman (Silver)', price: 1000, gold: 0, rank: 60, priority: 'recommended', desc: 'Best Turkoman stats. Silver coat.' },

  // ===== HORSES - ARABIANS (Verified from GTABase) =====
  { id: 'h014', type: 'horse', category: 'Arabian', name: 'Arabian (Red Chestnut)', price: 250, gold: 0, rank: 1, priority: 'recommended', desc: 'Elite handling. Skittish but fast.' },
  { id: 'h015', type: 'horse', category: 'Arabian', name: 'Arabian (White)', price: 1200, gold: 0, rank: 66, priority: 'luxury', desc: 'Highest speed Arabian. Very skittish.' },
  { id: 'h016', type: 'horse', category: 'Arabian', name: 'Arabian (Rose Grey Bay)', price: 1250, gold: 0, rank: 68, priority: 'luxury', desc: 'Best Arabian stats. Top tier.' },
  { id: 'h017', type: 'horse', category: 'Arabian', name: 'Black Arabian', price: 1050, gold: 42, rank: 64, priority: 'luxury', desc: 'Can be bought with Gold. Great handling.' },

  // ===== ROLE HORSES (Verified from GTABase) =====
  { id: 'h018', type: 'horse', category: 'Role', name: 'Criollo (Bounty Hunter)', price: 150, gold: 0, rank: 1, priority: 'recommended', desc: 'Bounty Hunter role horse. Good stamina.', role: 'bountyHunter' },
  { id: 'h019', type: 'horse', category: 'Role', name: 'Breton (Bounty Hunter)', price: 950, gold: 0, rank: 20, priority: 'essential', desc: 'Bounty Hunter Rank 20. War class. Very brave.', role: 'bountyHunter' },
  { id: 'h020', type: 'horse', category: 'Role', name: 'Kladruber (Trader)', price: 150, gold: 0, rank: 1, priority: 'recommended', desc: 'Trader role horse. High health.', role: 'trader' },
  { id: 'h021', type: 'horse', category: 'Role', name: 'Gypsy Cob (Trader)', price: 950, gold: 0, rank: 20, priority: 'essential', desc: 'Trader Rank 20. Draft class. Most health in game.', role: 'trader' },

  // ===== SADDLES (Community verified) =====
  { id: 's001', type: 'saddle', category: 'Standard', name: 'Alligator Ranch Cutter', price: 115, gold: 0, rank: 1, priority: 'starter', desc: 'Entry level saddle. +16% stamina.' },
  { id: 's002', type: 'saddle', category: 'Standard', name: 'Panther Trail', price: 175, gold: 0, rank: 26, priority: 'recommended', desc: 'Panther skin. +24% stamina.' },
  { id: 's003', type: 'saddle', category: 'Special', name: 'Nacogdoches Saddle', price: 512, gold: 0, rank: 35, priority: 'essential', desc: 'BEST SADDLE. +35% regen, -50% core drain. META.' },
  { id: 's004', type: 'saddle', category: 'Role', name: 'Bounty Hunter Saddle', price: 0, gold: 0, rank: 1, priority: 'recommended', desc: 'Bounty Hunter role. Good stats.', role: 'bountyHunter' },
  { id: 's005', type: 'saddle', category: 'Role', name: 'Collector Saddle', price: 0, gold: 0, rank: 1, priority: 'recommended', desc: 'Collector role. Saddlebag capacity.', role: 'collector' },
  { id: 's006', type: 'saddle', category: 'Role', name: 'Trader Saddle', price: 0, gold: 0, rank: 1, priority: 'recommended', desc: 'Trader role. Great for long hauls.', role: 'trader' },

  // ===== STIRRUPS (Verified from GTABase) =====
  { id: 't001', type: 'tack', category: 'Stirrups', name: 'Hooded Stirrups', price: 75, gold: 0, rank: 1, priority: 'starter', desc: '+2% speed/accel.' },
  { id: 't002', type: 'tack', category: 'Stirrups', name: 'Reinforced Stirrups', price: 210, gold: 0, rank: 60, priority: 'essential', desc: '+4% speed/accel. Best non-role.' },
  { id: 't003', type: 'tack', category: 'Stirrups', name: 'Delgado Saddle', price: 495, gold: 0, rank: 35, priority: 'recommended', desc: 'Second best saddle. +34% regen.' },

  // ===== ROLE LICENSES (Verified costs) =====
  { id: 'r001', type: 'role', category: 'License', name: 'Bounty Hunter License', price: 0, gold: 15, rank: 1, priority: 'essential', desc: 'ONLY role that earns gold. Start here.' },
  { id: 'r002', type: 'role', category: 'License', name: 'Trader (Butcher Table)', price: 0, gold: 15, rank: 1, priority: 'essential', desc: 'Best passive income. Camp business.' },
  { id: 'r003', type: 'role', category: 'License', name: 'Collector Bag', price: 0, gold: 15, rank: 1, priority: 'essential', desc: 'Highest cash/hour if using Jean Ropke map.' },
  { id: 'r004', type: 'role', category: 'License', name: 'Moonshiner Shack', price: 0, gold: 25, rank: 5, priority: 'recommended', desc: 'Requires Trader Rank 5. Good passive.' },
  { id: 'r005', type: 'role', category: 'License', name: 'Naturalist Sample Kit', price: 0, gold: 25, rank: 1, priority: 'optional', desc: 'Harriet role. Least profitable.' },
  { id: 'r006', type: 'role', category: 'License', name: 'Prestigious BH License', price: 0, gold: 15, rank: 1, priority: 'recommended', desc: 'Extends Bounty Hunter to Rank 30.', role: 'bountyHunter' },

  // ===== COLLECTOR TOOLS (Verified from Reddit FAQ - SmurfinGTA Guide) =====
  // Note: Purchased from Madam Nazar for CASH, not Gold
  { id: 'c001', type: 'tool', category: 'Collector', name: 'Shovel', price: 350, gold: 0, rank: 1, priority: 'essential', desc: 'Dig up buried items. Required for coins.', role: 'collector' },
  { id: 'c002', type: 'tool', category: 'Collector', name: 'Metal Detector', price: 700, gold: 0, rank: 5, priority: 'essential', desc: 'Find jewelry/coins/fossils. HUGE money maker.', role: 'collector' },
  { id: 'c003', type: 'tool', category: 'Collector', name: 'Refined Binoculars', price: 450, gold: 0, rank: 5, priority: 'recommended', desc: 'Eagle Eye built-in. Spot dig sites from afar.', role: 'collector' },
  { id: 'c004', type: 'tool', category: 'Collector', name: 'Horse Lantern', price: 350, gold: 0, rank: 10, priority: 'optional', desc: 'Night collecting. Attach to saddle.', role: 'collector' },
  { id: 'c005', type: 'tool', category: 'Collector', name: 'Collector Saddlebag', price: 125, gold: 0, rank: 5, priority: 'recommended', desc: 'More outfit storage on horse.', role: 'collector' },

  // ===== NATURALIST TOOLS =====
  { id: 'c006', type: 'tool', category: 'Naturalist', name: 'Varmint Sedative Ammo', price: 0, gold: 0, rank: 1, priority: 'essential', desc: 'Sedate small animals for sampling.', role: 'naturalist' },
  { id: 'c007', type: 'tool', category: 'Naturalist', name: 'Advanced Camera', price: 0, gold: 0, rank: 1, priority: 'recommended', desc: 'Better wildlife photography.', role: 'naturalist' },

  // ===== TRADER UPGRADES =====
  { id: 'c008', type: 'tool', category: 'Trader', name: 'Medium Delivery Wagon', price: 500, gold: 0, rank: 5, priority: 'essential', desc: '50 goods capacity. Trader Rank 5.', role: 'trader' },
  { id: 'c009', type: 'tool', category: 'Trader', name: 'Large Delivery Wagon', price: 750, gold: 0, rank: 10, priority: 'essential', desc: '100 goods capacity. Trader Rank 10.', role: 'trader' },
  { id: 'c010', type: 'tool', category: 'Trader', name: 'Hunting Wagon', price: 875, gold: 0, rank: 10, priority: 'essential', desc: 'Store 5 large pelts/carcasses. Persists in missions.', role: 'trader' },
  { id: 'c011', type: 'tool', category: 'Trader', name: 'Stew Pot', price: 650, gold: 0, rank: 1, priority: 'recommended', desc: 'Cook special stews for gold cores.', role: 'trader' },

  // ===== MOONSHINER UPGRADES =====
  { id: 'c012', type: 'tool', category: 'Moonshiner', name: 'Condenser Upgrade', price: 825, gold: 0, rank: 1, priority: 'essential', desc: 'Faster moonshine brewing.', role: 'moonshiner' },
  { id: 'c013', type: 'tool', category: 'Moonshiner', name: 'Polished Copper Upgrade', price: 875, gold: 0, rank: 1, priority: 'essential', desc: 'Highest tier moonshine ($226/batch).', role: 'moonshiner' },
  { id: 'c014', type: 'tool', category: 'Moonshiner', name: 'Bar Expansion', price: 950, gold: 0, rank: 1, priority: 'optional', desc: 'Band plays in your shack bar.', role: 'moonshiner' },

  // ===== ABILITY CARDS (Community verified) =====
  { id: 'a001', type: 'ability', category: 'Dead Eye', name: 'Paint It Black', price: 0, gold: 0, rank: 1, priority: 'essential', desc: 'Free. Best PvE card. Auto-headshots.' },
  { id: 'a002', type: 'ability', category: 'Dead Eye', name: 'Slow and Steady', price: 0, gold: 0, rank: 24, priority: 'recommended', desc: 'Tank build. Cannot be headshot in Dead Eye.' },
  { id: 'a003', type: 'ability', category: 'Dead Eye', name: 'Slippery Bastard', price: 0, gold: 0, rank: 36, priority: 'optional', desc: 'PvP evasion. Enemies cant lock on.' },
  { id: 'a004', type: 'ability', category: 'Dead Eye', name: 'Focus Fire', price: 0, gold: 0, rank: 50, priority: 'optional', desc: 'Team damage buff. PvP group play.' },
  { id: 'a005', type: 'ability', category: 'Passive', name: 'Winning Streak', price: 50, gold: 0, rank: 1, priority: 'essential', desc: 'Consecutive hits deal more damage.' },
  { id: 'a006', type: 'ability', category: 'Passive', name: 'Peak Condition', price: 50, gold: 0, rank: 1, priority: 'recommended', desc: 'More damage at full stamina.' },
  { id: 'a007', type: 'ability', category: 'Passive', name: 'Iron Lung', price: 50, gold: 0, rank: 1, priority: 'recommended', desc: 'More stamina, less drain.' },
  { id: 'a008', type: 'ability', category: 'Passive', name: 'Never Without One', price: 350, gold: 0, rank: 46, priority: 'essential', desc: 'Hat blocks headshot. META PvP.' },
  { id: 'a009', type: 'ability', category: 'Passive', name: 'Cold Blooded', price: 50, gold: 0, rank: 1, priority: 'recommended', desc: 'Health regen on kills. Great for PvE.' },
  { id: 'a010', type: 'ability', category: 'Passive', name: 'Strange Medicine', price: 50, gold: 0, rank: 1, priority: 'recommended', desc: 'Health regen on damage. Sustain build.' },
  { id: 'a011', type: 'ability', category: 'Passive', name: 'Fool Me Once', price: 50, gold: 0, rank: 1, priority: 'recommended', desc: 'Damage reduction on consecutive hits.' },
  { id: 'a012', type: 'ability', category: 'Upgrade', name: 'Card Upgrade (Tier 2)', price: 350, gold: 0, rank: 1, priority: 'recommended', desc: 'Upgrade any card to Tier 2.' },
  { id: 'a013', type: 'ability', category: 'Upgrade', name: 'Card Upgrade (Tier 3)', price: 500, gold: 0, rank: 1, priority: 'recommended', desc: 'Upgrade any card to Tier 3 (max).' },

  // ===== CAMP UPGRADES =====
  { id: 'u001', type: 'camp', category: 'Tent', name: 'Lean-To Tent', price: 0, gold: 0, rank: 1, priority: 'starter', desc: 'Default tent.' },
  { id: 'u002', type: 'camp', category: 'Tent', name: 'Covered Tent', price: 85, gold: 0, rank: 1, priority: 'optional', desc: 'Better weather protection.' },
  { id: 'u003', type: 'camp', category: 'Tent', name: 'Large Tent', price: 175, gold: 0, rank: 64, priority: 'luxury', desc: 'Biggest tent. Status symbol.' },
  { id: 'u004', type: 'camp', category: 'Utility', name: 'Fast Travel Post', price: 0, gold: 0, rank: 1, priority: 'essential', desc: 'Free fast travel FROM camp. Huge QoL.' },
  { id: 'u005', type: 'camp', category: 'Utility', name: 'Stew Pot', price: 650, gold: 0, rank: 1, priority: 'recommended', desc: 'Cook stew for gold core rings.' },
  { id: 'u006', type: 'camp', category: 'Utility', name: 'Weapons Locker', price: 0, gold: 0, rank: 1, priority: 'recommended', desc: 'Hide weapons from weapon wheel.' },
  { id: 'u007', type: 'camp', category: 'Dog', name: 'Camp Dog', price: 0, gold: 15, rank: 1, priority: 'optional', desc: 'Warns of raids. Good boy.' },

  // ===== PAMPHLETS (CRAFTING RECIPES) =====
  { id: 'p001', type: 'pamphlet', category: 'Ammo', name: 'Small Game Arrows', price: 350, gold: 0, rank: 22, priority: 'essential', desc: 'Perfect small pelts. Required for Trader.' },
  { id: 'p002', type: 'pamphlet', category: 'Ammo', name: 'Poison Arrows', price: 450, gold: 0, rank: 36, priority: 'optional', desc: 'Damage over time arrows.' },
  { id: 'p003', type: 'pamphlet', category: 'Ammo', name: 'Fire Arrows', price: 500, gold: 0, rank: 44, priority: 'optional', desc: 'Incendiary arrows.' },
  { id: 'p004', type: 'pamphlet', category: 'Ammo', name: 'Explosive Express', price: 950, gold: 0, rank: 90, priority: 'luxury', desc: 'Explosive bullets. Endgame grief tool.' },
  { id: 'p005', type: 'pamphlet', category: 'Ammo', name: 'Explosive Slug', price: 850, gold: 0, rank: 82, priority: 'luxury', desc: 'Explosive shotgun rounds.' },
  { id: 'p006', type: 'pamphlet', category: 'Tonic', name: 'Special Health Cure', price: 450, gold: 0, rank: 48, priority: 'recommended', desc: 'Best craftable health tonic.' },
  { id: 'p007', type: 'pamphlet', category: 'Tonic', name: 'Special Snake Oil', price: 580, gold: 0, rank: 64, priority: 'recommended', desc: 'Best Dead Eye tonic.' },

  // ===== CLOTHING ESSENTIALS =====
  { id: 'cl01', type: 'clothing', category: 'Hat', name: 'Stalker Hat', price: 12, gold: 0, rank: 8, priority: 'starter', desc: 'Classic cowboy hat.' },
  { id: 'cl02', type: 'clothing', category: 'Coat', name: 'Duster Coat', price: 42, gold: 0, rank: 15, priority: 'recommended', desc: 'Long riding coat. Iconic look.' },
  { id: 'cl03', type: 'clothing', category: 'Accessory', name: 'Bandolier', price: 0, gold: 8, rank: 1, priority: 'essential', desc: '+10 rifle ammo capacity.' },
  { id: 'cl04', type: 'clothing', category: 'Accessory', name: 'Off-Hand Holster', price: 0, gold: 0, rank: 25, priority: 'essential', desc: 'Dual wield sidearms. Free at rank 25.' },

  // ===== CONSUMABLES WORTH BUYING =====
  { id: 'i001', type: 'item', category: 'Consumable', name: 'Gun Oil (x5)', price: 10, gold: 0, rank: 1, priority: 'essential', desc: 'Keep weapons clean. Always stock up.' },
  { id: 'i002', type: 'item', category: 'Consumable', name: 'Horse Reviver (x5)', price: 40, gold: 0, rank: 1, priority: 'essential', desc: 'Save your horse. Always carry.' },
  { id: 'i003', type: 'item', category: 'Lure', name: 'Lake Lure', price: 2.50, gold: 0, rank: 1, priority: 'recommended', desc: 'Catch large lake fish. Reusable.' },
  { id: 'i004', type: 'item', category: 'Lure', name: 'River Lure', price: 2.50, gold: 0, rank: 1, priority: 'recommended', desc: 'Catch large river fish. Reusable.' },
];

// =========================================================================
// CATALOG HELPER FUNCTIONS
// =========================================================================

/**
 * Filter catalog by type
 * @param {string} type - Item type (weapon, horse, saddle, etc.)
 * @returns {Array} Filtered items
 */
export function getCatalogByType(type) {
  return CATALOG.filter(item => item.type === type);
}

/**
 * Filter catalog by category within a type
 * @param {string} type - Item type
 * @param {string} category - Item category
 * @returns {Array} Filtered items
 */
export function getCatalogByCategory(type, category) {
  return CATALOG.filter(item => item.type === type && item.category === category);
}

/**
 * Filter catalog by priority
 * @param {string} priority - Priority level (essential, recommended, optional, luxury, starter)
 * @returns {Array} Filtered items
 */
export function getCatalogByPriority(priority) {
  return CATALOG.filter(item => item.priority === priority);
}

/**
 * Get all essential items
 * @returns {Array} Essential items sorted by price
 */
export function getEssentialItems() {
  return CATALOG.filter(item => item.priority === 'essential')
    .sort((a, b) => a.price - b.price);
}

/**
 * Filter catalog by role
 * @param {string} role - Role ID (bountyHunter, trader, collector, moonshiner, naturalist)
 * @returns {Array} Role-specific items
 */
export function getCatalogByRole(role) {
  return CATALOG.filter(item => item.role === role);
}

/**
 * Get items affordable with current resources
 * @param {number} cash - Available cash
 * @param {number} gold - Available gold
 * @param {number} rank - Current player rank
 * @returns {Array} Affordable items
 */
export function getAffordableItems(cash, gold, rank) {
  return CATALOG.filter(item => 
    item.price <= cash && 
    item.gold <= gold && 
    item.rank <= rank
  );
}

/**
 * Calculate total cost of a shopping list
 * @param {string[]} itemIds - Array of item IDs
 * @returns {{ cash: number, gold: number }} Total cost
 */
export function calculateCartTotal(itemIds) {
  const items = itemIds.map(id => CATALOG.find(item => item.id === id)).filter(Boolean);
  return {
    cash: items.reduce((sum, item) => sum + item.price, 0),
    gold: items.reduce((sum, item) => sum + item.gold, 0),
  };
}

/**
 * Get unique categories for a given type
 * @param {string} type - Item type
 * @returns {string[]} Array of category names
 */
export function getCategoriesForType(type) {
  const items = getCatalogByType(type);
  return [...new Set(items.map(item => item.category))];
}
