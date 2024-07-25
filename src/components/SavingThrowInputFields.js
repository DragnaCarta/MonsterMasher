import React from 'react';
import { damageTypes, diceTypes } from '../utils/actionHelpers';

const SavingThrowInputFields = ({ savingThrow, handleSavingThrowChange, abilityScores = {}, proficiencyBonus = 2 }) => {
  const safeSavingThrow = savingThrow || {};

  const calculateSaveDC = (abilityScore) => {
    const abilityModifier = Math.floor(((abilityScores[abilityScore] || 10) - 10) / 2);
    return 8 + proficiencyBonus + abilityModifier;
  };

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
      // Simulate selecting the default AoE type to set up all necessary fields
      handleAoETypeChange({ target: { value: 'sphere' } }, updatedSavingThrow);
    }

    handleSavingThrowChange({
      target: {
        name: 'savingThrow',
        value: updatedSavingThrow
      }
    });
  };

  const handleAoETypeChange = (e, currentSavingThrow = safeSavingThrow) => {
    const { value } = e.target;
    const newSavingThrow = {
      ...currentSavingThrow,
      aoeType: value,
      aoeSize: value === 'cone' ? 30 : value === 'sphere' ? 20 : 15,
    };

    if (value === 'cone' || value === 'line') {
      newSavingThrow.aoeOrigin = 'self';
      delete newSavingThrow.range;
    } else if (newSavingThrow.aoeOrigin === 'self') {
      newSavingThrow.range = 60;
    }

    handleSavingThrowChange({
      target: {
        name: 'savingThrow',
        value: newSavingThrow
      }
    });
  };

  const isRangeVisible = safeSavingThrow.type === 'targeted' || 
    (safeSavingThrow.type === 'aoe' && !['cone', 'line'].includes(safeSavingThrow.aoeType));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <div>
        <label className="block mb-1">Ability Score</label>
        <select
          name="abilityScore"
          value={safeSavingThrow.abilityScore || 'DEX'}
          onChange={handleInputChange}
          className="w-full p-2 border rounded text-base"
        >
          {['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map(ability => (
            <option key={ability} value={ability}>{ability}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1">Save DC</label>
        <input
          type="number"
          name="saveDC"
          value={safeSavingThrow.saveDC || calculateSaveDC(safeSavingThrow.abilityScore || 'DEX')}
          readOnly
          className="w-full p-2 border rounded text-base bg-gray-100"
        />
      </div>
      <div>
        <label className="block mb-1">Type</label>
        <select
          name="type"
          value={safeSavingThrow.type || 'targeted'}
          onChange={handleInputChange}
          className="w-full p-2 border rounded text-base"
        >
          <option value="targeted">Targeted</option>
          <option value="aoe">Area of Effect</option>
        </select>
      </div>
      {safeSavingThrow.type === 'targeted' ? (
        <div>
          <label className="block mb-1">Number of Targets</label>
          <input
            type="number"
            name="targets"
            value={safeSavingThrow.targets || 1}
            onChange={handleInputChange}
            min="1"
            className="w-full p-2 border rounded text-base"
          />
        </div>
      ) : (
        <>
          <div>
            <label className="block mb-1">Area of Effect</label>
            <select
              name="aoeType"
              value={safeSavingThrow.aoeType || 'sphere'}
              onChange={handleAoETypeChange}
              className="w-full p-2 border rounded text-base"
            >
              <option value="sphere">Sphere</option>
              <option value="cube">Cube</option>
              <option value="cone">Cone</option>
              <option value="cylinder">Cylinder</option>
              <option value="line">Line</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Area Size</label>
            <div className="flex items-center">
              <input
                type="number"
                name="aoeSize"
                value={safeSavingThrow.aoeSize || 20}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-l text-base"
                min="1"
              />
              <span className="bg-gray-200 p-2 rounded-r border border-l-0">ft.</span>
            </div>
          </div>
          {!['cone', 'line'].includes(safeSavingThrow.aoeType) && (
            <div>
              <label className="block mb-1">Origin</label>
              <select
                name="aoeOrigin"
                value={safeSavingThrow.aoeOrigin || 'self'}
                onChange={handleInputChange}
                className="w-full p-2 border rounded text-base"
              >
                <option value="self">Self</option>
                <option value="point">Point</option>
              </select>
            </div>
          )}
        </>
      )}
      {isRangeVisible && (
        <div>
          <label className="block mb-1">Range</label>
          <div className="flex items-center">
            <input
              type="number"
              name="range"
              value={safeSavingThrow.range || 60}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-l text-base"
              min="0"
            />
            <span className="bg-gray-200 p-2 rounded-r border border-l-0">ft.</span>
          </div>
        </div>
      )}
      <div className="sm:col-span-2">
        <label className="block mb-1">Damage Dice</label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            name="damageDiceCount"
            value={parseInt((safeSavingThrow.damageDice || '8d6').split('d')[0])}
            onChange={(e) => handleInputChange({
              target: {
                name: 'damageDice',
                value: `${e.target.value}d${(safeSavingThrow.damageDice || '8d6').split('d')[1]}`
              }
            })}
            className="w-20 p-2 border rounded text-base text-center"
            min="1"
          />
          <select
            name="damageDiceType"
            value={(safeSavingThrow.damageDice || '8d6').split('d')[1]}
            onChange={(e) => handleInputChange({
              target: {
                name: 'damageDice',
                value: `${(safeSavingThrow.damageDice || '8d6').split('d')[0]}d${e.target.value}`
              }
            })}
            className="p-2 border rounded text-base"
          >
            {diceTypes.map(type => (
              <option key={type} value={type.slice(1)}>{type}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block mb-1">Damage Type</label>
        <select
          name="damageType"
          value={safeSavingThrow.damageType || ''}
          onChange={handleInputChange}
          className="w-full p-2 border rounded text-base"
        >
          <option value="">Select damage type</option>
          {damageTypes.map(type => (
            <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="flex items-center text-base">
          <input
            type="checkbox"
            name="halfDamageOnSave"
            checked={safeSavingThrow.halfDamageOnSave || false}
            onChange={handleInputChange}
            className="mr-2 w-5 h-5"
          />
          Half damage on successful save
        </label>
      </div>
    </div>
  );
};

export default SavingThrowInputFields;