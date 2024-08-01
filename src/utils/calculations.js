import { sizeDice } from '../constants/sizeDice';
import {
  crTableData,
  findCRByHP,
  findCRByDPR,
  adjustCR,
} from '../constants/crTableData';

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

export const calculateSaveDC = (
  savingThrow,
  proficiencyBonus,
  abilityScores
) => {
  const safeSavingThrow = savingThrow || {};

  const abilityScore = safeSavingThrow.monsterAbilityScore || 'DEX';
  const abilityModifier = Math.floor(
    ((abilityScores[abilityScore] || 10) - 10) / 2
  );
  return 8 + proficiencyBonus + abilityModifier;
};

export const calculateSavingThrowDPR = (savingThrow, abilityScores) => {
  if (!savingThrow) return 0;

  const averageDamage = calculateAverageDamage(savingThrow.damageDice, 0);
  let numTargets = 1;

  if (savingThrow.type === 'aoe') {
    numTargets = calculateTargetsInArea(
      savingThrow.aoeType,
      savingThrow.aoeSize
    );
  } else if (savingThrow.type === 'targeted') {
    numTargets = savingThrow.targets || 1;
  }

  // Assume all targets fail their saving throw
  return averageDamage * numTargets;
};

export const findHighestDamageAction = (
  actions,
  abilityScores,
  proficiencyBonus
) => {
  const DEFAULT_ACTION = { damage: 0, action: null, toHit: 0 };
  const damagingActions = actions.filter(
    (action) => action.attack || action.savingThrow
  );

  console.log('DamagingActions: ', damagingActions);

  if (!damagingActions.length) {
    return DEFAULT_ACTION;
  }

  return damagingActions.reduce((highestDamage, action) => {
    let actionDPR = 0;
    let toHit = 0;

    if (action.attack) {
      const abilityMod = calculateModifier(
        abilityScores[action.attack.abilityScore]
      );
      const damageBonus = action.attack.addAbilityToDamage ? abilityMod : 0;
      const averageDamage = calculateAverageDamage(
        action.attack.damageDice,
        damageBonus
      );
      toHit = abilityMod + proficiencyBonus;

      // Assume all attacks hit
      actionDPR = averageDamage * (action.attack.targets || 1);
    } else if (action.savingThrow) {
      actionDPR = calculateSavingThrowDPR(action.savingThrow, abilityScores);
    }

    if (actionDPR > highestDamage.damage) {
      return { damage: actionDPR, action, toHit };
    }

    return highestDamage;
  }, DEFAULT_ACTION);
};

export const calculateDCR = (hp, ac) => {
  const baseCR = findCRByHP(hp).cr;
  const expectedAC = crTableData.find((row) => row.cr === baseCR).ac;
  const acDifference = Math.floor((ac - expectedAC) / 2);
  return adjustCR(baseCR, acDifference);
};

const findDifference = (
  action,
  toHit,
  abilityScores,
  proficiencyBonus,
  baseCR
) => {
  if (!action) return 0;

  if (action.attack) {
    const expectedModifier = crTableData.find(
      (row) => row.cr === baseCR
    ).attackBonus;
    return Math.floor((toHit - expectedModifier) / 2);
  } else if (action.savingThrow) {
    const saveDC =
      8 +
      proficiencyBonus +
      calculateModifier(abilityScores[action.savingThrow.abilityScore]);
    const expectedModifier = crTableData.find((row) => row.cr === baseCR).dc;
    return Math.floor((saveDC - expectedModifier) / 2);
  }
};

function weightedAverage(numbers, weights) {
  if (numbers.length !== weights.length) {
    throw new Error(
      'The length of numbers and weights arrays must be the same.'
    );
  }

  let totalWeightedSum = 0;
  let totalWeight = 0;

  for (let i = 0; i < numbers.length; i++) {
    totalWeightedSum += numbers[i] * weights[i];
    totalWeight += weights[i];
  }

  return totalWeightedSum / totalWeight;
}

