// RDO Master Catalogue Data
// Each item: id, shop, name, price, gold, rank, type, desc, [tokens], [role]

const MASTER_CATALOG = [
  // --- GUNSMITH ---
  { id: 'w_navy', shop: 'gunsmith', name: 'Navy Revolver', price: 275.00, gold: 0, rank: 1, type: 'Sidearm', desc: 'High damage, slow reload' },
  { id: 'w_lemat', shop: 'gunsmith', name: 'LeMat Revolver', price: 317.00, gold: 0, rank: 1, type: 'Sidearm', desc: '9 rounds + shotgun shell' },
  { id: 'w_schofield', shop: 'gunsmith', name: 'Schofield Revolver', price: 192.00, gold: 0, rank: 9, type: 'Sidearm', desc: 'High accuracy' },
  { id: 'w_volcanic', shop: 'gunsmith', name: 'Volcanic Pistol', price: 270.00, gold: 0, rank: 21, type: 'Sidearm', desc: 'Lever-action pistol' },
  { id: 'w_lancaster', shop: 'gunsmith', name: 'Lancaster Repeater', price: 243.00, gold: 0, rank: 12, type: 'Longarm', desc: 'Best all-around repeater' },
  { id: 'w_bolt', shop: 'gunsmith', name: 'Bolt Action Rifle', price: 216.00, gold: 0, rank: 7, type: 'Longarm', desc: 'Essential for hunting' },
  { id: 'w_carcano', shop: 'gunsmith', name: 'Carcano Rifle', price: 456.00, gold: 0, rank: 50, type: 'Longarm', desc: 'Meta sniper rifle' },
  { id: 'w_rolling', shop: 'gunsmith', name: 'Rolling Block Rifle', price: 411.00, gold: 0, rank: 13, type: 'Longarm', desc: 'High damage sniper' },
  { id: 'w_pump', shop: 'gunsmith', name: 'Pump Action Shotgun', price: 266.00, gold: 0, rank: 5, type: 'Longarm', desc: 'Reliable close quarters' },
  { id: 'w_bow_imp', shop: 'gunsmith', name: 'Improved Bow', price: 275.00, gold: 0, rank: 10, type: 'Longarm', desc: 'Silent kills, massive range' },
  { id: 'a_express_rifle', shop: 'gunsmith', name: 'Express Rifle Ammo', price: 0.80, gold: 0, rank: 31, type: 'Ammo', desc: 'Box of 60' },
  { id: 'a_express_rev', shop: 'gunsmith', name: 'Express Revolver Ammo', price: 0.80, gold: 0, rank: 31, type: 'Ammo', desc: 'Box of 60' },

  // --- STABLES ---
  { id: 'h_arabian_black', shop: 'stable', name: 'Black Arabian', price: 0, gold: 42, rank: 70, type: 'Superior', desc: 'Elite handling' },
  { id: 'h_mft_amber', shop: 'stable', name: 'Missouri Fox Trotter', price: 950.00, gold: 0, rank: 58, type: 'Multi', desc: 'Top tier speed/stamina' },
  { id: 'h_turk_gold', shop: 'stable', name: 'Turkoman (Gold)', price: 950.00, gold: 0, rank: 56, type: 'Multi', desc: 'High health war/race hybrid' },
  { id: 'h_mustang_buck', shop: 'stable', name: 'Mustang (Buckskin)', price: 500.00, gold: 0, rank: 1, type: 'Multi', desc: 'The budget king. Brave & healthy.' },
  { id: 'h_nacho', shop: 'stable', name: 'Nacogdoches Saddle', price: 512.00, gold: 0, rank: 35, type: 'Tack', desc: 'The meta saddle' },
  { id: 'h_hooded', shop: 'stable', name: 'Hooded Stirrups', price: 144.00, gold: 0, rank: 54, type: 'Tack', desc: '+50% Drain Reduction' },

  // --- FENCE ---
  { id: 'f_dynamite', shop: 'fence', name: 'Dynamite Arrow Pamphlet', price: 895.00, gold: 0, rank: 93, type: 'Recipe', desc: 'Craft explosive arrows' },
  { id: 'f_incendiary', shop: 'fence', name: 'Incendiary Buckshot Pamphlet', price: 950.00, gold: 0, rank: 80, type: 'Recipe', desc: 'Craft fire shells' },
  { id: 'f_explosive', shop: 'fence', name: 'Explosive Slug Pamphlet', price: 950.00, gold: 0, rank: 84, type: 'Recipe', desc: 'Craft explosive slugs' },
  { id: 'f_machete', shop: 'fence', name: 'Machete', price: 40.00, gold: 0, rank: 32, type: 'Melee', desc: 'Sharp blade' },
  { id: 'f_hatchet', shop: 'fence', name: 'Cleaver', price: 40.00, gold: 0, rank: 5, type: 'Melee', desc: 'Thrown weapon' },

  // --- TAILOR ---
  { id: 'c_morning', shop: 'tailor', name: 'Morning Tail Coat', price: 125.00, gold: 0, rank: 1, type: 'Coat', desc: 'Formal attire' },
  { id: 'c_bandolier', shop: 'tailor', name: 'Double Bandolier', price: 325.00, gold: 0, rank: 20, type: 'Accessory', desc: 'Increased ammo capacity' },
  { id: 'c_grizzlies', shop: 'tailor', name: 'The Grizzlies Outlaw', price: 0, gold: 52, rank: 1, type: 'Outfit', desc: 'Warm weather gear' },

  // --- GENERAL STORE ---
  { id: 'g_beans', shop: 'general', name: 'Canned Beans', price: 0.60, gold: 0, rank: 1, type: 'Provisions', desc: 'Staple food' },
  { id: 'g_miracle', shop: 'general', name: 'Potent Miracle Tonic', price: 4.50, gold: 0, rank: 1, type: 'Tonic', desc: 'Fortifies all cores' },
  { id: 'g_oil', shop: 'general', name: 'Gun Oil', price: 1.50, gold: 0, rank: 1, type: 'Maintenance', desc: 'Clean weapons' },

  // --- MADAM NAZAR ---
  { id: 'n_shovel', shop: 'nazar', name: 'Pennington Field Shovel', price: 350.00, gold: 0, rank: 1, role: 'Collector', tokens: 0, type: 'Tool', desc: 'Digs up buried items' },
  { id: 'n_detector', shop: 'nazar', name: 'Metal Detector', price: 700.00, gold: 0, rank: 5, role: 'Collector', tokens: 2, type: 'Tool', desc: 'Finds coins and jewelry' },
  { id: 'n_binoculars', shop: 'nazar', name: 'Refined Binoculars', price: 450.00, gold: 0, rank: 5, role: 'Collector', tokens: 2, type: 'Tool', desc: 'Highlights dig sites' },

  // --- ROLE VENDORS (Wilderness Outfitters / Maggie) ---
  { id: 'r_fast_travel', shop: 'roles', name: 'Fast Travel Post', price: 700.00, gold: 0, rank: 65, type: 'Camp', desc: 'Travel from wilderness camp' },
  { id: 'r_bounty_wagon', shop: 'roles', name: 'Bounty Wagon', price: 875.00, gold: 0, rank: 10, role: 'Bounty Hunter', tokens: 2, type: 'Vehicle', desc: 'Secure transport' },
  { id: 'r_hunting_wagon', shop: 'roles', name: 'Hunting Wagon', price: 875.00, gold: 0, rank: 10, role: 'Trader', tokens: 2, type: 'Vehicle', desc: 'Carries 5 large carcasses' },
  { id: 'r_large_wagon', shop: 'roles', name: 'Large Delivery Wagon', price: 750.00, gold: 0, rank: 10, role: 'Trader', tokens: 2, type: 'Vehicle', desc: 'Max sale size' },
  { id: 'r_still_condenser', shop: 'roles', name: 'Condenser Upgrade', price: 825.00, gold: 0, rank: 5, role: 'Moonshiner', tokens: 2, type: 'Upgrade', desc: 'Average strength shine' },
  { id: 'r_still_pol', shop: 'roles', name: 'Polished Copper Upgrade', price: 875.00, gold: 0, rank: 10, role: 'Moonshiner', tokens: 3, type: 'Upgrade', desc: 'Strong shine' }
];

export default MASTER_CATALOG;
