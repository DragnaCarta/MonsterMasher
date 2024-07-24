import { sizeDice } from '../constants/sizeDice';
import { crTableData, findCRByHP, findCRByDPR, adjustCR } from '../constants/crTableData';

export const calculateModifier = (score) => Math.floor((score - 10) / 2);

export const calculateHP = (size, hitDice, conMod) => {
  const hitDieSize = sizeDice[size] || 8;
  const averageRoll = (hitDieSize + 1) / 2; // This gives the correct average (e.g., 4.5 for d8)
  const totalHP = hitDice * (averageRoll + conMod);
  return Math.floor(totalHP); // Only round down after calculating the total HP
};

export const getHitDieSize = (size) => sizeDice[size] || 8;

export const calculateAverageDamage = (damageDice, damageBonus) => {
  const [diceCount, dieType] = damageDice.split('d');
  const averageDieRoll = (parseInt(dieType) + 1) / 2;
  return Math.floor(diceCount * averageDieRoll) + damageBonus;
};

export const findHighestDamageAttack = (actions, abilityScores, proficiencyBonus) => {
  return actions.reduce((highestDamage, action) => {
    if (action.attack) {
      const abilityMod = calculateModifier(abilityScores[action.attack.abilityScore]);
      const damageBonus = action.attack.addAbilityToDamage ? abilityMod : 0;
      const averageDamage = calculateAverageDamage(action.attack.damageDice, damageBonus);
      const toHit = abilityMod + proficiencyBonus;
      if (averageDamage > highestDamage.damage) {
        return { damage: averageDamage, attack: action.attack, toHit };
      }
    }
    return highestDamage;
  }, { damage: 0, attack: null, toHit: 0 });
};

export const calculateDCR = (hp, ac) => {
  const baseCR = findCRByHP(hp).cr;
  const expectedAC = crTableData.find(row => row.cr === baseCR).ac;
  const acDifference = Math.floor((ac - expectedAC) / 2);
  return adjustCR(baseCR, acDifference);
};

export const calculateOCR = (actions, abilityScores, proficiencyBonus) => {
  const { damage, toHit } = findHighestDamageAttack(actions, abilityScores, proficiencyBonus);
  if (damage === 0) return 0;

  const baseCR = findCRByDPR(damage).cr;
  const expectedAttackBonus = crTableData.find(row => row.cr === baseCR).attackBonus;
  
  const attackBonusDifference = Math.floor((toHit - expectedAttackBonus) / 2);
  
  return adjustCR(baseCR, attackBonusDifference);
};

export const calculateCR = (hp, ac, actions, abilityScores) => {
  const dcr = calculateDCR(hp, ac);
  const proficiencyBonus = getProficiencyBonus(dcr);
  const ocr = calculateOCR(actions, abilityScores, proficiencyBonus);
  const averageCR = (dcr + ocr) / 2;

  // If averageCR is less than 1, round up to the nearest valid CR
  if (averageCR < 1) {
    const validLowCRs = [0, 0.125, 0.25, 0.5, 1];
    return {
      cr: validLowCRs.find(cr => cr >= averageCR) || 1,
      ocr: ocr,
      dcr: dcr
    };
  }

  // For CR 1 and above, find the nearest CR as before
  const finalCR = crTableData.reduce((prev, curr) => 
    Math.abs(curr.cr - averageCR) < Math.abs(prev.cr - averageCR) ? curr : prev
  ).cr;

  return {
    cr: finalCR,
    ocr: ocr,
    dcr: dcr
  };
};

export const formatCR = (cr, ocr, dcr) => {
  const formatFraction = (num) => {
    if (num === 0.125) return "1/8";
    if (num === 0.25) return "1/4";
    if (num === 0.5) return "1/2";
    return num.toString();
  };

  return `${formatFraction(cr)} (OCR ${formatFraction(ocr)}, DCR ${formatFraction(dcr)})`;
};

export const getXPFromCR = (cr) => {
  return crTableData.find(row => row.cr === cr)?.xp || 0;
};

export const getProficiencyBonus = (cr) => {
  if (cr < 5) return 2;
  if (cr < 9) return 3;
  if (cr < 13) return 4;
  if (cr < 17) return 5;
  if (cr < 21) return 6;
  if (cr < 25) return 7;
  if (cr < 29) return 8;
  return 9;
};