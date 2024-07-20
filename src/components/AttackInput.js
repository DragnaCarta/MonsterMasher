import React from 'react';
import { calculateModifier } from '../utils/calculations';

const AttackInput = ({ attack, updateAttack, abilityScores }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateAttack({
      ...attack,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const calculateToHitBonus = () => {
    const abilityMod = calculateModifier(abilityScores[attack.abilityScore]);
    // Assuming proficiency bonus of 2 for now. You might want to calculate this based on CR later.
    const proficiencyBonus = 2;
    return abilityMod + proficiencyBonus;
  };

  const calculateAverageDamage = () => {
    const dieAverage = (parseInt(attack.damageDieType.slice(1)) + 1) / 2;
    const diceDamage = attack.damageDice * dieAverage;
    const abilityMod = attack.addAbilityModifier ? calculateModifier(abilityScores[attack.abilityScore]) : 0;
    return Math.floor(diceDamage + abilityMod);
  };

  return (
    <div className="mb-4">
      <div className="flex flex-wrap -mx-2">
        <div className="w-1/2 px-2 mb-2">
          <select
            name="type"
            value={attack.type}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Melee">Melee</option>
            <option value="Ranged">Ranged</option>
          </select>
        </div>
        <div className="w-1/2 px-2 mb-2">
          <select
            name="weaponType"
            value={attack.weaponType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Weapon">Weapon</option>
            <option value="Spell">Spell</option>
          </select>
        </div>
      </div>
      <div className="mb-2">
        Attack: +{calculateToHitBonus()} (
        <select
          name="abilityScore"
          value={attack.abilityScore}
          onChange={handleChange}
          className="p-1 border rounded"
        >
          {Object.keys(abilityScores).map(ability => (
            <option key={ability} value={ability}>{ability}</option>
          ))}
        </select>
        ) to hit, range 
        <input
          type="number"
          name="range"
          value={attack.range}
          onChange={handleChange}
          className="w-16 p-1 border rounded mx-1"
          min="1"
        />
        ft., 
        <input
          type="number"
          name="targets"
          value={attack.targets}
          onChange={handleChange}
          className="w-16 p-1 border rounded mx-1"
          min="1"
        />
        target{attack.targets > 1 ? 's' : ''}.
      </div>
      <div>
        Hit: {calculateAverageDamage()} (
        <input
          type="number"
          name="damageDice"
          value={attack.damageDice}
          onChange={handleChange}
          className="w-16 p-1 border rounded"
          min="1"
        />
        <select
          name="damageDieType"
          value={attack.damageDieType}
          onChange={handleChange}
          className="p-1 border rounded mx-1"
        >
          {['d4', 'd6', 'd8', 'd10', 'd12'].map(die => (
            <option key={die} value={die}>{die}</option>
          ))}
        </select>
        + {attack.addAbilityModifier ? calculateModifier(abilityScores[attack.abilityScore]) : 0})
        <select
          name="damageType"
          value={attack.damageType}
          onChange={handleChange}
          className="p-1 border rounded mx-1"
        >
          {['slashing', 'piercing', 'bludgeoning', 'fire', 'cold', 'lightning', 'acid', 'poison', 'psychic', 'necrotic', 'radiant', 'force', 'thunder'].map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        damage
      </div>
      <label className="flex items-center mt-2">
        <input
          type="checkbox"
          name="addAbilityModifier"
          checked={attack.addAbilityModifier}
          onChange={handleChange}
          className="mr-2"
        />
        Add ability modifier to damage
      </label>
    </div>
  );
};

export default AttackInput;