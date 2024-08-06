export const armorTypes = {
  // Light Armor
  'Padded': { base: 11, useDex: true, stealthDisadvantage: true },
  'Leather': { base: 11, useDex: true },
  'Studded Leather': { base: 12, useDex: true },

  // Medium Armor
  'Hide': { base: 12, useDex: true, maxDex: 2 },
  'Chain Shirt': { base: 13, useDex: true, maxDex: 2 },
  'Scale Mail': { base: 14, useDex: true, maxDex: 2, stealthDisadvantage: true },
  'Breastplate': { base: 14, useDex: true, maxDex: 2 },
  'Half Plate': { base: 15, useDex: true, maxDex: 2, stealthDisadvantage: true },

  // Heavy Armor
  'Ring Mail': { base: 14, useDex: false, stealthDisadvantage: true },
  'Chain Mail': { base: 16, useDex: false, stealthDisadvantage: true, strengthRequired: 13 },
  'Splint': { base: 17, useDex: false, stealthDisadvantage: true, strengthRequired: 15 },
  'Plate': { base: 18, useDex: false, stealthDisadvantage: true, strengthRequired: 15 },

  // Spell Effects
  'Mage Armor': { base: 13, useDex: true, isSpell: true },
  'Barkskin': { base: 16, useDex: false, isSpell: true },

  // Other
  'Natural Armor': { isNatural: true, useDex: false },
  'Unarmored': { base: 10, useDex: true },
};