import React from 'react';
import { damageTypes, diceTypes } from '../utils/actionHelpers';

const AttackInputFields = ({ attack, handleAttackChange, adjustDamageDice }) => {
  return (
    <div className="mb-2 grid grid-cols-2 gap-2">
      <select
        name="type"
        value={attack.type || 'melee'}
        onChange={handleAttackChange}
        className="p-2 border rounded"
      >
        <option value="melee">Melee</option>
        <option value="ranged">Ranged</option>
      </select>
      <input
        type="text"
        name="range"
        value={attack.range || ''}
        onChange={handleAttackChange}
        placeholder="Range (e.g., 5 ft. or 30/120 ft.)"
        className="p-2 border rounded"
      />
      <input
        type="number"
        name="targets"
        value={attack.targets || '1'}
        onChange={handleAttackChange}
        placeholder="Number of targets"
        className="p-2 border rounded"
      />
      <select
        name="abilityScore"
        value={attack.abilityScore || 'STR'}
        onChange={handleAttackChange}
        className="p-2 border rounded"
      >
        <option value="STR">STR</option>
        <option value="DEX">DEX</option>
        <option value="CON">CON</option>
        <option value="INT">INT</option>
        <option value="WIS">WIS</option>
        <option value="CHA">CHA</option>
      </select>
      <div className="flex items-center space-x-1">
        <button onClick={() => adjustDamageDice(-5)} className="px-2 py-1 bg-red-500 text-white rounded text-sm">-5</button>
        <button onClick={() => adjustDamageDice(-2)} className="px-2 py-1 bg-red-500 text-white rounded text-sm">-2</button>
        <button onClick={() => adjustDamageDice(-1)} className="px-2 py-1 bg-red-500 text-white rounded text-sm">-1</button>
        <input
          type="text"
          name="damageDice"
          value={attack.damageDice || ''}
          onChange={handleAttackChange}
          className="p-2 border rounded w-20 text-center"
          readOnly
        />
        <button onClick={() => adjustDamageDice(1)} className="px-2 py-1 bg-blue-500 text-white rounded text-sm">+1</button>
        <button onClick={() => adjustDamageDice(2)} className="px-2 py-1 bg-blue-500 text-white rounded text-sm">+2</button>
        <button onClick={() => adjustDamageDice(5)} className="px-2 py-1 bg-blue-500 text-white rounded text-sm">+5</button>
      </div>
      <select
        name="damageDice"
        value={attack.damageDice?.split('d')[1] || 'd6'}
        onChange={(e) => {
          const currentDice = attack.damageDice?.split('d')[0] || '1';
          handleAttackChange({
            target: {
              name: 'damageDice',
              value: `${currentDice}${e.target.value}`
            }
          });
        }}
        className="p-2 border rounded"
      >
        {diceTypes.map(diceType => (
          <option key={diceType} value={diceType}>{diceType}</option>
        ))}
      </select>
      <select
        name="damageType"
        value={attack.damageType || ''}
        onChange={handleAttackChange}
        className="p-2 border rounded"
      >
        <option value="">Select damage type</option>
        {damageTypes.map(type => (
          <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
        ))}
      </select>
      <label className="flex items-center col-span-2">
        <input
          type="checkbox"
          name="addAbilityToDamage"
          checked={attack.addAbilityToDamage || false}
          onChange={(e) => handleAttackChange({
            target: {
              name: 'addAbilityToDamage',
              value: e.target.checked
            }
          })}
          className="mr-2"
        />
        Add ability modifier to damage
      </label>
    </div>
  );
};

export default AttackInputFields;