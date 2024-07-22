import React from 'react';
import { calculateModifier } from '../utils/calculations';

const AbilityScoresSection = ({ abilityScores, setAbilityScores }) => {
  const adjustAbilityScore = (ability, amount) => {
    setAbilityScores(prev => ({
      ...prev,
      [ability]: Math.max(1, Math.min(30, prev[ability] + amount))
    }));
  };

  return (
    <div className="mb-4">
      <label className="block mb-2 font-bold">Ability Scores</label>
      <div className="grid grid-cols-1 gap-4">
        {Object.entries(abilityScores).map(([ability, score]) => (
          <div key={ability} className="flex items-center space-x-2">
            <label className="w-12 font-semibold">{ability}</label>
            <button onClick={() => adjustAbilityScore(ability, -4)} className="px-2 py-1 bg-red-500 text-white rounded text-sm">-4</button>
            <button onClick={() => adjustAbilityScore(ability, -2)} className="px-2 py-1 bg-red-500 text-white rounded text-sm">-2</button>
            <button onClick={() => adjustAbilityScore(ability, -1)} className="px-2 py-1 bg-red-500 text-white rounded text-sm">-1</button>
            <input
              type="number"
              value={score}
              onChange={(e) => adjustAbilityScore(ability, parseInt(e.target.value) - score)}
              className="w-16 p-2 border rounded text-center"
              min="1"
              max="30"
            />
            <button onClick={() => adjustAbilityScore(ability, 1)} className="px-2 py-1 bg-blue-500 text-white rounded text-sm">+1</button>
            <button onClick={() => adjustAbilityScore(ability, 2)} className="px-2 py-1 bg-blue-500 text-white rounded text-sm">+2</button>
            <button onClick={() => adjustAbilityScore(ability, 4)} className="px-2 py-1 bg-blue-500 text-white rounded text-sm">+4</button>
            <span className="ml-2 text-sm">
              ({calculateModifier(score) >= 0 ? '+' : ''}
              {calculateModifier(score)})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AbilityScoresSection;