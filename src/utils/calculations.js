import { sizeDice } from '../constants/sizeDice';
import { crTableData, findCRByHP, findCRByDPR, adjustCR } from '../constants/crTableData';

export const calculateModifier = (score) => Math.floor((score - 10) / 2);

export const calculateHP = (size, hitDice, conMod) => {
  const hitDieSize = sizeDice[size] || 8;
  return hitDice * (Math.ceil(hitDieSize / 2) + conMod);
};

export const getHitDieSize = (size) => sizeDice[size] || 8;

export const calculateDCR = (hp, ac) => {
  const baseCR = findCRByHP(hp).cr;
  const expectedAC = crTableData.find(row => row.cr === baseCR).ac;
  const acDifference = Math.floor((ac - expectedAC) / 2);
  return adjustCR(baseCR, acDifference);
};

export const calculateOCR = (dpr, attackBonus) => {
  const baseCR = findCRByDPR(dpr).cr;
  const expectedAttackBonus = crTableData.find(row => row.cr === baseCR).attackBonus;
  const attackBonusDifference = Math.floor((attackBonus - expectedAttackBonus) / 2);
  return adjustCR(baseCR, attackBonusDifference);
};

export const calculateCR = (hp, ac, dpr, attackBonus) => {
  const dcr = calculateDCR(hp, ac);
  const ocr = calculateOCR(dpr, attackBonus);
  const averageCR = (dcr + ocr) / 2;
  return crTableData.reduce((prev, curr) => 
    Math.abs(curr.cr - averageCR) < Math.abs(prev.cr - averageCR) ? curr : prev
  ).cr;
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