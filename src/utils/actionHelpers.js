export const damageTypes = [
  'acid', 'bludgeoning', 'cold', 'fire', 'force', 'lightning', 'necrotic', 
  'piercing', 'poison', 'psychic', 'radiant', 'slashing', 'thunder'
];

export const diceTypes = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'];

export const validateAction = (action) => {
  const errors = [];

  if (!action.name.trim()) {
    errors.push("Action name is required.");
  }

  if (action.attack) {
    if (!action.attack.type) {
      errors.push("Attack type is required.");
    }
    if (action.attack.range === '') {
      errors.push("Attack range is required.");
    }
    if (!action.attack.targets || action.attack.targets < 1) {
      errors.push("Number of targets must be at least 1.");
    }
    if (!action.attack.abilityScore) {
      errors.push("Ability score for attack is required.");
    }
    if (!action.attack.damageDice) {
      errors.push("Damage dice are required.");
    }
    if (!action.attack.damageType) {
      errors.push("Damage type is required.");
    }
  }

  return errors;
};

export const calculateAttackBonus = (abilityScore, proficiencyBonus) => {
  return calculateModifier(abilityScore) + proficiencyBonus;
};

export const calculateAverageDamage = (damageDice, damageBonus) => {
  const [numDice, dieType] = damageDice.split('d');
  const averageDieRoll = (parseInt(dieType) + 1) / 2;
  return Math.floor(numDice * averageDieRoll) + damageBonus;
};

export const formatAttackDescription = (attack) => {
  const { name, type, range, targets, abilityScore, damageDice, damageType, addAbilityToDamage } = attack;
  const damageBonus = addAbilityToDamage ? calculateModifier(abilityScore) : 0;
  const averageDamage = calculateAverageDamage(damageDice, damageBonus);

  return `**${name}.** *${type.charAt(0).toUpperCase() + type.slice(1)} Weapon Attack:* +{attackBonus} to hit, ` +
         `range ${range}, ${targets} target${targets > 1 ? 's' : ''}. ` +
         `*Hit:* ${averageDamage} (${damageDice}${damageBonus !== 0 ? (damageBonus > 0 ? ' + ' : ' - ') + Math.abs(damageBonus) : ''}) ${damageType} damage.`;
};

// Helper function to calculate ability score modifier
const calculateModifier = (score) => Math.floor((score - 10) / 2);