export const calculateOCR = (
  { actions = [], bonusActions = [], reactions = [] },
  abilityScores,
  proficiencyBonus
) => {
  const {
    damage: actionDamage,
    toHit: actionToHit,
    action,
  } = findHighestDamageAction(actions, abilityScores, proficiencyBonus);
  const {
    damage: bonusActionDamage,
    toHit: bonusActionToHit,
    action: bonusAction,
  } = findHighestDamageAction(bonusActions, abilityScores, proficiencyBonus);
  const {
    damage: reactionDamage,
    toHit: reactToHit,
    action: reaction,
  } = findHighestDamageAction(reactions, abilityScores, proficiencyBonus);

  if ([actionDamage, bonusActionDamage, reactionDamage].every((d) => d === 0)) {
    return 0;
  }

  console.log('ActionDamage: ', actionDamage);
  console.log('BonusActionDamage: ', bonusActionDamage);
  console.log('ReactionDamage: ', reactionDamage);

  const damage = actionDamage + bonusActionDamage + reactionDamage;
  console.log('DAMAGE: ', damage);
  const baseCR = findCRByDPR(damage).cr;

  const weightedAvg = weightedAverage(
    [
      findDifference(
        action,
        actionToHit,
        abilityScores,
        proficiencyBonus,
        baseCR
      ),
      findDifference(
        bonusAction,
        bonusActionToHit,
        abilityScores,
        proficiencyBonus,
        baseCR
      ),
      findDifference(
        reaction,
        reactToHit,
        abilityScores,
        proficiencyBonus,
        baseCR
      ),
    ],
    [actionDamage, bonusActionDamage, reactionDamage]
  );

  console.log('WeightedAverage: ', weightedAvg);

  const highestDiff = Math.round(weightedAvg);

  console.log(
    findDifference(
      action,
      actionToHit,
      abilityScores,
      proficiencyBonus,
      baseCR
    ),
    findDifference(
      bonusAction,
      bonusActionToHit,
      abilityScores,
      proficiencyBonus,
      baseCR
    ),
    findDifference(
      reaction,
      reactToHit,
      abilityScores,
      proficiencyBonus,
      baseCR
    )
  );

  console.log('HighestDifference: ', highestDiff);
  console.log('BaseCR: ', baseCR);
  console.log('AdjustedOCR: ', adjustCR(baseCR, highestDiff));

  return adjustCR(baseCR, highestDiff);
};

export const calculateCR = (
  hp,
  ac,
  actions,
  bonusActions,
  reactions,
  abilityScores
) => {
  const dcr = calculateDCR(hp, ac);
  const proficiencyBonus = getProficiencyBonus(dcr);
  const ocr = calculateOCR(
    { actions, bonusActions, reactions },
    abilityScores,
    proficiencyBonus
  );
  const averageCR = (dcr + ocr) / 2;

  if (averageCR < 1) {
    const validLowCRs = [0, 0.125, 0.25, 0.5, 1];
    return {
      cr: validLowCRs.find((cr) => cr >= averageCR) || 1,
      ocr: ocr,
      dcr: dcr,
    };
  }

  const finalCR = crTableData.reduce((prev, curr) =>
    Math.abs(curr.cr - averageCR) < Math.abs(prev.cr - averageCR) ? curr : prev
  ).cr;

  return {
    cr: finalCR,
    ocr: ocr,
    dcr: dcr,
  };
};

export const formatCR = (cr, ocr, dcr) => {
  const formatFraction = (num) => {
    if (num === 0.125) return '1/8';
    if (num === 0.25) return '1/4';
    if (num === 0.5) return '1/2';
    return num.toString();
  };

  return `${formatFraction(cr)} (OCR ${formatFraction(
    ocr
  )}, DCR ${formatFraction(dcr)})`;
};

export const getXPFromCR = (cr) => {
  return crTableData.find((row) => row.cr === cr)?.xp || 0;
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
