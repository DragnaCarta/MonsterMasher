import React, { useMemo } from 'react';
import { damageTypes, diceTypes } from '../utils/actionHelpers';
import { calculateSaveDC } from '../utils/calculations';

const SavingThrowInputFields = ({
  savingThrow,
  handleSavingThrowChange,
  abilityScores = {},
  proficiencyBonus = 2,
}) => {
  const safeSavingThrow = savingThrow || {};

  const saveDC = useMemo(() => {
    return calculateSaveDC(savingThrow, proficiencyBonus, abilityScores);
  }, [savingThrow, abilityScores, proficiencyBonus]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    let updatedSavingThrow = { ...safeSavingThrow, [name]: newValue };

    if (name === 'type' && value === 'aoe') {
      updatedSavingThrow = {
        ...updatedSavingThrow,
        aoeType: 'sphere',
        aoeSize: 20,
        aoeOrigin: 'self',
      };
    }

    handleSavingThrowChange({
      target: {
        name: 'savingThrow',
        value: updatedSavingThrow,
      },
    });
  };

  const averageDamage = () => {
    const [diceCount, diceType] = (safeSavingThrow.damageDice || '8d6').split(
      'd'
    );
    return Math.floor((parseInt(diceCount) * (parseInt(diceType) + 1)) / 2);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        name="type"
        value={safeSavingThrow.type || 'targeted'}
        onChange={handleInputChange}
        className="select"
      >
        <option value="targeted">Targeted</option>
        <option value="aoe">Area of Effect</option>
      </select>

      {safeSavingThrow.type === 'targeted' ? (
        <>
          <input
            type="number"
            name="targets"
            value={safeSavingThrow.targets || 1}
            onChange={handleInputChange}
            min="1"
            className="input w-16 text-center"
          />
          <select
            name="targetType"
            value={safeSavingThrow.targetType || 'creatures'}
            onChange={handleInputChange}
            className="select"
          >
            <option value="creatures">creatures</option>
            <option value="objects">objects</option>
            <option value="targets">targets</option>
          </select>
          <span>within</span>
          <input
            type="number"
            name="range"
            value={safeSavingThrow.range || 60}
            onChange={handleInputChange}
            className="input w-16 text-center"
            min="0"
          />
          <span>ft. must make a</span>
        </>
      ) : (
        <>
          <span>Each creature in a</span>
          <input
            type="number"
            name="aoeSize"
            value={safeSavingThrow.aoeSize || 20}
            onChange={handleInputChange}
            className="input w-16 text-center"
            min="1"
          />
          <span>-foot</span>
          <select
            name="aoeType"
            value={safeSavingThrow.aoeType || 'sphere'}
            onChange={handleInputChange}
            className="select"
          >
            <option value="sphere">sphere</option>
            <option value="cube">cube</option>
            <option value="cone">cone</option>
            <option value="cylinder">cylinder</option>
            <option value="line">line</option>
          </select>
          <span>originating from</span>
          <select
            name="aoeOrigin"
            value={safeSavingThrow.aoeOrigin || 'self'}
            onChange={handleInputChange}
            className="select"
          >
            <option value="self">self</option>
            <option value="point">a point</option>
          </select>
          {safeSavingThrow.aoeOrigin === 'point' && (
            <>
              <span>within</span>
              <input
                type="number"
                name="range"
                value={safeSavingThrow.range || 60}
                onChange={handleInputChange}
                className="input w-16 text-center"
                min="0"
              />
              <span>feet</span>
            </>
          )}
          <span>must make a</span>
        </>
      )}

      <span>DC {saveDC}</span>
      <select
        name="abilityScore"
        value={safeSavingThrow.abilityScore || 'DEX'}
        onChange={handleInputChange}
        className="select"
      >
        {['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map((ability) => (
          <option key={ability} value={ability}>
            {ability}
          </option>
        ))}
      </select>
      <span>saving throw</span>
      <span>(based on this creature's</span>
      <select
        name="monsterAbilityScore"
        value={
          safeSavingThrow.monsterAbilityScore ||
          safeSavingThrow.abilityScore ||
          'DEX'
        }
        onChange={handleInputChange}
        className="select"
      >
        {['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map((ability) => (
          <option key={ability} value={ability}>
            {ability}
          </option>
        ))}
      </select>
      <span>). A target takes</span>
      <span>{averageDamage()}</span>
      <span>(</span>
      <input
        type="number"
        name="damageDiceCount"
        value={parseInt((safeSavingThrow.damageDice || '8d6').split('d')[0])}
        onChange={(e) =>
          handleInputChange({
            target: {
              name: 'damageDice',
              value: `${e.target.value}d${
                (safeSavingThrow.damageDice || '8d6').split('d')[1]
              }`,
            },
          })
        }
        className="input w-16 text-center"
        min="1"
      />
      <select
        name="damageDiceType"
        value={(safeSavingThrow.damageDice || '8d6').split('d')[1]}
        onChange={(e) =>
          handleInputChange({
            target: {
              name: 'damageDice',
              value: `${(safeSavingThrow.damageDice || '8d6').split('d')[0]}d${
                e.target.value
              }`,
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
      <span>)</span>
      <select
        name="damageType"
        value={safeSavingThrow.damageType || ''}
        onChange={handleInputChange}
        className="select"
      >
        <option value="">Select damage type</option>
        {damageTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option> // Changed this line
        ))}
      </select>
      <span>damage on a failed save </span>
      <span>(</span>
      <select
        name="damageOnSuccess"
        value={safeSavingThrow.damageOnSuccess || 'none'}
        onChange={handleInputChange}
        className="select"
      >
        <option value="none">no damage on success</option>
        <option value="half">half damage on success</option>
      </select>
      <span>)</span>
      {safeSavingThrow.damageOnSuccess === 'half' && (
        <span>, or half as much damage on a successful one</span>
      )}
      <span>.</span>
    </div>
  );
};

export default SavingThrowInputFields;
