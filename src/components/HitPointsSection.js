import React from 'react';
import { sizeDice } from '../constants/sizeDice';
import { calculateModifier, calculateHP } from '../utils/calculations';

const HitPointsSection = ({ hitDice, setHitDice, size, constitutionScore }) => {
  const hitDieSize = sizeDice[size] || 8;
  const conModifier = calculateModifier(constitutionScore);
  const hp = calculateHP(size, hitDice, conModifier);

  return (
    <div className="flex items-center space-x-2">
      <span className="font-bold">Hit Points</span>
      <span>{hp}</span>
      <span>(</span>
      <input
        type="number"
        value={hitDice}
        onChange={(e) => setHitDice(Math.max(1, parseInt(e.target.value)))}
        className="input w-16 text-center"
        min="1"
      />
      <span>d{hitDieSize} + {conModifier * hitDice})</span>
    </div>
  );
};

export default HitPointsSection;