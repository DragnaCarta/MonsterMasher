import React from 'react';
import { sizeDice } from '../../constants/sizeDice';
import { calculateModifier, calculateHP } from '../../utils/calculations';

const HitPointsSection = ({ hitDice, setHitDice, size, constitutionScore }) => {
  const adjustHitDice = (amount) => {
    setHitDice(Math.max(1, hitDice + amount));
  };

  const hitDieSize = sizeDice[size] || 8;
  const conModifier = calculateModifier(constitutionScore);
  const hp = calculateHP(size, hitDice, conModifier);

  return (
    <div className="mb-4">
      <label className="block mb-2 font-bold">Hit Points</label>
      <div className="flex items-center space-x-2 mb-2">
        <button onClick={() => adjustHitDice(-10)} className="px-2 py-1 bg-red-500 text-white rounded">-10</button>
        <button onClick={() => adjustHitDice(-5)} className="px-2 py-1 bg-red-500 text-white rounded">-5</button>
        <button onClick={() => adjustHitDice(-1)} className="px-2 py-1 bg-red-500 text-white rounded">-1</button>
        <input
          type="number"
          value={hitDice}
          onChange={(e) => setHitDice(Math.max(1, parseInt(e.target.value)))}
          className="w-20 p-2 border rounded text-center"
        />
        <button onClick={() => adjustHitDice(1)} className="px-2 py-1 bg-blue-500 text-white rounded">+1</button>
        <button onClick={() => adjustHitDice(5)} className="px-2 py-1 bg-blue-500 text-white rounded">+5</button>
        <button onClick={() => adjustHitDice(10)} className="px-2 py-1 bg-blue-500 text-white rounded">+10</button>
      </div>
      <div>
        <span className="font-semibold">Total HP:</span> {hp} ({hitDice}d{hitDieSize} + {conModifier * hitDice})
      </div>
    </div>
  );
};

export default HitPointsSection;