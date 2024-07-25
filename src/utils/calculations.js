import { sizeDice } from '../constants/sizeDice';
import { crTableData, findCRByHP, findCRByDPR, adjustCR } from '../constants/crTableData';

export const calculateModifier = (score) => Math.floor((score - 10) / 2);

export const calculateHP = (size, hitDice, conMod) => {
  const hitDieSize = sizeDice[size] || 8;
  const averageRoll = (hitDieSize + 1) / 2;
  const totalHP = hitDice * (averageRoll + conMod);
  return Math.floor(totalHP);
};

export const getHitDieSize = (size) => sizeDice[size] || 8;

export const calculateAverageDamage = (damageDice, damageBonus) => {
  const [diceCount, dieType] = damageDice.split('d');
  const averageDieRoll = (parseInt(dieType) + 1) / 2;
  return Math.floor(diceCount * averageDieRoll) + damageBonus;
};

export const calculateTargetsInArea = (aoeType, aoeSize) => {
  switch (aoeType) {
    case 'cone':
      return Math.ceil(aoeSize / 10);
    case 'cube':
    case 'cylinder':
    case 'sphere':
      return Math.ceil(aoeSize / 5);
    case 'line':
      return Math.ceil(aoeSize / 30);
    default:
      return 1;
  }
};

export const calculateSavingThrowDPR = (savingThrow, abilityScores) => {
  if (!savingThrow) return 0;

  const averageDamage = calculateAverageDamage(savingThrow.damageDice, 0);
  let numTargets = 1;

  if (savingThrow.type === 'aoe') {
    numTargets = calculateTargetsInArea(savingThrow.aoeType, savingThrow.aoeSize);
  } else if (savingThrow.type === 'targeted') {
    numTargets = savingThrow.targets || 1;
  }

  // Assume all targets fail their saving throw
  return averageDamage * numTargets;
};

export const findHighestDamageAction = (actions, abilityScores, proficiencyBonus) => {
  return actions.reduce((highestDamage, action) => {
    let actionDPR = 0;
    let toHit = 0;

    if (action.attack) {
      const abilityMod = calculateModifier(abilityScores[action.attack.abilityScore]);
      const damageBonus = action.attack.addAbilityToDamage ? abilityMod : 0;
      const averageDamage = calculateAverageDamage(action.attack.damageDice, damageBonus);
      toHit = abilityMod + proficiencyBonus;
      
      // Assume all attacks hit
      actionDPR = averageDamage * (action.attack.targets || 1);
    } else if (action.savingThrow) {
      actionDPR = calculateSavingThrowDPR(action.savingThrow, abilityScores);
    }

    if (actionDPR > highestDamage.damage) {
      return { damage: actionDPR, action: action, toHit };
    }
    return highestDamage;
  }, { damage: 0, action: null, toHit: 0 });
};

export const calculateDCR = (hp, ac) => {
  const baseCR = findCRByHP(hp).cr;
  const expectedAC = crTableData.find(row => row.cr === baseCR).ac;
  const acDifference = Math.floor((ac - expectedAC) / 2);
  return adjustCR(baseCR, acDifference);
};

export const calculateOCR = (actions, abilityScores, proficiencyBonus) => {
  const { damage, toHit, action } = findHighestDamageAction(actions, abilityScores, proficiencyBonus);
  if (damage === 0) return 0;

  const baseCR = findCRByDPR(damage).cr;
  
  let expectedAttackBonus;
  if (action.attack) {
    expectedAttackBonus = crTableData.find(row => row.cr === baseCR).attackBonus;
    const attackBonusDifference = Math.floor((toHit - expectedAttackBonus) / 2);
    return adjustCR(baseCR, attackBonusDifference);
  } else if (action.savingThrow) {
    const saveDC = 8 + proficiencyBonus + calculateModifier(abilityScores[action.savingThrow.abilityScore]);
    expectedAttackBonus = crTableData.find(row => row.cr === baseCR).dc;
    const dcDifference = Math.floor((saveDC - expectedAttackBonus) / 2);
    return adjustCR(baseCR, dcDifference);
  }

  return baseCR;
};

export const calculateCR = (hp, ac, actions, abilityScores) => {
  const dcr = calculateDCR(hp, ac);
  const proficiencyBonus = getProficiencyBonus(dcr);
  const ocr = calculateOCR(actions, abilityScores, proficiencyBonus);
  const averageCR = (dcr + ocr) / 2;

  if (averageCR < 1) {
    const validLowCRs = [0, 0.125, 0.25, 0.5, 1];
    return {
      cr: validLowCRs.find(cr => cr >= averageCR) || 1,
      ocr: ocr,
      dcr: dcr
    };
  }

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