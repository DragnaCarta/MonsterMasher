import React from 'react';
import { calculateModifier } from '../utils/calculations';

const AbilityScoresSection = ({ abilityScores, setAbilityScores }) => {
  const handleScoreChange = (ability, value) => {
    setAbilityScores(prev => ({
      ...prev,
      [ability]: Math.max(1, Math.min(30, value))
    }));
  };

  return (
    <div className="grid grid-cols-6 gap-2">
      {Object.entries(abilityScores).map(([ability, score]) => (
        <div key={ability} className="flex flex-col items-center">
          <span className="font-bold">{ability}</span>
          <div className="flex items-center">
            <input
              type="number"
              value={score}
              onChange={(e) => handleScoreChange(ability, parseInt(e.target.value))}
              className="input w-16 text-center"
              min="1"
              max="30"
            />
            <span className="ml-1 text-sm">
              ({calculateModifier(score) >= 0 ? '+' : ''}
              {calculateModifier(score)})
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AbilityScoresSection;