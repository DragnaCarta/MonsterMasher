import { calculateModifier, calculateHP, calculateCR, getHitDieSize, calculateDCR, calculateOCR, getXPFromCR } from './calculations';

export const generateStatblockText = (statblock) => {
  const { name, size, abilityScores, armorClass, hitDice, actions } = statblock;
  const hitDieSize = getHitDieSize(size);
  const hp = calculateHP(size, hitDice, calculateModifier(abilityScores.CON));
  const dcr = calculateDCR(hp, armorClass.value);
  
  // TODO: Implement proper DPR and attack bonus calculations
  const dpr = 10; // Placeholder
  const attackBonus = 3 + calculateModifier(abilityScores.STR); // Placeholder
  
  const ocr = calculateOCR(dpr, attackBonus);
  const cr = calculateCR(hp, armorClass.value, dpr, attackBonus);
  const xp = getXPFromCR(cr);
  
  return `
${name}
${size} creature
Armor Class ${armorClass.value} (${armorClass.type})
Hit Points ${hp} (${hitDice}d${hitDieSize} + ${calculateModifier(abilityScores.CON) * hitDice})
Speed 30 ft.

STR ${abilityScores.STR} (${calculateModifier(abilityScores.STR) >= 0 ? '+' : ''}${calculateModifier(abilityScores.STR)})
DEX ${abilityScores.DEX} (${calculateModifier(abilityScores.DEX) >= 0 ? '+' : ''}${calculateModifier(abilityScores.DEX)})
CON ${abilityScores.CON} (${calculateModifier(abilityScores.CON) >= 0 ? '+' : ''}${calculateModifier(abilityScores.CON)})
INT ${abilityScores.INT} (${calculateModifier(abilityScores.INT) >= 0 ? '+' : ''}${calculateModifier(abilityScores.INT)})
WIS ${abilityScores.WIS} (${calculateModifier(abilityScores.WIS) >= 0 ? '+' : ''}${calculateModifier(abilityScores.WIS)})
CHA ${abilityScores.CHA} (${calculateModifier(abilityScores.CHA) >= 0 ? '+' : ''}${calculateModifier(abilityScores.CHA)})

Actions:
${actions.map(action => `${action.name}. ${action.description}`).join('\n')}

Challenge ${cr} (${xp} XP)
Defensive CR: ${dcr}
Offensive CR: ${ocr}
  `.trim();
};

export const downloadTextFile = (filename, text) => {
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};