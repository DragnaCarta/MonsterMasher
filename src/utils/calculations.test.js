import {
  calculateDCR,
  calculateOCR,
  calculateTargetsInArea,
} from './calculations';

test('calculates the number of targets in an area correctly', () => {
  // Test case 1: Cone with size 20
  expect(calculateTargetsInArea('cone', 20)).toBe(2);

  // Test case 2: Cube with size 15
  expect(calculateTargetsInArea('cube', 15)).toBe(3);

  // Test case 3: Cylinder with size 30
  expect(calculateTargetsInArea('cylinder', 30)).toBe(6);

  // Test case 4: Sphere with size 25
  expect(calculateTargetsInArea('sphere', 25)).toBe(5);

  // Test case 5: Line with size 60
  expect(calculateTargetsInArea('line', 60)).toBe(2);

  // Test case 6: Invalid area type
  expect(calculateTargetsInArea('invalid', 10)).toBe(1);
});

test('calculates OCR correctly for attack action', () => {
  const actions = [
    {
      attack: {
        abilityScore: 'str',
        damageDice: '2d6',
        addAbilityToDamage: true,
        targets: 1,
      },
    },
    {
      attack: {
        abilityScore: 'dex',
        damageDice: '1d8',
        addAbilityToDamage: false,
        targets: 2,
      },
    },
  ];
  const abilityScores = {
    str: 18,
    dex: 16,
  };
  const proficiencyBonus = 3;

  expect(calculateOCR({ actions }, abilityScores, proficiencyBonus)).toBe(2);
});

test('calculates OCR correctly for saving throw action', () => {
  const actions = [
    {
      savingThrow: {
        type: 'aoe',
        aoeType: 'cone',
        aoeSize: 20,
        damageDice: '3d6',
      },
    },
    {
      savingThrow: {
        type: 'targeted',
        abilityScore: 'wis',
        damageDice: '1d10',
      },
    },
  ];
  const abilityScores = {
    wis: 14,
  };
  const proficiencyBonus = 4;

  expect(calculateOCR({ actions }, abilityScores, proficiencyBonus)).toBe(3);
});

test('returns 0 OCR when no actions are provided', () => {
  const actions = [];
  const abilityScores = {
    str: 16,
    dex: 14,
  };
  const proficiencyBonus = 3;

  expect(calculateOCR({ actions }, abilityScores, proficiencyBonus)).toBe(0);
});

test('calculates DCR correctly when hp and ac are within expected range', () => {
  const hp = 100;
  const ac = 15;
  expect(calculateDCR(hp, ac)).toBe(2);
});

test('calculates DCR correctly when hp is higher than expected range', () => {
  const hp = 200;
  const ac = 15;
  expect(calculateDCR(hp, ac)).toBe(3);
});

test('calculates DCR correctly when ac is higher than expected range', () => {
  const hp = 100;
  const ac = 20;
  expect(calculateDCR(hp, ac)).toBe(3);
});

test('calculates DCR correctly when hp and ac are both higher than expected range', () => {
  const hp = 200;
  const ac = 20;
  expect(calculateDCR(hp, ac)).toBe(4);
});

test('calculates DCR correctly when hp and ac are both lower than expected range', () => {
  const hp = 50;
  const ac = 10;
  expect(calculateDCR(hp, ac)).toBe(1);
});
