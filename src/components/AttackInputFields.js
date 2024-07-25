import React from 'react';
import { damageTypes, diceTypes } from '../utils/actionHelpers';
import {
  calculateModifier,
  calculateAverageDamage,
} from '../utils/calculations';

const AttackInputFields = ({
  attack,
  handleAttackChange,
  abilityScores,
  proficiencyBonus,
}) => {
  const calculateToHitBonus = () => {
    const abilityMod = calculateModifier(
      abilityScores[attack.abilityScore] || 10
    );
    return abilityMod + proficiencyBonus;
  };

  const calculateDamageBonus = () => {
    return attack.addAbilityToDamage
      ? calculateModifier(abilityScores[attack.abilityScore] || 10)
      : 0;
  };

  const [diceCount, diceType] = (attack.damageDice || '1d6').split('d');

  // Ensure diceCount and diceType are valid
  const validDiceCount = parseInt(diceCount) || 1;
  const validDiceType = diceTypes.includes(`d${diceType}`) ? diceType : '6';

  const toggleAbilityModifier = () => {
    handleAttackChange({
      target: {
        name: 'addAbilityToDamage',
        value: !attack.addAbilityToDamage,
      },
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <select
          name="type"
          value={attack.type || 'melee'}
          onChange={handleAttackChange}
          className="select"
        >
          <option value="melee">Melee</option>
          <option value="ranged">Ranged</option>
        </select>
        <select
          name="attackType"
          value={attack.attackType || 'weapon'}
          onChange={handleAttackChange}
          className="select"
        >
          <option value="weapon">Weapon</option>
          <option value="spell">Spell</option>
        </select>
        <span>Attack: +{calculateToHitBonus()}</span>
        <select
          name="abilityScore"
          value={attack.abilityScore || 'STR'}
          onChange={handleAttackChange}
          className="select"
        >
          {Object.keys(abilityScores).map((ability) => (
            <option key={ability} value={ability}>
              {ability}
            </option>
          ))}
        </select>
        <span>to hit, range</span>
        <input
          type="number"
          name="range"
          defaultValue={5}
          value={attack.range || 5}
          onChange={handleAttackChange}
          className="input w-16 text-center tabular-nums"
          min="0"
        />
        <span>ft.,</span>
        <input
          type="number"
          name="targets"
          value={attack.targets || 1}
          onChange={handleAttackChange}
          className="input w-16 text-center tabular-nums lining-nums"
          min="1"
        />
        <span>{attack.targets > 1 ? 'targets' : 'target'}.</span>
      </div>
      <div className="flex items-center space-x-2">
        <span>
          Hit:{' '}
          {calculateAverageDamage(
            `${validDiceCount}d${validDiceType}`,
            calculateDamageBonus()
          )}
        </span>
        <span>(</span>
        <input
          type="number"
          name="diceCount"
          value={validDiceCount}
          onChange={(e) =>
            handleAttackChange({
              target: {
                name: 'damageDice',
                value: `${e.target.value}d${validDiceType}`,
              },
            })
          }
          className="input w-16 text-center"
          min="1"
        />
        <select
          value={validDiceType}
          onChange={(e) =>
            handleAttackChange({
              target: {
                name: 'damageDice',
                value: `${validDiceCount}d${e.target.value}`,
              },
            })
          }
          className="select"
        >
          {diceTypes.map((type) => (
            <option key={type} value={type.slice(1)}>
              {type}
            </option>
          ))}
        </select>
        <span
          className={`
            cursor-pointer 
            transition-colors duration-200 ease-in-out
            hover:bg-gray-100 rounded px-1
            ${
              attack.addAbilityToDamage
                ? 'hover:text-blue-600'
                : 'line-through text-gray-400 hover:text-gray-600'
            }
          `}
          onClick={toggleAbilityModifier}
        >
          + {calculateDamageBonus()}
        </span>
        <span>)</span>
        <select
          name="damageType"
          value={attack.damageType || ''}
          onChange={handleAttackChange}
          className="select"
        >
          <option value="">Select damage type</option>
          {damageTypes.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
        <span>damage</span>
      </div>
    </div>
  );
};

export default AttackInputFields;
