import React from 'react';
import { damageTypes, diceTypes } from '../utils/actionHelpers';

const AttackInputFields = ({ attack, handleAttackChange, adjustDamageDice }) => {
  const safeAttack = attack || {};
  const [diceCount, diceType] = (safeAttack.damageDice || '1d6').split('d');

  const handleDiceTypeChange = (e) => {
    handleAttackChange({
      target: {
        name: 'damageDice',
        value: `${diceCount}d${e.target.value}`
      }
    });
  };

  const adjustRange = (amount) => {
    const currentRange = parseInt(safeAttack.range) || 5;
    handleAttackChange({
      target: {
        name: 'range',
        value: `${Math.max(5, currentRange + amount)} ft.`
      }
    });
  };

  const adjustTargets = (amount) => {
    const currentTargets = parseInt(safeAttack.targets) || 1;
    handleAttackChange({
      target: {
        name: 'targets',
        value: Math.max(1, currentTargets + amount)
      }
    });
  };

  return (
    <div className="mb-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
      <select
        name="type"
        value={safeAttack.type || 'melee'}
        onChange={handleAttackChange}
        className="w-full p-2 border rounded text-base"
      >
        <option value="melee">Melee</option>
        <option value="ranged">Ranged</option>
      </select>
      <div className="flex items-center space-x-2">
        <button onClick={() => adjustRange(-10)} className="px-2 py-2 bg-red-500 text-white rounded text-sm">-10 ft.</button>
        <button onClick={() => adjustRange(-5)} className="px-2 py-2 bg-red-500 text-white rounded text-sm">-5 ft.</button>
        <span className="flex-grow text-center">{safeAttack.range || '5 ft.'}</span>
        <button onClick={() => adjustRange(5)} className="px-2 py-2 bg-blue-500 text-white rounded text-sm">+5 ft.</button>
        <button onClick={() => adjustRange(10)} className="px-2 py-2 bg-blue-500 text-white rounded text-sm">+10 ft.</button>
      </div>
      <div className="flex items-center space-x-2">
        <button onClick={() => adjustTargets(-1)} className="px-3 py-2 bg-red-500 text-white rounded text-base">-1</button>
        <input
          type="number"
          name="targets"
          value={safeAttack.targets || '1'}
          onChange={handleAttackChange}
          className="w-16 p-2 border rounded text-base text-center"
          min="1"
        />
        <span className="flex-grow">targets</span>
        <button onClick={() => adjustTargets(1)} className="px-3 py-2 bg-blue-500 text-white rounded text-base">+1</button>
      </div>
      <select
        name="abilityScore"
        value={safeAttack.abilityScore || 'STR'}
        onChange={handleAttackChange}
        className="w-full p-2 border rounded text-base"
      >
        {['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map(ability => (
          <option key={ability} value={ability}>{ability}</option>
        ))}
      </select>
      <div className="flex flex-wrap items-center justify-center space-x-1 sm:col-span-2">
        <button onClick={() => adjustDamageDice(-5)} className="px-3 py-2 bg-red-500 text-white rounded text-base mb-1">-5</button>
        <button onClick={() => adjustDamageDice(-2)} className="px-3 py-2 bg-red-500 text-white rounded text-base mb-1">-2</button>
        <button onClick={() => adjustDamageDice(-1)} className="px-3 py-2 bg-red-500 text-white rounded text-base mb-1">-1</button>
        <div className="flex items-center justify-center space-x-2 mb-1">
          <span className="text-base font-medium">{diceCount}</span>
          <select
            value={diceType}
            onChange={handleDiceTypeChange}
            className="p-2 border rounded text-base"
          >
            {diceTypes.map(type => (
              <option key={type} value={type.slice(1)}>{type}</option>
            ))}
          </select>
        </div>
        <button onClick={() => adjustDamageDice(1)} className="px-3 py-2 bg-blue-500 text-white rounded text-base mb-1">+1</button>
        <button onClick={() => adjustDamageDice(2)} className="px-3 py-2 bg-blue-500 text-white rounded text-base mb-1">+2</button>
        <button onClick={() => adjustDamageDice(5)} className="px-3 py-2 bg-blue-500 text-white rounded text-base mb-1">+5</button>
      </div>
      <select
        name="damageType"
        value={safeAttack.damageType || ''}
        onChange={handleAttackChange}
        className="w-full p-2 border rounded text-base"
      >
        <option value="">Select damage type</option>
        {damageTypes.map(type => (
          <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
        ))}
      </select>
      <label className="flex items-center sm:col-span-2 text-base">
        <input
          type="checkbox"
          name="addAbilityToDamage"
          checked={safeAttack.addAbilityToDamage || false}
          onChange={(e) => handleAttackChange({
            target: {
              name: 'addAbilityToDamage',
              value: e.target.checked
            }
          })}
          className="mr-2 w-5 h-5"
        />
        Add ability modifier to damage
      </label>
    </div>
  );
};

export default AttackInputFields;