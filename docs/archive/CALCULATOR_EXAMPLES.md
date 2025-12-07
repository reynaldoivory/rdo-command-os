/**
 * ═══════════════════════════════════════════════════════════════════════════
 * QUICK REFERENCE - Using The New Simulators
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Import the calculators
import { 
  calculateBountyPayout, 
  simulateBountySession,
  calculateGoldTimeBonus 
} from './src/simulator/bountyHunter';

import {
  calculateTraderDelivery,
  simulateTraderSession
} from './src/simulator/trader';

// ═══════════════════════════════════════════════════════════════════════════
// BOUNTY HUNTER EXAMPLES
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n🎯 BOUNTY HUNTER EXAMPLES\n');

// Example 1: Single $$ bounty, alive, optimal time (12 min)
const bountyOptimal = calculateBountyPayout({
  tier: 2,
  alive: true,
  targetCount: 1,
  minutesElapsed: 12
});

console.log('📋 Tier $$, Alive, Optimal Time (12 min)');
console.log(`   Cash: $${bountyOptimal.cash}`);
console.log(`   Gold: ${bountyOptimal.gold} bars`);
console.log(`   Per Hour: $${bountyOptimal.cash_per_hour}/hr`);
console.log(`   Breakdown:`, bountyOptimal.breakdown);

// Example 2: Multi-target bounty (tier 3, 2 targets)
const bountyMulti = calculateBountyPayout({
  tier: 3,
  alive: true,
  targetCount: 2,
  minutesElapsed: 18
});

console.log('\n📋 Tier $$$, 2 Targets, 18 min');
console.log(`   Cash: $${bountyMulti.cash}`);
console.log(`   Gold: ${bountyMulti.gold} bars`);
console.log(`   Per Hour: $${bountyMulti.cash_per_hour}/hr`);

// Example 3: Gold bonus over time
console.log('\n📋 Gold Bonus vs Time:');
console.log(`   6 min: ${calculateGoldTimeBonus(6)} gold`);
console.log(`   12 min: ${calculateGoldTimeBonus(12)} gold (optimal)`);
console.log(`   20 min: ${calculateGoldTimeBonus(20)} gold`);
console.log(`   30 min: ${calculateGoldTimeBonus(30)} gold`);

// Example 4: Full session simulation
const bountySession = simulateBountySession({
  sessionHours: 2,
  avgBountyMinutes: 12,
  tierDistribution: {
    tier1: 0.1,
    tier2: 0.7,
    tier3: 0.2
  },
  aliveCompletionRate: 0.8
});

console.log('\n📋 2-Hour Bounty Session (mostly tier 2):');
console.log(`   Total Cash: $${bountySession.total_cash}`);
console.log(`   Total Gold: ${bountySession.total_gold} bars`);
console.log(`   Bounties Completed: ${bountySession.bounties_completed}`);
console.log(`   Avg Cash/Hour: $${bountySession.avg_cash_per_hour}`);
console.log(`   Avg Gold/Hour: ${bountySession.avg_gold_per_hour} bars/hr`);

// ═══════════════════════════════════════════════════════════════════════════
// TRADER EXAMPLES
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n\n🛒 TRADER EXAMPLES\n');

// Example 1: Full wagon delivery, optimal time
const deliveryFull = calculateTraderDelivery({
  goodsCount: 100,
  wagonSize: 'large',
  deliveryTimeMinutes: 20,
  deliveryDistance: 'medium'
});

console.log('📦 Full Large Wagon (100 goods), 20 min delivery:');
console.log(`   Base Cash: $${deliveryFull.base_cash}`);
console.log(`   Time Bonus: $${deliveryFull.time_bonus}`);
console.log(`   Distance Bonus: $${deliveryFull.distance_bonus}`);
console.log(`   Total: $${deliveryFull.total_cash}`);
console.log(`   Per Minute: $${deliveryFull.cash_per_minute}`);

// Example 2: Long distance bonus
const deliveryLong = calculateTraderDelivery({
  goodsCount: 100,
  wagonSize: 'large',
  deliveryTimeMinutes: 25,
  deliveryDistance: 'long',
  isLongDistance: true
});

console.log('\n📦 Full Wagon, Long Distance (far buyer):');
console.log(`   Total: $${deliveryLong.total_cash} (includes +$${deliveryLong.distance_bonus} distance bonus)`);

// Example 3: Full session
const traderSession = simulateTraderSession({
  sessionHours: 2,
  wagonSize: 'large',
  runsPerHour: 1,
  avgDeliveryMinutes: 20,
  avgDeliveryDistance: 'medium',
  wagonFillFactor: 0.85
});

console.log('\n📦 2-Hour Trader Session (hunt + deliver):');
console.log(`   Total Cash: $${traderSession.total_cash}`);
console.log(`   Goods Delivered: ${traderSession.total_goods_delivered}`);
console.log(`   Delivery Runs: ${traderSession.delivery_runs}`);
console.log(`   Avg Cash/Hour: $${traderSession.avg_cash_per_hour}`);
console.log(`   Materials to Hunt: ~${traderSession.materials_needed_to_hunt}`);
console.log(`   Est. Hunting Time: ${traderSession.estimated_hunting_time_hours} hours`);

// ═══════════════════════════════════════════════════════════════════════════
// COMPARISON: Which is Better?
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n\n💡 ACTIVITY COMPARISON\n');

console.log('Bounty Hunter (2-hour session):');
console.log(`  $${bountySession.total_cash} in 2 hours`);
console.log(`  = $${bountySession.avg_cash_per_hour}/hr`);

console.log('\nTrader (2-hour session):');
console.log(`  $${traderSession.total_cash} in 2 hours`);
console.log(`  = $${traderSession.avg_cash_per_hour}/hr`);

const bountyWins = bountySession.avg_cash_per_hour > traderSession.avg_cash_per_hour;
console.log(`\n${bountyWins ? '🏆 Bounty Hunter' : '🏆 Trader'} is more profitable in this scenario`);

// ═══════════════════════════════════════════════════════════════════════════
// KEY TAKEAWAY
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n\n📌 HOW TO USE IN YOUR APP:\n');
console.log(`
// In React component:
import { calculateBountyPayout } from './simulator/bountyHunter';

function BountyCalculator() {
  const [minutes, setMinutes] = useState(12);
  const result = calculateBountyPayout({
    tier: 2,
    alive: true,
    targetCount: 1,
    minutesElapsed: minutes
  });
  
  return <div>\$${result.cash} | {result.gold} gold | \$${result.cash_per_hour}/hr</div>;
}

// In Redux reducer:
completeBounty: (state, action) => {
  const payout = calculateBountyPayout(action.payload);
  state.cash += payout.cash;
  state.gold_bars += payout.gold;
}

// On CLI/Node:
const payout = calculateBountyPayout({ tier: 2, alive: true, targetCount: 1, minutesElapsed: 12 });
console.log(\`You earned \$\${payout.cash}\`);
`);
